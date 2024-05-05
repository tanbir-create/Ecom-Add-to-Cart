class AppError extends Error {
    constructor(message, httpStatusCode, type, details = {}) {
        super(message);
        this.statusCode = httpStatusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.name = "AppError";
        this.type = type || "";
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
