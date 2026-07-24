function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, message = "Internal server error", statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
}

module.exports = { sendSuccess, sendError };
