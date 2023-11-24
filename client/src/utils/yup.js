import { object } from "dot-object";

export const parseYupError = (error) => {
  const message = {};
  error.inner.forEach((err) => {
    if (!message[err.path]) {
      message[err.path] = err.message;
    }
  });
  console.log(error.inner, "error");
  return object(message);
};

export const isYupError = (error) => error?.name === "ValidationError";
