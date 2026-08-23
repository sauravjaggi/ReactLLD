import type { ReactNode } from "react";
import { IconButton, Tooltip } from "@mui/material";
import "./index.scss";

interface IconActionButtonProps {
  icon: ReactNode;
  label?: ReactNode;
  onClick?: () => void;
  active?: boolean;
  tooltip?: string;
  color?: "default" | "primary" | "error";
  ariaLabel: string;
}

const IconActionButton = ({
  icon,
  label,
  onClick,
  active = false,
  tooltip,
  color = "default",
  ariaLabel,
}: IconActionButtonProps) => {
  const content = (
    <div
      className={`icon-action-button ${active ? "is-active" : ""} icon-action-button--${color}`}
    >
      <IconButton
        size="small"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={active}
      >
        {icon}
      </IconButton>
      {label !== undefined && (
        <span className="icon-action-button__label">{label}</span>
      )}
    </div>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default IconActionButton;
