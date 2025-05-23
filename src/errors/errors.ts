class CustomError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  static BadRequest(message: string) {
    return new CustomError(400, message);
  }

  static NotFound(message: string) {
    return new CustomError(404, message);
  }
}

export default CustomError;
