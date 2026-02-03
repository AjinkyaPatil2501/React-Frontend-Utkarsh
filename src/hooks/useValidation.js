import { useState } from "react";
import {  validateUser } from "../validation/validator";

export const useValidation = (schema) => {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const validationErrors = validateUser(data, schema);
    setErrors(validationErrors);
    return validationErrors;
  };

  const isValid = (errObj) =>
    Object.keys(errObj).length === 0 ||
    Object.values(errObj).every(
      (v) => typeof v === "object" ? isValid(v) : !v
    );

  return { errors, validate, isValid };
};
