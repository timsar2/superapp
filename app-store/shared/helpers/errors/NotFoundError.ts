import HttpError from "@app-store/shared/helpers/errors/HttpError";

export default class NotFoundError extends HttpError {
  code: number;

  constructor(message: string) {
    super(message);
    this.code = 404;
  }
}
