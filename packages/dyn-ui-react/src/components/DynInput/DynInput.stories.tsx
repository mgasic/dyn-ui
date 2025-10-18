import type { Meta, StoryObj } from '@storybook/react';
import { DynInput } from './DynInput';
import { MASK_PATTERNS } from '../../hooks/useDynMask';

const meta: Meta<typeof DynInput> = {
  title: 'Form/DynInput',
  component: DynInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DynInput je standardizovana input komponenta sa validacijom, maskiranjem, ikonama i clear funkcionalnošću. Implementira WCAG 2.1 AA, koristi dizajn tokene i Vitest za testove.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'currency'],
      description: 'Input type'
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Size varijanta'
    },
    mask: {
      control: 'select',
      options: [undefined, ...Object.values(MASK_PATTERNS)],
      description: 'Mask šablon'
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    showSpinButtons: { control: 'boolean' },
    icon: { control: 'text', description: 'Ime ikone ili ReactNode' },
    placeholder: { control: 'text' },
    help: { control: 'text' },
    value: { control: 'text' },
    currencyConfig: {
      control: 'object',
      description: 'Podešavanja formatiranja valute'
    }
  },
  args: {
    label: 'Input',
    size: 'medium',
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Ime i prezime',
    placeholder: 'Unesite puno ime',
    help: 'Polje za identifikaciju korisnika',
    showClearButton: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
      <DynInput label="Malo" size="small" placeholder="Small" />
      <DynInput label="Srednje" size="medium" placeholder="Medium" />
      <DynInput label="Veliko" size="large" placeholder="Large" />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
      <DynInput label="Obavezno" required placeholder="Obavezno polje" />
      <DynInput label="Opcionalno" optional placeholder="Opcionalno polje" />
      <DynInput label="Sa greškom" errorMessage="Neispravan unos" />
      <DynInput label="Disabled" disabled value="Onemogućeno" />
      <DynInput label="Readonly" readonly value="Samo za čitanje" />
    </div>
  )
};

export const WithIconAndClear: Story = {
  args: {
    label: 'Pretraga',
    icon: 'search',
    placeholder: 'Pretraži...',
    showClearButton: true
  }
};

export const Masking: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
      <DynInput label="Telefon" mask={MASK_PATTERNS.phone} placeholder="(11) 9999-9999" />
      <DynInput label="CPF" mask={MASK_PATTERNS.cpf} placeholder="000.000.000-00" />
      <DynInput label="Kreditna kartica" mask={MASK_PATTERNS.creditCard} placeholder="0000 0000 0000 0000" />
    </div>
  )
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
      <DynInput label="Email" type="email" placeholder="email@primer.com" />
      <DynInput label="Lozinka" type="password" placeholder="••••••••" />
      <DynInput label="Godine" type="number" placeholder="18" min={0} max={120} />
      <DynInput label="Telefon" type="tel" placeholder="" />
    </div>
  )
};

export const Currency: Story = {
  args: {
    label: 'Iznos',
    type: 'currency',
    value: 1234.56,
    showSpinButtons: true,
    step: 50,
    min: 0,
    currencyConfig: {
      symbol: 'R$',
      currencyCode: 'BRL',
      showCurrencyCode: true,
      decimalSeparator: ',',
      thousandSeparator: '.',
      precision: 2
    }
  }
};

export const NumberWithSpinButtons: Story = {
  args: {
    label: 'Količina',
    type: 'number',
    value: 2,
    step: 1,
    min: 0,
    max: 10,
    showSpinButtons: true
  }
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div data-theme="dark" style={{ padding: '2rem', background: '#1a1a1a', borderRadius: 8 }}>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
        <DynInput label="Email" type="email" placeholder="email@primer.com" />
        <DynInput label="Sa greškom" errorMessage="Greška" />
        <DynInput label="Readonly" readonly value="Samo čitanje" />
      </div>
    </div>
  )
};
