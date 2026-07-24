const ApiError = require("../utils/ApiError");
const { sendError } = require("../utils/response");

function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, "Internal server error", 500);
}

module.exports = errorHandler;
