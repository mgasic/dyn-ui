# Convert-To-TypeScript-First-Fixed.ps1
# PowerShell script to convert DYN UI project to strict TypeScript-first architecture

param(
    [string]$ProjectPath = ".",
    [switch]$Force = $false,
    [switch]$SkipBackup = $false
)

# Color functions for output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }

function Show-Header {
    Write-Host @"
🚀 ============================================== 🚀
    DYN UI TypeScript-First Conversion Script
           Enterprise Grade UI Library
🚀 ============================================== 🚀
"@ -ForegroundColor Magenta
}

function Update-PackageJsonFixed {
    Write-Info "Updating package.json scripts for TypeScript configs..."

    $packageJsonPath = "packages/dyn-ui-react/package.json"

    if (Test-Path $packageJsonPath) {
        # Read and parse JSON manually to avoid PowerShell property issues
        $jsonContent = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

        # Convert to hashtable for easier manipulation
        $packageHash = @{}
        $jsonContent.PSObject.Properties | ForEach-Object {
            $packageHash[$_.Name] = $_.Value
        }

        # Ensure scripts exists
        if (-not $packageHash.ContainsKey('scripts')) {
            $packageHash.scripts = @{}
        }

        # Convert scripts to hashtable if it's not already
        $scriptsHash = @{}
        if ($packageHash.scripts -is [System.Management.Automation.PSCustomObject]) {
            $packageHash.scripts.PSObject.Properties | ForEach-Object {
                $scriptsHash[$_.Name] = $_.Value
            }
        } else {
            $scriptsHash = $packageHash.scripts
        }

        # Update scripts with TypeScript configs
        $scriptsHash["build"] = "rollup -c rollup.config.ts --configPlugin typescript"
        $scriptsHash["test"] = "jest --config jest.config.ts"
        $scriptsHash["test:watch"] = "jest --config jest.config.ts --watch"
        $scriptsHash["test:coverage"] = "jest --config jest.config.ts --coverage"
        $scriptsHash["type-check"] = "tsc --noEmit"
        $scriptsHash["lint:types"] = "tsc --noEmit --strict"

        $packageHash.scripts = $scriptsHash

        # Ensure devDependencies exists
        if (-not $packageHash.ContainsKey('devDependencies')) {
            $packageHash.devDependencies = @{}
        }

        # Convert devDependencies to hashtable
        $devDepsHash = @{}
        if ($packageHash.devDependencies -is [System.Management.Automation.PSCustomObject]) {
            $packageHash.devDependencies.PSObject.Properties | ForEach-Object {
                $devDepsHash[$_.Name] = $_.Value
            }
        } else {
            $devDepsHash = $packageHash.devDependencies
        }

        # Add required TypeScript dependencies
        $devDepsHash["@types/jest"] = "^29.5.8"
        $devDepsHash["@jest/globals"] = "^29.7.0"
        $devDepsHash["jest"] = "^29.7.0"
        $devDepsHash["ts-jest"] = "^29.1.1"
        $devDepsHash["@testing-library/jest-dom"] = "^6.1.4"
        $devDepsHash["identity-obj-proxy"] = "^3.0.0"
        $devDepsHash["jest-transform-stub"] = "^2.0.0"

        $packageHash.devDependencies = $devDepsHash

        # Convert back to JSON and save
        $newJson = $packageHash | ConvertTo-Json -Depth 10
        Set-Content $packageJsonPath -Value $newJson -Encoding UTF8
        Write-Success "Updated package.json with TypeScript-first scripts"
    } else {
        Write-Warning "package.json not found at $packageJsonPath"
    }
}

function Create-JestConfig {
    Write-Info "Creating strict TypeScript Jest configuration..."

    $jestConfig = @"
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/setupTests.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub'
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
} as const;

export default config;
"@

    Set-Content -Path "packages/dyn-ui-react/jest.config.ts" -Value $jestConfig -Encoding UTF8

    # Remove old JS config if exists
    if (Test-Path "packages/dyn-ui-react/jest.config.js") {
        Remove-Item "packages/dyn-ui-react/jest.config.js" -Force
        Write-Success "Removed jest.config.js (replaced with .ts)"
    }

    Write-Success "Created jest.config.ts with strict TypeScript configuration"
}

function Create-SetupTests {
    Write-Info "Creating TypeScript setup tests file..."

    $setupTests = @"
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [];

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getBoundingClientRect
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  writable: true,
  value: jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn()
  }))
});
"@

    New-Item -ItemType Directory -Path "packages/dyn-ui-react/src" -Force | Out-Null
    Set-Content -Path "packages/dyn-ui-react/src/setupTests.ts" -Value $setupTests -Encoding UTF8
    Write-Success "Created src/setupTests.ts with proper TypeScript mocks"
}

function Create-TypeUtilities {
    Write-Info "Creating TypeScript utility types..."

    $utilityTypes = @"
/**
 * TypeScript utility types for DYN UI
 * Strict typing utilities for enterprise-grade components
 */

// Component props with required children
export type ComponentWithChildren<T = {}> = T & {
  children: React.ReactNode;
};

// Strict event handlers
export type ClickHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;
export type ChangeHandler<T = string> = (value: T) => void;

// CSS class names union
export type ClassName = string | string[] | Record<string, boolean> | undefined;

// Common size variants
export type Size = 'small' | 'medium' | 'large';

// Common color variants
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

// Position types
export type Position = 'top' | 'bottom' | 'left' | 'right';

// Validation result
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

// Loading state
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
"@

    New-Item -ItemType Directory -Path "packages/dyn-ui-react/src/types" -Force | Out-Null
    Set-Content -Path "packages/dyn-ui-react/src/types/utilities.ts" -Value $utilityTypes -Encoding UTF8
    Write-Success "Created src/types/utilities.ts with strict TypeScript utilities"
}

function Show-Summary {
    Write-Host @"

🎉 ============================================== 🎉
         TypeScript-First Conversion Complete!
🎉 ============================================== 🎉

✅ COMPLETED TASKS:
   📝 jest.config.ts - Created
   📝 setupTests.ts - Created with proper mocks
   📝 package.json - Scripts updated
   📝 utilities.ts - TypeScript utility types

🚀 NEXT STEPS:
   1. Run: pnpm install
   2. Test: pnpm type-check
   3. Build: pnpm build
   4. Test: pnpm test

🎯 CONVERSION SUCCESSFUL!

"@ -ForegroundColor Green
}

# Main execution
try {
    Show-Header

    if (-not (Test-Path "packages/dyn-ui-react")) {
        Write-Error "dyn-ui-react package not found. Run this script from the project root."
        exit 1
    }

    Write-Info "Starting TypeScript-first conversion..."

    Create-JestConfig
    Create-SetupTests
    Update-PackageJsonFixed
    Create-TypeUtilities

    Show-Summary
}
catch {
    Write-Error "Conversion failed: $($_.Exception.Message)"
    Write-Info "Error details: $($_.Exception)"
    exit 1
}
