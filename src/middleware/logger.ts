import type { Request, Response, NextFunction } from "express";

// Logs one line per request once the response has been sent, e.g.
//   [2026-11-23T22:40:01.123Z] GET /petitions?status=granted 200 - 84ms
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`
    );
  });

  next();
}
