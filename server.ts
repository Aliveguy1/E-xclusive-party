import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Admin Approval: Generate QR Code
  app.post("/api/admin/approve-party", async (req, res) => {
    const { partyId, partyLink } = req.body;
    
    if (!partyId || !partyLink) {
      return res.status(400).json({ error: "Missing partyId or partyLink" });
    }

    try {
      // Generate QR Code as Data URL
      const qrCodeDataUrl = await QRCode.toDataURL(partyLink);
      
      // In a real app, we'd update Firestore here or return it to be updated
      // For now, return it to the client
      res.json({ 
        success: true, 
        partyId, 
        qrCode: qrCodeDataUrl,
        message: "Party approved and QR code generated"
      });
    } catch (err) {
      console.error("QR Generation Error:", err);
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
