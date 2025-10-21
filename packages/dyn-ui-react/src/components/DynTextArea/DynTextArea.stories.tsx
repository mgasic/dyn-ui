import type { Meta, StoryObj } from '@storybook/react';
import { DynTextArea } from './DynTextArea';

const meta: Meta<typeof DynTextArea> = {
  title: 'Form/DynTextArea',
  component: DynTextArea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dinamička textarea komponenta sa validacijom, kontrolom veličine i WCAG 2.1 AA podrškom. Koristi zajednički DynFieldContainer za konzistentno poravnanje labela i poruka o greškama.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Određuje ponašanje resize opcije',
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    rows: { control: 'number' },
    cols: { control: 'number' },
    placeholder: { control: 'text' },
    help: { control: 'text' },
    status: {
      control: 'select',
      options: ['default', 'error', 'warning', 'success', 'loading'],
      description: 'Stanje textarea komponente',
    },
    statusMessage: { control: 'text' },
    autoResize: { control: 'boolean' },
    showCharacterCount: { control: 'boolean' },
  },
  args: {
    label: 'Opis',
    placeholder: 'Unesite detaljniji opis...',
    rows: 4,
    autoResize: false,
    status: 'default',
    showCharacterCount: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    help: 'Možete koristiti markdown sintaksu za formatiranje.',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 640 }}>
      <DynTextArea label="Osnovno" placeholder="Standardno polje" />
      <DynTextArea label="Obavezno" required placeholder="Morate popuniti ovo polje" />
      <DynTextArea label="Sa greškom" errorMessage="Neispravan opis" value="tekst" />
      <DynTextArea
        label="Upozorenje"
        status="warning"
        statusMessage="Proverite unos pre slanja"
      />
      <DynTextArea
        label="Uspeh"
        status="success"
        statusMessage="Opis izgleda sjajno"
        defaultValue="Uspešno ste uneli tekst"
      />
      <DynTextArea
        label="Učitavanje"
        status="loading"
        statusMessage="Validacija u toku..."
      />
      <DynTextArea label="Onemogućeno" disabled value="Onemogućeni unos" />
      <DynTextArea label="Samo čitanje" readonly value="Sadržaj samo za prikaz" />
    </div>
  ),
};

export const ResizeOptions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 640 }}>
      <DynTextArea label="Bez resize" resize="none" placeholder="Resize zabranjen" />
      <DynTextArea label="Horizontalno" resize="horizontal" rows={3} />
      <DynTextArea label="Vertikalno" resize="vertical" rows={6} />
      <DynTextArea label="Oba smera" resize="both" rows={5} />
    </div>
  ),
};

export const AutoResize: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 640 }}>
      <DynTextArea
        label="Auto resize"
        autoResize
        defaultValue={
          'DYN TextArea sada automatski proširuje visinu na osnovu sadržaja. ' +
          'Ovo olakšava unos dužeg teksta bez ručnog podešavanja.'
        }
      />
      <DynTextArea
        label="Auto resize sa dužim tekstom"
        autoResize
        defaultValue={`Prva linija\nDruga linija\nTreća linija\nČetvrta linija`}
      />
    </div>
  ),
};

export const CharacterCount: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 640 }}>
      <DynTextArea
        label="Opis sa ograničenjem"
        maxLength={120}
        showCharacterCount
        help="Preostali broj karaktera se prikazuje u donjem desnom uglu."
      />
      <DynTextArea
        label="Opis sa statusom"
        maxLength={80}
        showCharacterCount
        status="warning"
        statusMessage="Ostalo je samo nekoliko karaktera."
        defaultValue="Tekst koji je skoro dostigao maksimalnu dužinu."
      />
    </div>
  ),
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div data-theme="dark" style={{ padding: '2rem', background: '#111827', borderRadius: 12 }}>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 640 }}>
        <DynTextArea label="Opis" placeholder="Unesite detalje" />
        <DynTextArea label="Sa greškom" errorMessage="Greška" value="Opis" />
        <DynTextArea label="Savet" help="Tekst pomoći u tamnom modu" />
      </div>
    </div>
  ),
};
