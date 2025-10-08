import * as React from 'react';
import classNames from 'classnames';
import { DynBadgeProps, BadgeStatus, BadgeSize } from '../../types/badge.types';
import { formatBadgeValue, isThemeColor } from '../../utils/dynFormatters';
import { DynIcon } from '../DynIcon/DynIcon';
import styles from './DynBadge.module.css';

export const DynBadge: React.FC<DynBadgeProps> = ({
  value = 0,
  color = 'color-07',
  status,
  size = 'medium',
  icon,
  showBorder = false,
  ariaLabel,
  children,
  className,
  'data-testid': testId,
  id,
  ...rest
}: DynBadgeProps) => {
  const displayValue = formatBadgeValue(value);
  const isCustomColor = !isThemeColor(color);
  const customStyle = isCustomColor ? { backgroundColor: color } : undefined;

  const badgeClasses = classNames(
    styles['dyn-badge'],
    styles[`dyn-badge--${size}`],
    isThemeColor(color) && styles[`dyn-badge--${color}`],
    status && styles[`dyn-badge--${status}`],
    showBorder && styles['dyn-badge--border'],
    icon && !value && styles['dyn-badge--icon-only'],
    value > 0 && styles['dyn-badge--with-value'],
    className
  );

  const renderIcon = () => {
    if (icon === true && status) {
      // Auto icon based on status
      const statusIcons = {
        positive: 'ok',
        negative: 'close',
        warning: 'warning',
        disabled: 'minus'
      };
      return <DynIcon icon={statusIcons[status]} />;
    }

    if (typeof icon === 'string') {
      return <DynIcon icon={icon} />;
    }

    return icon ? <span className={styles['dyn-badge-custom-icon']}>{icon}</span> : null;
  };

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (icon && !value) {
      return renderIcon();
    }

    if (value > 0 && icon) {
      return (
        <>
          {renderIcon()}
          <span className={styles['dyn-badge-value']}>{displayValue}</span>
        </>
      );
    }

    return value > 0 ? (
      <span className={styles['dyn-badge-value']}>{displayValue}</span>
    ) : null;
  };

  return (
    <span
      id={id}
      className={badgeClasses}
      style={customStyle}
      data-testid={testId}
      aria-label={ariaLabel || `Badge with value ${displayValue}`}
      role="status"
      {...rest}
    >
      {renderContent()}
    </span>
  );
};

DynBadge.displayName = 'DynBadge';

export default DynBadge;