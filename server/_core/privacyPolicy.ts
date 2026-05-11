import type { Express } from "express";
import * as fs from "fs";
import * as path from "path";

export function registerPrivacyPolicyRoute(app: Express) {
  // Helper to serve an HTML file from the server directory
  function serveHtml(filename: string, fallbackTitle: string) {
    return (_req: any, res: any) => {
      try {
        const possiblePaths = [
          path.join(__dirname, `../${filename}`),
          path.join(__dirname, `../../server/${filename}`),
          path.join(process.cwd(), `server/${filename}`),
        ];
        let html: string | null = null;
        for (const filePath of possiblePaths) {
          if (fs.existsSync(filePath)) {
            html = fs.readFileSync(filePath, "utf-8");
            break;
          }
        }
        if (!html) {
          html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${fallbackTitle} — Clickeros AI</title></head><body style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;"><h1>${fallbackTitle}</h1><p>Contact: <a href="mailto:privacy@clickeros.ai">privacy@clickeros.ai</a></p></body></html>`;
        }
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.send(html);
      } catch (err) {
        console.error(`[${filename}] Error:`, err);
        res.status(500).send("Error loading page.");
      }
    };
  }

  // Cookie Policy
  app.get("/cookie-policy", serveHtml("cookie-policy.html", "Cookie Policy"));

  // Data Safety
  app.get("/data-safety", serveHtml("data-safety.html", "Data Safety"));

  // Individual permission policy pages
  app.get("/permissions/camera", serveHtml("permission-camera.html", "CAMERA Permission Policy"));
  app.get("/permissions/record-audio", serveHtml("permission-record-audio.html", "RECORD_AUDIO Permission Policy"));
  app.get("/permissions/get-accounts", serveHtml("permission-get-accounts.html", "GET_ACCOUNTS Permission Policy"));

  // Serve the Terms of Service HTML page at /terms-of-service
  app.get("/terms-of-service", (_req, res) => {
    try {
      const possiblePaths = [
        path.join(__dirname, "../terms-of-service.html"),
        path.join(__dirname, "../../server/terms-of-service.html"),
        path.join(process.cwd(), "server/terms-of-service.html"),
      ];
      let html: string | null = null;
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          html = fs.readFileSync(filePath, "utf-8");
          break;
        }
      }
      if (!html) {
        html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Terms of Service — Clickeros AI</title></head><body style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;"><h1>Terms of Service</h1><p>Contact: <a href="mailto:legal@clickeros.ai">legal@clickeros.ai</a></p></body></html>`;
      }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    } catch (err) {
      console.error("[terms-of-service] Error serving page:", err);
      res.status(500).send("Error loading terms of service page.");
    }
  });

  // Serve the Privacy Policy HTML page at /privacy-policy
  // This URL is submitted to Google Play Console as the app's privacy policy URL
  app.get("/privacy-policy", (_req, res) => {
    try {
      // Try multiple possible paths for the HTML file (dev vs compiled)
      const possiblePaths = [
        path.join(__dirname, "../privacy-policy.html"),
        path.join(__dirname, "../../server/privacy-policy.html"),
        path.join(process.cwd(), "server/privacy-policy.html"),
      ];

      let html: string | null = null;
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          html = fs.readFileSync(filePath, "utf-8");
          break;
        }
      }

      if (!html) {
        // Fallback: minimal inline privacy policy
        html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Privacy Policy — Clickeros AI</title></head><body style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;"><h1>Clickeros AI Privacy Policy</h1><p>Last updated: May 11, 2026</p><p>Contact: <a href="mailto:privacy@clickeros.ai">privacy@clickeros.ai</a></p></body></html>`;
      }

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(html);
    } catch (err) {
      console.error("[privacy-policy] Error serving page:", err);
      res.status(500).send("Error loading privacy policy page.");
    }
  });
}
