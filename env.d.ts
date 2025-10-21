/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

declare module '*.md?raw' {
  const content: string;
  export default content;
}
