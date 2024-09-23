export const numberValidation = (event) => {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
};

export const amountValidation = (event) => {
  if (!/!^(?!.*[eE]).*$/.test(event.key)) {
    event.preventDefault();
  }
};

export const numberAlphabetValidation = (event) => {
  if (!/^[a-zA-Z0-9\s]+$/.test(event.key)) {
    event.preventDefault();
  }
};

export const nameValidation = (event) => {
  if (!/^[a-zA-Z0-9.\-\s]+$/.test(event.key)) {
    event.preventDefault();
  }
};

export const emailValidation = (event) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(event.key)) {
    event.preventDefault();
  }
};

export const panCardValidation = (event) => {
  if (!/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(event.key)) {
    event.preventDefault();
  }
};
export const gstValidation = (event) => {
  if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(event.key)) {
    event.preventDefault();
  }
};

export const decimalInputValidation = (e, options = {}) => {
  const defaultOptions = { decimalPlaces: 2, type: "", restrictNegative: true };

  options = { ...defaultOptions, ...options };
  const { decimalPlaces, type, restrictNegative } = options;

  const inputValue = e.target.value;

  if (!restrictNegative && !inputValue.length && e.key === "-") return;

  let regex;

  if (type === "discount") {
    regex = /^(100(\.00?)?|(\d{0,2}(\.\d{0,2})?))$/;
  } else if (!restrictNegative) {
    regex = new RegExp(`^-?\\d+(\\.\\d{0,${decimalPlaces}})?$`);
  } else if (decimalPlaces === 4) {
    regex = /^(?:\d{1,10}(?:\.\d{0,4})?|\d{1,10})$/;
  } else {
    regex = new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`);
  }

  const newValue =
    inputValue.slice(0, e.target.selectionStart) +
    e.key +
    inputValue.slice(e.target.selectionStart);

  if (!regex.test(newValue)) {
    e.preventDefault();
  }
};

export const handleScroll = (e) => {
  e.target.blur();
  e.stopPropagation();
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const dateFormat = "YYYY-MM-DD";
