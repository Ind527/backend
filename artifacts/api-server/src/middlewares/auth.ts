import type { NextFunction, Request, Response } from "express";
import { supabase } from "../services/supabase";

export type AuthUser = {
  id: string;
  email?: string;
  role: "admin" | "editor";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
      return;
    }

    const token = authorization.slice("Bearer ".length).trim();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      res.status(401).json({
        success: false,
        error: "Invalid or expired authentication token.",
      });
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      res.status(403).json({
        success: false,
        error: "User profile not found.",
      });
      return;
    }

    if (profile.role !== "admin" && profile.role !== "editor") {
      res.status(403).json({
        success: false,
        error: "Invalid user role.",
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
    };

    next();
  } catch (error) {
    req.log?.error?.({ err: error }, "Authentication error");

    res.status(500).json({
      success: false,
      error: "Authentication service error.",
    });
  }
}