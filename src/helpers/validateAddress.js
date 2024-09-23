const getValidAddress = (data) => {
  const resultantAddress = [];
  resultantAddress.push(data?.address_line_1);
  resultantAddress.push(data?.address_line_2);
  resultantAddress.push(data?.city);
  resultantAddress.push(data?.state);
  resultantAddress.push(data?.pincode);

  return resultantAddress.filter((ele) => ele).join(", ");
};
export default getValidAddress;
