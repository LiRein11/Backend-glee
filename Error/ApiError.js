class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(404, message);
  } // Статическая функция нужна для того, чтобы можно было к ней обратиться без создания объекта

  static internal(message) {
    return new ApiError(500, message);
  }

  static forBidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
