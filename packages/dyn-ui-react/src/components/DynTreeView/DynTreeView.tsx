import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { DynTreeViewProps, DynTreeNode } from './DynTreeView.types';
import styles from './DynTreeView.module.css';

export const DynTreeView: React.FC<DynTreeViewProps> = ({
  treeData = [],
  checkable = false,
  selectable = true,
  multiple = false,
  expandedKeys = [],
  checkedKeys = [],
  selectedKeys = [],
  defaultExpandAll = false,
  showIcon = true,
  showLine = false,
  searchable = false,
  onExpand,
  onCheck,
  onSelect,
  onSearch,
  height,
  className,
}) => {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<string[]>(
    defaultExpandAll ? getAllKeys(treeData) : expandedKeys
  );
  const [internalCheckedKeys, setInternalCheckedKeys] = useState<string[]>(checkedKeys);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedKeys);
  const [searchValue, setSearchValue] = useState<string>('');

  // Helper function to get all keys from tree data
  function getAllKeys(nodes: DynTreeNode[]): string[] {
    const keys: string[] = [];
    
    function collectKeys(nodeList: DynTreeNode[]) {
      nodeList.forEach(node => {
        keys.push(node.key);
        if (node.children) {
          collectKeys(node.children);
        }
      });
    }
    
    collectKeys(nodes);
    return keys;
  }

  // Filter tree data based on search
  const filteredTreeData = useMemo(() => {
    if (!searchValue.trim()) return treeData;
    
    function filterNodes(nodes: DynTreeNode[]): DynTreeNode[] {
      return nodes.reduce((filtered: DynTreeNode[], node) => {
        const matchesSearch = node.title.toLowerCase().includes(searchValue.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        
        if (matchesSearch || filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          });
        }
        
        return filtered;
      }, []);
    }
    
    return filterNodes(treeData);
  }, [treeData, searchValue]);

  // Handle node expansion
  const handleExpand = useCallback(
    (key: string, expanded: boolean) => {
      const newExpandedKeys = expanded
        ? [...internalExpandedKeys, key]
        : internalExpandedKeys.filter(k => k !== key);
      
      setInternalExpandedKeys(newExpandedKeys);
      onExpand?.(newExpandedKeys);
    },
    [internalExpandedKeys, onExpand]
  );

  // Handle node selection
  const handleSelect = useCallback(
    (node: DynTreeNode, selected: boolean) => {
      if (!selectable || node.disabled) return;
      
      let newSelectedKeys: string[];
      
      if (multiple) {
        newSelectedKeys = selected
          ? [...internalSelectedKeys, node.key]
          : internalSelectedKeys.filter(k => k !== node.key);
      } else {
        newSelectedKeys = selected ? [node.key] : [];
      }
      
      setInternalSelectedKeys(newSelectedKeys);
      onSelect?.(newSelectedKeys, { selected, node });
    },
    [selectable, multiple, internalSelectedKeys, onSelect]
  );

  // Handle node checking with parent-child relationship
  const handleCheck = useCallback(
    (node: DynTreeNode, checked: boolean) => {
      if (!checkable || node.disabled) return;
      
      const newCheckedKeys = new Set(internalCheckedKeys);
      
      // Helper function to get all descendant keys
      function getDescendantKeys(targetNode: DynTreeNode): string[] {
        const keys = [targetNode.key];
        if (targetNode.children) {
          targetNode.children.forEach(child => {
            keys.push(...getDescendantKeys(child));
          });
        }
        return keys;
      }
      
      if (checked) {
        // Check node and all descendants
        const descendantKeys = getDescendantKeys(node);
        descendantKeys.forEach(key => newCheckedKeys.add(key));
      } else {
        // Uncheck node and all descendants
        const descendantKeys = getDescendantKeys(node);
        descendantKeys.forEach(key => newCheckedKeys.delete(key));
      }
      
      const finalCheckedKeys = Array.from(newCheckedKeys);
      setInternalCheckedKeys(finalCheckedKeys);
      onCheck?.(finalCheckedKeys, { checked, node });
    },
    [checkable, internalCheckedKeys, onCheck]
  );

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch?.(value);
      
      // Auto expand nodes that match search
      if (value.trim()) {
        const matchingKeys = getAllKeys(filteredTreeData);
        setInternalExpandedKeys(prev => Array.from(new Set([...prev, ...matchingKeys])));
      }
    },
    [onSearch, filteredTreeData]
  );

  // Render tree node
  const renderTreeNode = useCallback(
    (node: DynTreeNode, level: number = 0): React.ReactNode => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = internalExpandedKeys.includes(node.key);
      const isSelected = internalSelectedKeys.includes(node.key);
      const isChecked = internalCheckedKeys.includes(node.key);
      
      return (
        <div key={node.key} className={styles['dyn-tree-view__node']}>
          <div
            className={classNames(
              styles['dyn-tree-view__node-content'],
              {
                [styles['dyn-tree-view__node-content--selected']]: isSelected,
                [styles['dyn-tree-view__node-content--disabled']]: node.disabled,
              }
            )}
            style={{ paddingLeft: level * 24 }}
          >
            {/* Expand/Collapse icon */}
            {hasChildren ? (
              <div
                className={styles['dyn-tree-view__node-switcher']}
                onClick={() => handleExpand(node.key, !isExpanded)}
              >
                <span className={styles['dyn-tree-view__expand-icon']}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>
            ) : (
              <div className={classNames(styles['dyn-tree-view__node-switcher'], styles['dyn-tree-view__node-switcher--leaf'])}>
                {showLine && <div className={styles['dyn-tree-view__line']} />}
              </div>
            )}
            
            {/* Checkbox */}
            {checkable && (
              <div className={styles['dyn-tree-view__node-checkbox']}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={node.disabled}
                  onChange={(e) => handleCheck(node, e.target.checked)}
                />
              </div>
            )}
            
            {/* Icon */}
            {showIcon && node.icon && (
              <div className={styles['dyn-tree-view__node-icon']}>
                <span>{node.icon}</span>
              </div>
            )}
            
            {/* Title */}
            <div
              className={classNames(
                styles['dyn-tree-view__node-title'],
                {
                  [styles['dyn-tree-view__node-title--clickable']]: selectable && !node.disabled,
                }
              )}
              onClick={selectable && !node.disabled ? () => handleSelect(node, !isSelected) : undefined}
            >
              {node.title}
            </div>
          </div>
          
          {/* Children */}
          {hasChildren && isExpanded && (
            <div className={styles['dyn-tree-view__node-children']}>
              {node.children!.map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    },
    [
      internalExpandedKeys,
      internalSelectedKeys,
      internalCheckedKeys,
      handleExpand,
      handleSelect,
      handleCheck,
      checkable,
      selectable,
      showIcon,
      showLine,
    ]
  );

  const treeViewClasses = classNames(
    styles['dyn-tree-view'],
    {
      [styles['dyn-tree-view--show-line']]: showLine,
      [styles['dyn-tree-view--checkable']]: checkable,
      [styles['dyn-tree-view--selectable']]: selectable,
    },
    className
  );

  return (
    <div className={treeViewClasses} style={{ height }}>
      {/* Search */}
      {searchable && (
        <div className={styles['dyn-tree-view__search']}>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles['dyn-tree-view__search-input']}
          />
        </div>
      )}
      
      {/* Tree content */}
      <div className={styles['dyn-tree-view__content']}>
        {filteredTreeData.length > 0 ? (
          filteredTreeData.map(node => renderTreeNode(node))
        ) : (
          <div className={styles['dyn-tree-view__empty']}>
            <span>
              {searchValue.trim() ? 'No matching nodes found' : 'No data available'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

DynTreeView.displayName = 'DynTreeView';

export default DynTreeView;