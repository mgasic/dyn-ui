import * as React from 'react';
import { sxToStyle, type SxProps } from '../../system/sx';

export type DynBoxProps = React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps };

export function DynBox({ sx, style, ...rest }: DynBoxProps) {
  const resolved = sxToStyle(sx);
  return <div style={{ ...resolved, ...style }} {...rest} />;
}

export default DynBox;
