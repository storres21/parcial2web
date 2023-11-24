export function BusinessLogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
  }
  

export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST,
    VALIDATION_ERROR
}
  /* archivo: src/shared/errors/business-errors.ts */
