import React from 'react';
import type { DynIconProps } from './DynIcon.types';

export const DynIcon: React.FC<DynIconProps> = ({ icon, ...rest }) => {
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, rest);
  }

  return (
    <span {...rest}>
      {typeof icon === 'string' ? icon : 'DynIcon placeholder'}
    </span>
  );
};

DynIcon.displayName = 'DynIcon';

export default DynIcon;
