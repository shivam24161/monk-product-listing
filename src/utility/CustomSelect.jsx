import { ActionList, Icon, Popover } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import React, { useState } from "react";

const CustomSelect = (props) => {
  const { className = "", value, onChange } = props;
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = () =>
    setPopoverActive((popoverActive) => !popoverActive);

  const activator = (
    <div
      className={`custom-popover ${className}`}
      onClick={togglePopoverActive}
    >
      <span className="custom-popover-btn">{value || "% off"}</span>
      <span>
        <Icon source={popoverActive ? ChevronUpIcon : ChevronDownIcon} />
      </span>
    </div>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      fullWidth
    >
      <ActionList
        actionRole="menuitem"
        items={[
          {
            content: "Flat off",
            onAction: () => {
              onChange("Flat off");
              setPopoverActive(false);
            },
            active: value === "Flat off",
          },
          {
            content: "% off",
            onAction: () => {
              onChange("% off");
              setPopoverActive(false);
            },
            active: value === "% off",
          },
        ]}
      />
    </Popover>
  );
};

export default CustomSelect;
