import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DynButton, ThemeProvider } from '@dyn-ui/react';

import '@dyn-ui/react/styles/dyn-ui.css';

const App = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ThemeProvider>
      <div className="demo-container">
        <h1 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
          🎨 Dyn UI Demo - Centralizovani Stilovi ✅
        </h1>

        <div style={{ display: 'grid', gap: '2rem' }}>

          {/* Button Kinds */}
          <section className="demo-section">
            <h2>Button Kinds</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" label="Primary Button" />
              <DynButton kind="secondary" label="Secondary Button" />
              <DynButton kind="tertiary" label="Tertiary Button" />
            </div>
          </section>

          {/* Button Sizes */}
          <section className="demo-section">
            <h2>Button Sizes</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" label="Small" size="small" />
              <DynButton kind="primary" label="Medium" size="medium" />
              <DynButton kind="primary" label="Large" size="large" />
            </div>
          </section>

          {/* Danger States */}
          <section className="demo-section">
            <h2>Danger States</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" label="Delete" danger />
              <DynButton kind="secondary" label="Remove" danger />
              <DynButton kind="tertiary" label="Cancel" danger />
            </div>
          </section>

          {/* Loading States */}
          <section className="demo-section">
            <h2>Loading States</h2>
            <div className="demo-buttons">
              <DynButton
                kind="primary"
                label={loading ? "Saving..." : "Click to Test Loading"}
                loading={loading}
                onClick={handleClick}
              />
              <DynButton kind="secondary" label="Loading Demo" loading={true} />
              <DynButton kind="tertiary" label="Processing..." loading={true} />
            </div>
          </section>

          {/* Disabled States */}
          <section className="demo-section">
            <h2>Disabled States</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" label="Disabled" disabled />
              <DynButton kind="secondary" label="Disabled" disabled />
              <DynButton kind="tertiary" label="Disabled" disabled />
            </div>
          </section>

          {/* Icons */}
          <section className="demo-section">
            <h2>With Icons</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" icon="download" label="Download" />
              <DynButton kind="secondary" icon="settings" label="Settings" />
              <DynButton kind="tertiary" icon="help" ariaLabel="Help Button" />
            </div>
          </section>

          {/* Interactive Tests */}
          <section className="demo-section">
            <h2>Interactive Tests</h2>
            <div className="demo-buttons">
              <DynButton
                kind="primary"
                label="Click Me!"
                onClick={() => alert('🎉 DynButton clicked successfully!')}
              />
              <DynButton
                kind="secondary"
                label="Hover & Focus Test"
                //onFocus={() => console.log('Button focused')}
                onBlur={() => console.log('Button blurred')}
              />
            </div>
          </section>

          {/* Combined States */}
          <section className="demo-section">
            <h2>Combined States Demo</h2>
            <div className="demo-buttons">
              <DynButton kind="primary" size="small" label="Small Primary" />
              <DynButton kind="secondary" size="large" label="Large Secondary" />
              <DynButton kind="tertiary" size="small" label="Small Tertiary" danger />
              <DynButton kind="primary" size="large" label="Large Primary" danger />
            </div>
          </section>
        </div>

        <div className="demo-info">
          <p>
            ✅ <strong>CENTRALIZOVANI STILOVI:</strong> CSS se učitava iz <code>packages/dyn-ui-react/src/styles/dyn-ui.css</code><br/>
            📦 <strong>Single Source of Truth:</strong> Jedan CSS fajl za sve komponente i demo aplikacije<br/>
            🎨 <strong>Design System:</strong> Kompletni design tokens sa CSS custom properties<br/>
            🔧 <strong>Best Practice:</strong> Workspace-compatible, Storybook-ready, scalable architecture<br/>
            ♾️ <strong>Accessibility:</strong> Focus management, reduced motion, high contrast podrška<br/>
            📱 <strong>Responsive:</strong> Mobile-friendly dizajn sa responsive breakpoints
          </p>
        </div>
      </div>

        <div className="demo-info">
          <p>
            ✅ <strong>CENTRALIZOVANI STILOVI:</strong> CSS se učitava iz <code>packages/dyn-ui-react/src/styles/dyn-ui.css</code><br/>
            📦 <strong>Single Source of Truth:</strong> Jedan CSS fajl za sve komponente i demo aplikacije<br/>
            🎨 <strong>Design System:</strong> Kompletni design tokens sa CSS custom properties<br/>
            🔧 <strong>Best Practice:</strong> Workspace-compatible, Storybook-ready, scalable architecture<br/>
            ♾️ <strong>Accessibility:</strong> Focus management, reduced motion, high contrast podrška<br/>
            📱 <strong>Responsive:</strong> Mobile-friendly dizajn sa responsive breakpoints
          </p>
        </div>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
