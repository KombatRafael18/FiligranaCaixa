export class ApiError extends Error {
  constructor(message, errorBody, response) {
    super(message);
    this._errorBody = errorBody;
    this._response = response;
  }

  get errorBody() {
    return this._errorBody;
  }

  get response() {
    return this._response;
  }

  isValidationError() {
    return this._response?.status === 400;
  }

  isNotFoundError() {
    return this._response?.status === 404;
  }

  isClientError() {
    return this._response?.status >= 400 && this._response?.status < 500;
  }

  isServerError() {
    return this._response?.status >= 500;
  }

  isNetworkError() {
    return !this._response;
  }
}
