import HttpError from "@app-store/shared/helpers/errors/HttpError";

export default class BadRequestError extends HttpError {
  code: number;

  constructor(message: string) {
    super(message);
    this.code = 400;
  }
}
