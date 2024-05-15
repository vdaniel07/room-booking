export const required = (propertyName, value) => {
  return (value && value.length) > 0
    ? { error: false, errorText: "" }
    : { error: true, errorText: `${propertyName} is required` };
};

export const emailFormat = (value) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/;
  return value && regex.test(value)
    ? { error: false, errorText: "" }
    : { error: true, errorText: "Must be a valid email format" };
};
