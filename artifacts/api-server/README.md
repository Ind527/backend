# SA Media Backend API

REST API backend untuk aplikasi SA Media. Backend ini menggunakan Express dan Supabase yang sudah memiliki tabel `creators`, `products`, `contents`, serta bucket Storage `videos`.

## Menjalankan lokal

Pastikan Node.js dan pnpm tersedia, lalu jalankan:

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
```

The package also supports the requested npm commands when run from `artifacts/api-server`:

```bash
npm install
npm start
```

`npm start` runs `node src/server.js`. That entry point uses the existing TypeScript server and builds it automatically when the bundled output is missing. `npm run dev` uses nodemon with the same entry point.

Untuk menjalankan hasil build:

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

Workflow Replit menyediakan `PORT` otomatis. Untuk menjalankan di luar workflow, set `PORT` terlebih dahulu.

## Environment variables

Wajib:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-only-secret-key
```

`SUPABASE_SECRET_KEY` hanya digunakan di server dan tidak pernah dikirim ke client. Jangan commit file `.env`.

## Endpoint

Semua endpoint menggunakan prefix `/api`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/health` | Memeriksa status backend |
| GET | `/api/products` | Mengambil semua produk |
| GET | `/api/contents` | Mengambil konten beserta produk terkait |
| POST | `/api/contents` | Membuat konten baru |
| GET | `/api/creators` | Mengambil semua creator |
| POST | `/api/creators` | Membuat creator baru |
| POST | `/api/upload-video` | Upload video dengan multipart field `video` |

`/api/healthz` juga tersedia untuk health check workflow.

## Contoh request

Health check:

```bash
curl http://localhost:5000/api/health
```

Membuat content:

```bash
curl -X POST http://localhost:5000/api/contents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Video produk baru",
    "video_url": "https://example.com/video.mp4",
    "caption": "Caption video",
    "hashtags": "#samedia #produk",
    "product_id": "product-id",
    "scheduled_at": "2026-08-18T10:00:00Z",
    "status": "scheduled"
  }'
```

Membuat creator:

```bash
curl -X POST http://localhost:5000/api/creators \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nama Creator",
    "whatsapp_number": "+628123456789",
    "status": "active",
    "level": "silver"
  }'
```

Upload video:

```bash
curl -X POST http://localhost:5000/api/upload-video \
  -F "video=@./video.mp4"
```

Upload menerima file video maksimal 500 MB, memberi nama unik, dan tidak menghapus file lama.