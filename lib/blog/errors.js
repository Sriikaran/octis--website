export class BlogError extends Error {
  constructor(status, code, message, fields = null) {
    super(message);
    this.name = 'BlogError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
