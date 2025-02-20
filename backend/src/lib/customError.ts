export class customError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "custom error";

    Object.setPrototypeOf(this, customError.prototype);
  }
}
