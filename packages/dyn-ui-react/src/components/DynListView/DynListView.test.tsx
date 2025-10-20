import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DynListView from './DynListView';
import { ListAction } from './DynListView.types';

const sampleData = [
  { id: 1, title: 'Item 1', description: 'Description 1' },
  { id: 2, title: 'Item 2', description: 'Description 2' },
  { id: 3, title: 'Item 3', description: 'Description 3' },
];

const sampleActions: ListAction[] = [
  {
    key: 'edit',
    title: 'Edit',
    onClick: vi.fn(),
  },
  {
    key: 'delete',
    title: 'Delete',
    type: 'danger',
    onClick: vi.fn(),
  },
];

describe('DynListView', () => {
  beforeEach(() => {
    sampleActions.forEach(action => {
      (action.onClick as ReturnType<typeof vi.fn>).mockClear();
    });
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<DynListView data={sampleData} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<DynListView data={[]} loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty state', () => {
      render(<DynListView data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty text', () => {
      render(<DynListView data={[]} emptyText="Custom empty message" />);
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('renders all data items', () => {
      render(<DynListView data={sampleData} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('renders selection controls when selectable', () => {
      render(<DynListView data={sampleData} selectable />);
      const selectAllButton = screen.getByRole('button', { name: /select all items/i });
      expect(selectAllButton).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('handles item selection', () => {
      const onSelectionChange = vi.fn();
      render(
        <DynListView
          data={sampleData}
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const options = screen.getAllByRole('option');
      fireEvent.click(options[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(['1'], [sampleData[0]]);
    });

    it('handles select all', () => {
      const onSelectionChange = vi.fn();
      render(
        <DynListView
          data={sampleData}
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAllButton = screen.getByRole('button', { name: /select all items/i });
      fireEvent.click(selectAllButton);

      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3'], sampleData);
    });
  });

  describe('Actions', () => {
    it('renders action buttons', () => {
      render(<DynListView data={sampleData} actions={sampleActions} />);
      expect(screen.getAllByText('Edit')).toHaveLength(3);
      expect(screen.getAllByText('Delete')).toHaveLength(3);
    });

    it('calls action onClick handler', () => {
      render(<DynListView data={sampleData} actions={sampleActions} />);

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(sampleActions[0].onClick).toHaveBeenCalledWith(sampleData[0], 0);
    });
  });

  describe('Custom rendering', () => {
    it('uses custom renderItem function', () => {
      const customRender = vi.fn((item) => <div>Custom: {item.title}</div>);
      render(<DynListView data={sampleData} renderItem={customRender} />);

      expect(screen.getByText('Custom: Item 1')).toBeInTheDocument();
      expect(customRender).toHaveBeenCalledWith(sampleData[0], 0);
    });
  });

  describe('Expansion', () => {
    it('shows expand button for complex items', () => {
      const complexData = [{
        id: 1,
        title: 'Complex Item',
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
        prop4: 'value4',
      }];

      render(<DynListView data={complexData} />);
      const expandButton = screen.getByRole('button');
      expect(expandButton).toBeInTheDocument();
    });

    it('expands item details on click', () => {
      const complexData = [{
        id: 1,
        title: 'Complex Item',
        description: 'Description',
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
      }];

      render(<DynListView data={complexData} />);
      const expandButton = screen.getByRole('button');
      fireEvent.click(expandButton);

      expect(screen.getByText(/prop1:/)).toBeInTheDocument();
      expect(screen.getByText(/value1/)).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <DynListView data={sampleData} className="custom-list" />
      );
      expect(container.firstChild).toHaveClass('custom-list');
    });

    it('applies size variants', () => {
      const { container, rerender } = render(
        <DynListView data={sampleData} size="small" />
      );
      expect(container.firstChild).toHaveClass('dyn-list-view--small');

      rerender(<DynListView data={sampleData} size="large" />);
      expect(container.firstChild).toHaveClass('dyn-list-view--large');
    });

    it('applies height style', () => {
      const { container } = render(
        <DynListView data={sampleData} height={300} />
      );
      expect(container.firstChild).toHaveStyle({ height: '300px' });
    });
  });
});
