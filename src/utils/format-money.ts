export const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
