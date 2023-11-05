class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.stetusCode = 400;
  }
}

module.exports = BadRequestError;
