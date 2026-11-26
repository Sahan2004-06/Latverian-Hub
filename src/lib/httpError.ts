// An error that knows which HTTP status it should produce.
// Route handlers `throw new HttpError(404, "...")` and the central
// error handler turns it into a JSON response.
export class HttpError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}
