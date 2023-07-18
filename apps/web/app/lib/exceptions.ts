/* eslint-disable max-classes-per-file */

export class TalosServerDownError extends Error {
  constructor(message = 'Talos Server is not running on localhost:8000.') {
    super(message);
    this.name = 'TalosServerDownError';
  }
}

export class NetworkResponseError extends Error {
  constructor(message = 'Network Response was not ok.') {
    super(message);
    this.name = 'NetworkResponseError';
  }
}

export class UnsuccessfulZodParsingError extends Error {
  constructor(
    message = 'Data could not be parsed into a schema<T> or ErrorAPIResponseSchema'
  ) {
    super(message);
    this.name = 'UnsuccessfulZodParsing';
  }
}

export class UnsuccessfulTalosServerRequest extends Error {
  constructor(
    error: ErrorOptions,
    message = 'Talos Server API Endpoint Request was unsuccessful'
  ) {
    super(message, error);
    this.name = 'NetworkResponseError';
  }
}
