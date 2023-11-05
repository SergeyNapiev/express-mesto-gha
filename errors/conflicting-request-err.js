class ConflictingRequestError extends Error {
  constructor(message) {
    super(message);
    this.stetusCode = 409;
  }
}

module.exports = ConflictingRequestError;
