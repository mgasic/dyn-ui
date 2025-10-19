/// <reference types="react" />
/// <reference types="react-dom" />

// CSS Modules - samo TypeScript pristup
declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "*.module.scss" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "*.module.sass" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

// NOTE: do not redeclare the 'react' module here — it conflicts with @types/react
// and breaks ES module named imports. The project relies on proper React
// type definitions from node_modules/@types/react instead.

// SVG kao React komponente
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

// Image formats
declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

// JSON modules
declare module "*.json" {
  const value: any;
  export default value;
}

// Jest i Testing Library extensions
declare module 'jest-axe' {
  export function toHaveNoViolations(): any;
  export function axe(element: any, options?: any): Promise<any>;
}

declare module 'vitest-axe' {
  export function toHaveNoViolations(): any;
}

// Design Token CSS Variables Support
interface CSSStyleDeclaration {
  [key: `--dyn-${string}`]: string;
}

// Global Test Environment
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

// Design token types
declare namespace DynUI {
  export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
  export type SpacingScale = ComponentSize;
  export type ColorScheme = "light" | "dark" | "system";
  export type StatusType = "online" | "offline" | "away" | "busy";
  export type ShapeType = "circle" | "square" | "rounded";
}
