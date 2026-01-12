
import { S3Client } from "@aws-sdk/client-s3";

/**
 * CLOUDFLARE R2 / S3 CONNECTION GUIDE:
 * 1. Bucket: Create a bucket in Cloudflare R2.
 * 2. CORS: In Bucket Settings, add a CORS policy to allow browser uploads (Origins: ["*"]).
 * 3. API Token: Go to R2 Overview -> "Manage R2 API Tokens" -> "Create API Token".
 * 4. Permissions: Choose "Object Read & Write" and "Apply to specific buckets".
 * 5. Endpoint: Your endpoint is https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 */
export const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://YOUR_CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "YOUR_R2_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_R2_SECRET_ACCESS_KEY",
  },
});

export const BUCKET_NAME = "your-bucket-name";
export const PUBLIC_URL_BASE = `https://pub-your-unique-id.r2.dev`; // Found in R2 Bucket -> Settings -> Public Access
