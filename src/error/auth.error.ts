export class AuthError extends Error {
  status = 401;

  constructor(message = "Sorry you are not authorized") {
    super(message);
  }
}
