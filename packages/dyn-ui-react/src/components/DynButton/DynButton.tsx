import React from 'react';
import type { DynButtonProps } from './DynButton.types';

export const DynButton: React.FC<DynButtonProps> = ({
  label = 'DynButton placeholder',
  icon,
  loading,
  danger,
  kind,
  size,
  ariaLabel,
  ariaExpanded,
  type = 'button',
  ...buttonProps
}) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      data-icon={icon ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      data-danger={danger ? 'true' : undefined}
      data-kind={kind}
      data-size={size}
      {...buttonProps}
    >
      {label}
    </button>
  );
};

DynButton.displayName = 'DynButton';

export default DynButton;
