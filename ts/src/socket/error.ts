export const ValidationErrorName = "validation_error";

export const validationError = (msg: string): Error => {
  const err = new Error(msg);
  err.name = ValidationErrorName;
  return err;
};
