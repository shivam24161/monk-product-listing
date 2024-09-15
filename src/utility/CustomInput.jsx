import React from "react";

const CustomInput = (props) => {
  const { value, onChange ,className=""} = props;
  return (
    <input
      className={`custom-input ${className}`}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default CustomInput;
