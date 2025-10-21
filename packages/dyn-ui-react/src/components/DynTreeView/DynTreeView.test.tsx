// packages/dyn-ui-react/src/components/DynTreeView/DynTreeView.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import DynTreeView from './DynTreeView';

describe('DynTreeView', () => {
  const sampleTreeData = [
    {
      key: '1',
      title: 'Parent 1',
      children: [
        { key: '1-1', title: 'Child 1' },
        { key: '1-2', title: 'Child 2' }
      ]
    },
    {
      key: '2',
      title: 'Parent 2',
      children: [
        { key: '2-1', title: 'Child 3' }
      ]
    },
    { key: '3', title: 'Leaf Node' }
  ];

  describe('Rendering', () => {
    it('renders tree nodes', () => {
      render(<DynTreeView treeData={sampleTreeData} />);
      expect(screen.getByText('Parent 1')).toBeInTheDocument();
      expect(screen.getByText('Parent 2')).toBeInTheDocument();
      expect(screen.getByText('Leaf Node')).toBeInTheDocument();
    });

    it('renders icons when showIcon is true', () => {
      render(<DynTreeView treeData={sampleTreeData} showIcon />);
      expect(screen.getAllByText('📁')).toHaveLength(2); // Updated to handle multiple elements
    });

    it('does not render icons when showIcon is false', () => {
      render(<DynTreeView treeData={sampleTreeData} showIcon={false} />);
      expect(screen.queryByText('📁')).not.toBeInTheDocument();
    });

    it('renders expand/collapse icons for parent nodes', () => {
      render(<DynTreeView treeData={sampleTreeData} />);
      const expandButtons = screen.getAllByText('▶');
      expect(expandButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('applies hierarchical aria attributes to each node', () => {
      render(<DynTreeView treeData={sampleTreeData} defaultExpandAll />);

      const parent = screen.getByRole('treeitem', { name: /parent 1/i });
      expect(parent).toHaveAttribute('aria-level', '1');
      expect(parent).toHaveAttribute('aria-setsize', '3');
      expect(parent).toHaveAttribute('aria-posinset', '1');
      expect(parent).toHaveAttribute('aria-expanded', 'true');

      const child = screen.getByRole('treeitem', { name: /child 1/i });
      expect(child).toHaveAttribute('aria-level', '2');
      expect(child).toHaveAttribute('aria-setsize', '2');
      expect(child).toHaveAttribute('aria-posinset', '1');
    });
  });

  describe('Expansion', () => {
    it('calls onExpand callback', () => {
      const onExpand = vi.fn(); // Changed from jest.fn()
      render(<DynTreeView treeData={sampleTreeData} onExpand={onExpand} />);

      const expandButton = screen.getAllByText('▶')[0];
      fireEvent.click(expandButton);

      expect(onExpand).toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('handles single selection', () => {
      const onSelect = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={sampleTreeData}
          selectable
          onSelect={onSelect}
        />
      );

      const node = screen.getByText('Parent 1');
      fireEvent.click(node);

      expect(onSelect).toHaveBeenCalledWith(['1']);
    });

    it('handles multiple selection', () => {
      const onSelect = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={sampleTreeData}
          selectable
          multiple
          onSelect={onSelect}
        />
      );

      const node1 = screen.getByText('Parent 1');
      const node2 = screen.getByText('Parent 2');
      fireEvent.click(node1);
      fireEvent.click(node2);

      expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it('does not select disabled nodes', () => {
      const onSelect = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={[
            { key: '1', title: 'Disabled', disabled: true }
          ]}
          selectable
          onSelect={onSelect}
        />
      );

      const disabledNode = screen.getByText('Disabled');
      fireEvent.click(disabledNode);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Checkboxes', () => {
    it('handles checkbox checking', () => {
      const onCheck = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={sampleTreeData}
          checkable
          onCheck={onCheck}
        />
      );

      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      expect(onCheck).toHaveBeenCalled();
    });

    it('checks/unchecks children when parent is checked/unchecked', () => {
      const onCheck = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={sampleTreeData}
          checkable
          checkStrictly={false}
          onCheck={onCheck}
        />
      );

      // Expand first parent to show children
      const expandButton = screen.getAllByText('▶')[0];
      fireEvent.click(expandButton);

      const parentCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(parentCheckbox);

      expect(onCheck).toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('calls onSearch callback', () => {
      const onSearch = vi.fn(); // Changed from jest.fn()
      render(
        <DynTreeView
          treeData={sampleTreeData}
          showSearch
          onSearch={onSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      fireEvent.change(searchInput, { target: { value: 'Parent' } });

      expect(onSearch).toHaveBeenCalledWith('Parent');
    });
  });

  describe('Props', () => {
    it('applies correct CSS classes based on props', () => {
      const { container, rerender } = render(
        <DynTreeView treeData={sampleTreeData} checkable />
      );

      const initialTree = container.firstElementChild as HTMLElement | null;
      expect(initialTree).not.toBeNull();
      expect(initialTree!).toHaveClass('checkable');
      expect(initialTree!).toHaveClass('dyn-tree-view--checkable');

      rerender(<DynTreeView treeData={sampleTreeData} showLine />);

      const updatedTree = container.firstElementChild as HTMLElement | null;
      expect(updatedTree).not.toBeNull();
      expect(updatedTree!).toHaveClass('show-line');
      expect(updatedTree!).toHaveClass('dyn-tree-view--show-line');
    });
  });

  describe('Keyboard interactions', () => {
    it('supports roving focus and directional navigation', () => {
      render(<DynTreeView treeData={sampleTreeData} />);

      const tree = screen.getByRole('tree');
      tree.focus();

      const firstItem = screen.getByRole('treeitem', { name: /parent 1/i });
      expect(document.activeElement).toBe(firstItem);

      fireEvent.keyDown(tree, { key: 'ArrowDown' });
      const secondItem = screen.getByRole('treeitem', { name: /parent 2/i });
      expect(document.activeElement).toBe(secondItem);

      fireEvent.keyDown(tree, { key: 'Home' });
      expect(document.activeElement).toBe(firstItem);

      fireEvent.keyDown(tree, { key: 'End' });
      const lastItem = screen.getByRole('treeitem', { name: /leaf node/i });
      expect(document.activeElement).toBe(lastItem);
    });

    it('handles expansion and selection with keyboard keys', () => {
      const onCheck = vi.fn();
      const onSelect = vi.fn();
      render(
        <DynTreeView
          treeData={sampleTreeData}
          checkable
          selectable
          onCheck={onCheck}
          onSelect={onSelect}
        />
      );

      const tree = screen.getByRole('tree');
      tree.focus();

      const parent = screen.getByRole('treeitem', { name: /parent 1/i });

      fireEvent.keyDown(tree, { key: 'ArrowRight' });
      expect(parent).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(tree, { key: 'ArrowRight' });
      const child = screen.getByRole('treeitem', { name: /child 1/i });
      expect(document.activeElement).toBe(child);

      fireEvent.keyDown(tree, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(parent);

      fireEvent.keyDown(tree, { key: ' ' });
      expect(onCheck).toHaveBeenCalled();

      fireEvent.keyDown(tree, { key: 'Enter' });
      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe('Forms', () => {
    it('integrates with native forms to submit selected values', () => {
      const handleSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      });

      let submittedValue: FormDataEntryValue | null = null;

      const FormWrapper = () => {
        const [selected, setSelected] = React.useState<string[]>([]);

        return (
          <form
            onSubmit={(event) => {
              handleSubmit(event);
              const formData = new FormData(event.currentTarget);
              submittedValue = formData.get('selection');
            }}
          >
            <DynTreeView
              treeData={sampleTreeData}
              selectable
              onSelect={(keys) => setSelected(keys)}
            />
            <input name="selection" value={selected.join(',')} readOnly />
            <button type="submit">Submit</button>
          </form>
        );
      };

      render(<FormWrapper />);

      const parent = screen.getByText('Parent 1');
      fireEvent.click(parent);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
      expect(submittedValue).toBe('1');
    });
  });
});
