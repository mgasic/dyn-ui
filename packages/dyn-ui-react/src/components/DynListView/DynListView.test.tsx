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
      const firstCall = customRender.mock.calls[0];
      expect(firstCall[0]).toEqual(sampleData[0]);
      expect(firstCall[1]).toBe(0);
      expect(firstCall[2]).toMatchObject({
        title: 'Item 1',
        toggleExpansion: expect.any(Function),
      });
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
      const expandTrigger = screen.getByRole('button', { name: 'Complex Item' });
      expect(expandTrigger).toBeInTheDocument();
    });

    it('treats items with additional metadata as expandable', () => {
      const dataWithExtras = [{
        id: 1,
        title: 'Status Only',
        status: 'Ready',
      }];

      render(<DynListView data={dataWithExtras} />);

      const expandTrigger = screen.getByRole('button', { name: 'Status Only' });
      expect(expandTrigger).toBeInTheDocument();
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
      const expandTrigger = screen.getByRole('button', { name: 'Complex Item' });
      fireEvent.click(expandTrigger);

      expect(screen.getByText(/prop1:/)).toBeInTheDocument();
      expect(screen.getByText(/value1/)).toBeInTheDocument();
    });

    it('supports expanding complex items with custom rendering', () => {
      const complexData = [{
        id: 1,
        title: 'Complex Item',
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
        prop4: 'value4',
      }];

      render(
        <DynListView
          data={complexData}
          renderItem={(item) => (
            <div>
              <span>{item.title}</span>
            </div>
          )}
        />
      );

      const expandTrigger = screen.getByRole('button', {
        name: 'Expand details for Complex Item',
      });

      fireEvent.click(expandTrigger);

      expect(screen.getByText(/prop1:/)).toBeInTheDocument();
      expect(screen.getByText(/value1/)).toBeInTheDocument();
    });

    it('allows custom renderers to use the provided TitleButton for expansion', () => {
      const complexData = [{
        id: 1,
        title: 'Complex Item',
        prop1: 'value1',
        prop2: 'value2',
        prop3: 'value3',
      }];

      render(
        <DynListView
          data={complexData}
          renderItem={(item, _index, context) => {
            if (!context) {
              return <div>{item.title}</div>;
            }

            return (
              <div>
                <context.TitleButton>{item.title}</context.TitleButton>
              </div>
            );
          }}
        />
      );

      const expandTrigger = screen.getByRole('button', { name: 'Complex Item' });
      expect(
        screen.queryByRole('button', { name: /Expand details for Complex Item/i })
      ).not.toBeInTheDocument();

      fireEvent.click(expandTrigger);

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
