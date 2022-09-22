// TODO: add global error handler class

export class HttpError extends Error {
  constructor(
    public code = 500,
    public message = 'An unknown error occurred!'
  ) {
    super(message);
  }
}

export const HTTP_NOT_FOUND = 'Entity Not found ';
