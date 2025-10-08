export interface DynContainerProps {
  height?: number;
  noBorder?: boolean;
  noPadding?: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface DynContainerRef {
  focus(): void;
}
