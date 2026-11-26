import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/httpError.js";

// Runs for any URL no route matched.
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} does not exist in Latveria`));
}

// The ONE place errors become responses. Express knows this is an error
// handler because it takes four arguments (err, req, res, next).
// In Express 5, an error thrown (or a rejected promise) inside an async
// route handler is forwarded here automatically.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Errors we threw on purpose (400 validation, 404 not found, ...)
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // express.json() throws this when the body is not valid JSON
  if (isJsonParseError(err)) {
    return res.status(400).json({ error: "Request body is not valid JSON" });
  }

  // Anything else is a bug or a database failure: log it, hide the internals.
  console.error(err);
  return res.status(500).json({ error: "Internal server error. Doom has been notified." });
}

function isJsonParseError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as { type: unknown }).type === "entity.parse.failed"
  );
}
