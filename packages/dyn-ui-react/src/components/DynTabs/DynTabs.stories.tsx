/**
 * DynTabs Storybook Stories
 * Comprehensive examples following DynAvatar documentation pattern
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DynTabs } from './DynTabs';
import { DynTabItem } from './DynTabs.types';

const meta: Meta<typeof DynTabs> = {
  title: 'Components/DynTabs',
  component: DynTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# DynTabs

Fleksibilna i pristupačna komponenta za tab navigaciju sa podrškom za različite varijante, pozicije i napredne funkcije.

## Karakteristike

- ✨ **Potpuna pristupačnost** - WCAG 2.1 AA usaglašenost sa kompletnom keyboard navigacijom
- 🎨 **Integracija Design Token-a** - Koristi --dyn-* tokene sa fallback-ovima
- 📱 **Responsive dizajn** - Mobile-first pristup sa touch-friendly interakcijama
- ⚡ **Optimizovane performanse** - Lazy loading, memoizacija i efikasni re-render-i
- 🎯 **Fleksibilni API** - Controlled i uncontrolled režimi
- 🚀 **Interaktivne funkcije** - Zatvaranje tab-ova, scrollable overflow, dinamičko dodavanje

## Upotreba

\`\`\`tsx
const tabItems = [
  { id: 'home', label: 'Početna', content: <HomePage /> },
  { id: 'about', label: 'O nama', content: <AboutPage /> },
  { id: 'contact', label: 'Kontakt', content: <ContactPage /> }
];

<DynTabs
  items={tabItems}
  variant="underlined"
  onChange={(tabId, event) => console.log('Aktivan:', tabId, event.trigger)}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Pozicija tab-ova u odnosu na sadržaj'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'underlined', 'pills', 'bordered'],
      description: 'Vizuelni stil tab-ova'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Veličina tab elemenata'
    },
    scrollable: {
      control: 'boolean',
      description: 'Omogući horizontalno skrolovanje za overflow tab-ove'
    },
    lazy: {
      control: 'boolean',
      description: 'Omogući lazy loading sadržaja tab-ova'
    },
    closable: {
      control: 'boolean',
      description: 'Dozvoli zatvaranje tab-ova'
    },
    addable: {
      control: 'boolean',
      description: 'Prikaži dugme za dodavanje novog tab-a'
    },
    animated: {
      control: 'boolean',
      description: 'Omogući animacije prilikom prelaska između tab-ova'
    },
    disabled: {
      control: 'boolean',
      description: 'Onemogući sve tabove i interakcije'
    },
    lazyMount: {
      control: 'boolean',
      description: 'Montira tab panele tek kada se prvi put aktiviraju'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynTabs>;

// Sample data following DynAvatar pattern
const defaultItems: DynTabItem[] = [
  {
    id: 'home',
    label: 'Početna',
    icon: <span>🏠</span>,
    content: (
      <div>
        <h3>Dobrodošli na početnu stranu</h3>
        <p>Ovo je sadržaj početne stranice sa sveobuhvatnim informacijama i primerima.</p>
        <p>Sadržaj demonstrira pravilnu tipografiju i razmake koristeći design tokene.</p>
      </div>
    )
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: <span>👤</span>,
    badge: '3',
    content: (
      <div>
        <h3>Korisnički profil</h3>
        <p>Informacije o korisničkom profilu i podešavanja.</p>
        <p>Ovaj tab sadrži badge koji pokazuje 3 obaveštenja.</p>
      </div>
    )
  },
  {
    id: 'settings',
    label: 'Podešavanja',
    icon: <span>⚙️</span>,
    content: (
      <div>
        <h3>Podešavanja aplikacije</h3>
        <p>Konfigurišite vaše preferencije i opcije aplikacije.</p>
      </div>
    )
  },
  {
    id: 'disabled',
    label: 'Onemogućen Tab',
    content: <div>Ovaj sadržaj nije dostupan</div>,
    disabled: true
  }
];

// Default story
export const Default: Story = {
  args: {
    items: defaultItems
  }
};

// Size variants following DynAvatar pattern
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Mala veličina</h4>
        <DynTabs items={defaultItems.slice(0, 3)} size="small" />
      </div>
      <div>
        <h4>Srednja veličina (podrazumevana)</h4>
        <DynTabs items={defaultItems.slice(0, 3)} size="medium" />
      </div>
      <div>
        <h4>Velika veličina</h4>
        <DynTabs items={defaultItems.slice(0, 3)} size="large" />
      </div>
    </div>
  )
};

// Variant showcase
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Default varijanta</h4>
        <DynTabs items={defaultItems.slice(0, 3)} variant="default" />
      </div>
      <div>
        <h4>Underlined varijanta</h4>
        <DynTabs items={defaultItems.slice(0, 3)} variant="underlined" />
      </div>
      <div>
        <h4>Pills varijanta</h4>
        <DynTabs items={defaultItems.slice(0, 3)} variant="pills" />
      </div>
      <div>
        <h4>Bordered varijanta</h4>
        <DynTabs items={defaultItems.slice(0, 3)} variant="bordered" />
      </div>
    </div>
  )
};

// Position variants
export const Positions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Top pozicija (podrazumevana)</h4>
        <DynTabs items={defaultItems.slice(0, 3)} position="top" />
      </div>
      <div>
        <h4>Bottom pozicija</h4>
        <DynTabs items={defaultItems.slice(0, 3)} position="bottom" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '300px' }}>
        <div>
          <h4>Leva pozicija</h4>
          <DynTabs items={defaultItems.slice(0, 3)} position="left" />
        </div>
        <div>
          <h4>Desna pozicija</h4>
          <DynTabs items={defaultItems.slice(0, 3)} position="right" />
        </div>
      </div>
    </div>
  )
};

// Orientation showcase
export const Orientation: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Horizontalna orijentacija</h4>
        <DynTabs items={defaultItems.slice(0, 3)} orientation="horizontal" />
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', minHeight: '240px' }}>
        <div style={{ flex: '1 1 0' }}>
          <h4>Vertikalna orijentacija (levo)</h4>
          <DynTabs items={defaultItems.slice(0, 3)} orientation="vertical" position="left" />
        </div>
        <div style={{ flex: '1 1 0' }}>
          <h4>Vertikalna orijentacija (desno)</h4>
          <DynTabs items={defaultItems.slice(0, 3)} orientation="vertical" position="right" />
        </div>
      </div>
    </div>
  )
};

// Interactive features following DynAvatar pattern
export const InteractiveTabs: Story = {
  render: () => {
    const [items, setItems] = useState(
      defaultItems.slice(0, 3).map(item => ({ ...item, closable: true }))
    );
    const [activeTab, setActiveTab] = useState('home');
    const [tabCounter, setTabCounter] = useState(4);

    const handleTabClose = (tabId: string) => {
      setItems(prev => prev.filter(item => item.id !== tabId));
      if (activeTab === tabId) {
        const remainingTabs = items.filter(item => item.id !== tabId && !item.disabled);
        if (remainingTabs.length > 0) {
          setActiveTab(remainingTabs[0].id);
        }
      }
    };

    const handleTabAdd = () => {
      const newId = `dynamic-tab-${tabCounter}`;
      setItems(prev => [...prev, {
        id: newId,
        label: `Tab ${tabCounter}`,
        content: <div>Ovaj tab je dinamički dodat! Sadržaj za tab {tabCounter}.</div>,
        closable: true,
        icon: <span>✨</span>
      }]);
      setTabCounter(prev => prev + 1);
    };

      return (
        <DynTabs
          items={items}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          onTabClose={handleTabClose}
          onTabAdd={handleTabAdd}
          closable
        addable
        animated
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktivni tab-ovi sa funkcionalnostima dodavanja i zatvaranja. Pokušajte da dodate nove tab-ove i zatvorite postojeće.'
      }
    }
  }
};

// Lazy loading demonstration
export const LazyLoading: Story = {
  args: {
    items: [
      {
        id: 'instant',
        label: 'Trenutno učitavanje',
        content: <div>Ovaj sadržaj se učitava odmah</div>
      },
      {
        id: 'lazy-1',
        label: 'Lazy Tab 1',
        content: (
          <div>
            <h4>Lazy loaded sadržaj</h4>
            <p>Ovaj sadržaj je lazy loaded kada je tab postao aktivan!</p>
            <p>Primetite loading spinner pre nego što se sadržaj pojavi.</p>
          </div>
        )
      },
      {
        id: 'lazy-2',
        label: 'Veliki sadržaj',
        content: (
          <div>
            <h4>Simulacija velikog sadržaja</h4>
            <p>Ovo simulira veliki sadržaj koji ima koristi od lazy loading-a.</p>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Paragraf {i + 1} - demonstrira prednosti lazy loading-a za performanse.</p>
            ))}
          </div>
        )
      }
    ],
    lazy: true,
    defaultActiveTab: 'instant'
  },
  parameters: {
    docs: {
      description: {
        story: 'Lazy loading sprečava renderovanje sadržaja dok se tab prvi put ne aktivira, poboljšavajući performanse.'
      }
    }
  }
};

// Accessibility demonstration without play function
export const AccessibilityShowcase: Story = {
  args: {
    items: defaultItems,
    'aria-label': 'Glavna navigacija'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Demonstrirane funkcionalnosti pristupačnosti:**
- Kompletna keyboard navigacija (Arrow keys, Home, End, Enter, Space)
- Pravilni ARIA atributi (roles, states, properties)
- Screen reader objave za promene stanja
- Roving tabindex pattern implementacija
- Focus management i vizuelni indikatori
- Rukovanje disabled stanjem

**Za testiranje:** Koristite Tab za fokusiranje, zatim Arrow keys za navigaciju.
        `
      }
    }
  }
};

// Dark theme showcase following DynAvatar pattern
export const DarkTheme: Story = {
  args: {
    items: defaultItems
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'DynTabs se automatski prilagođava tamnoj temi koristeći design tokene i CSS custom properties.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        backgroundColor: 'var(--dyn-color-surface-dark, #111827)',
        color: 'var(--dyn-color-text-primary-dark, #f9fafb)',
        padding: '2rem',
        borderRadius: '0.5rem',
        minHeight: '400px'
      }}>
        <Story />
      </div>
    )
  ]
};

// Scrollable tabs
export const ScrollableTabs: Story = {
  args: {
    items: Array.from({ length: 12 }, (_, i) => ({
      id: `tab-${i + 1}`,
      label: `Tab ${i + 1}`,
      content: <div>Sadržaj za tab {i + 1} sa scrollable demonstracijom</div>,
      icon: i % 3 === 0 ? <span>📁</span> : undefined,
      badge: i === 2 ? '99+' : i === 5 ? '1' : undefined
    })),
    scrollable: true,
    variant: 'underlined'
  },
  parameters: {
    docs: {
      description: {
        story: 'Kada ima previše tab-ova da stanu, omogućite scrollable režim za horizontalno skrolovanje.'
      }
    }
  }
};

// Error states
export const ErrorStates: Story = {
  render: () => {
    const [hasError, setHasError] = useState(false);
    
    const itemsWithError: DynTabItem[] = [
      {
        id: 'normal',
        label: 'Normalan Tab',
        content: <div>Normalan sadržaj radi savršeno</div>
      },
      {
        id: 'error-tab',
        label: 'Error Demo',
        content: hasError ? (
          <div style={{ 
            color: 'var(--dyn-color-error, #ef4444)',
            padding: 'var(--dyn-spacing-lg, 1rem)',
            textAlign: 'center'
          }}>
            ❌ Greška pri učitavanju sadržaja
            <br />
            <button 
              onClick={() => setHasError(false)}
              style={{ 
                marginTop: 'var(--dyn-spacing-md, 0.75rem)',
                padding: 'var(--dyn-spacing-sm, 0.5rem) var(--dyn-spacing-md, 0.75rem)',
                backgroundColor: 'var(--dyn-color-primary, #3b82f6)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--dyn-border-radius-md, 0.375rem)',
                cursor: 'pointer'
              }}
            >
              Pokušaj ponovo
            </button>
          </div>
        ) : (
          <div>
            <p>Kliknite ispod da simulirate grešku učitavanja sadržaja:</p>
            <button 
              onClick={() => setHasError(true)}
              style={{ 
                padding: 'var(--dyn-spacing-sm, 0.5rem) var(--dyn-spacing-md, 0.75rem)',
                backgroundColor: 'var(--dyn-color-error, #ef4444)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--dyn-border-radius-md, 0.375rem)',
                cursor: 'pointer'
              }}
            >
              Pokreni Error stanje
            </button>
          </div>
        )
      }
    ];

    return <DynTabs items={itemsWithError} variant="bordered" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Primer rukovanja error stanjima unutar tab sadržaja koristeći design tokene za konzistentno stilizovanje.'
      }
    }
  }
};