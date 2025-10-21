/**
 * DynModalPlacement Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DynModalPlacement } from './DynModalPlacement';
import type {
  DynModalHorizontalAlignment,
  DynModalPlacementStrategy,
  DynModalVerticalPlacement
} from './DynModalPlacement.types';

const meta: Meta<typeof DynModalPlacement> = {
  title: 'Components/DynModalPlacement',
  component: DynModalPlacement,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# DynModalPlacement

Kompaktna utilitarna komponenta koja kontroliše pozicioniranje DynModal sadržaja preko jasno definisanih vertikalnih (\`placement\`) i horizontalnih (\`alignment\`) zona.

## Kombinacije položaja

| Placement | Alignment vrednosti |
|-----------|---------------------|
| \`top\` | \`start\`, \`center\`, \`end\`, \`stretch\` |
| \`center\` | \`start\`, \`center\`, \`end\`, \`stretch\` |
| \`bottom\` | \`start\`, \`center\`, \`end\`, \`stretch\` |
| \`fullscreen\` | uvek popunjava ceo raspoloživi prostor |

Koristite \`placement\` da odredite vertikalnu zonu (vrh, centar, dno ili fullscreen), a \`alignment\` da precizirate poravnanje unutar te zone.

## Napomena

Za potrebe dokumentacije možete koristiti strategiju \`"absolute"\` ili \`"relative"\` kako biste prikazali više primera u okviru jedne stranice bez portal renderovanja.
        `
      }
    }
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'center', 'bottom', 'fullscreen'],
      description: 'Vertikalna zona modal sadržaja'
    },
    alignment: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Horizontalno poravnanje modal sadržaja'
    },
    strategy: {
      control: 'select',
      options: ['fixed', 'absolute', 'relative'],
      description: 'CSS positioning strategija wrapper elementa'
    },
    allowOverflow: {
      control: 'boolean'
    },
    fullHeight: {
      control: 'boolean'
    },
    padding: {
      control: 'text'
    },
    gap: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof DynModalPlacement>;

const PreviewCard: React.FC<{ title: string; description: string; stretch?: boolean }> = ({
  title,
  description,
  stretch
}) => (
  <div
    style={{
      background: 'var(--dyn-modal-surface, #ffffff)',
      borderRadius: stretch ? '0.5rem' : '0.75rem',
      boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
      padding: '1.5rem',
      width: stretch ? '100%' : 'min(100%, 320px)',
      boxSizing: 'border-box'
    }}
  >
    <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{title}</h4>
    <p style={{ margin: 0, color: 'var(--dyn-color-on-surface-muted, #475569)' }}>{description}</p>
  </div>
);

export const Playground: Story = {
  args: {
    placement: 'center',
    alignment: 'center',
    strategy: 'fixed',
    children: (
      <PreviewCard
        title="Modal centriran"
        description="Ovaj primer koristi podrazumevane postavke poravnanja i obezbeđuje idealnu sredinu za DynModal."
      />
    )
  }
};

const placements: DynModalVerticalPlacement[] = ['top', 'center', 'bottom'];
const alignments: DynModalHorizontalAlignment[] = ['start', 'center', 'end', 'stretch'];
const strategies: DynModalPlacementStrategy[] = ['absolute'];

export const PlacementMatrix: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '2rem'
      }}
    >
      {placements.map(placement => (
        <div key={placement} style={{ display: 'grid', gap: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{`Placement: ${placement}`}</h3>
          <div
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
            }}
          >
            {alignments.map(alignment => (
              <div
                key={`${placement}-${alignment}`}
                style={{
                  position: 'relative',
                  minHeight: '220px',
                  background: 'var(--dyn-color-surface-subtle, #e2e8f0)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--dyn-color-outline, rgba(148, 163, 184, 0.4))',
                  overflow: 'hidden'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--dyn-color-on-surface-muted, #475569)'
                  }}
                >
                  {`${placement.toUpperCase()} / ${alignment.toUpperCase()}`}
                </span>
                {strategies.map(strategy => (
                  <DynModalPlacement
                    key={strategy}
                    placement={placement}
                    alignment={alignment}
                    strategy={strategy}
                    padding="1.5rem"
                    fullHeight
                    allowOverflow
                  >
                    <PreviewCard
                      stretch={alignment === 'stretch'}
                      title="Primer modal sadržaja"
                      description="Kombinacija placement i alignment vrednosti demonstrira kako će se modal pozicionirati u okviru viewport-a."
                    />
                  </DynModalPlacement>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ position: 'relative', minHeight: '280px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Placement: fullscreen</h3>
        <DynModalPlacement placement="fullscreen" alignment="stretch" strategy="absolute">
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '2rem'
            }}
          >
            <h3 style={{ margin: 0 }}>Fullscreen modal</h3>
            <p style={{ margin: 0, maxWidth: '420px', textAlign: 'center' }}>
              Kada se koristi \`placement="fullscreen"\`, modal preuzima ceo raspoloživi prostor i može da predstavi složene prikaze.
            </p>
          </div>
        </DynModalPlacement>
      </div>
    </div>
  )
};
