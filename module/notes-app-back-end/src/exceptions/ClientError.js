//@ Custom error yang mengindikasikan eror karena masalah yang terjadi pada client
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

module.exports = ClientError;