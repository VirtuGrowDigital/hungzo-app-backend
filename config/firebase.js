import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Enable __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const serviceAccountPath = path.join(
  __dirname,
  "hangzo-app-3ea24-firebase-adminsdk-fbsvc-76f456c4d7.json"
);

// Safety check
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("❌ Firebase service account JSON not found at root");
}

// Load credentials
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf-8")
);

// Prevent double initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin Initialized Successfully");
}

export default admin;
