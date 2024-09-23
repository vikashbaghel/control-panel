export const toIndianCurrency = (num, decimalPlaces = 2) => {
  const curr =
    num &&
    Number(num).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: decimalPlaces,
    });

  return <span className="currency">{curr}</span>;
};

export const toRoundUpValue = (num) => {
  const curr = Math.round(num * 100) / 100;
  return <span className="currency">{curr}</span>;
};

export const convertNumberToWords = (number) => {
  number = number.toString();
  let num = parseFloat(number.replace(/,/g, ""));
  const suffixes = ["", "L", "Cr"];
  let suffixIndex = 0;

  while (num >= 100000 && suffixIndex < suffixes.length - 1) {
    num /= 100000;
    suffixIndex++;
  }

  const formattedNumber = num.toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let result = `${formattedNumber} ${suffixes[suffixIndex]}`;

  return <span className="currency">{result}</span>;
};
