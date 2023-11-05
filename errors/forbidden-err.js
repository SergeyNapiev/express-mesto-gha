class ForbiddeError extends Error {
  constructor(message) {
    super(message);
    this.stetusCode = 403;
  }
}

module.exports = ForbiddeError;
