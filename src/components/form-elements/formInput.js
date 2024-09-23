import { Input } from "antd";
import { regex } from "./regex";
import { decimalInputValidation } from "../../helpers/regex";

export default function FormInput({
  value,
  params,
  onChange,
  formatter,
  type = "alnum",
}) {
  const handleKeyPress = (e) => {
    const pressedKey = String.fromCharCode(e.charCode);
    if (!regex[type].test(pressedKey) && pressedKey !== "") {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    if (type === "decimal") return onChange(e.target.value, e);
    if (regex[type].test(e.target.value) && onChange) {
      if (formatter) {
        onChange(formatter(e.target.value || ""), e);
      } else onChange(e.target.value, e);
    }
  };

  return (
    <Input
      value={value}
      onKeyPress={(e) =>
        type === "decimal" ? decimalInputValidation(e) : handleKeyPress(e)
      }
      onChange={handleInputChange}
      {...(params || {})}
    />
  );
}
