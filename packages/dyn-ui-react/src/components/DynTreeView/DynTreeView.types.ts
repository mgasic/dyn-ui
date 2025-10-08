import { BaseComponentProps } from '../../types';

export interface TreeNode {
  key: string;
  title: string;
  icon?: string;
  disabled?: boolean;
  children?: TreeNode[];
  [key: string]: any; // Allow additional properties
}

export interface TreeViewActions {
  expand: (keys: string[]) => void;
  collapse: (keys: string[]) => void;
  select: (keys: string[]) => void;
  check: (keys: string[]) => void;
}

export interface TreeSelectInfo {
  selected: boolean;
  node: TreeNode;
}

export interface TreeCheckInfo {
  checked: boolean;
  node: TreeNode;
}

export interface DynTreeViewProps extends BaseComponentProps {
  /** Tree data */
  treeData: TreeNode[];
  
  /** Show checkboxes for selection */
  checkable?: boolean;
  
  /** Allow node selection */
  selectable?: boolean;
  
  /** Allow multiple selection */
  multiple?: boolean;
  
  /** Expanded node keys */
  expandedKeys?: string[];
  
  /** Checked node keys */
  checkedKeys?: string[];
  
  /** Selected node keys */
  selectedKeys?: string[];
  
  /** Expand all nodes by default */
  defaultExpandAll?: boolean;
  
  /** Show node icons */
  showIcon?: boolean;
  
  /** Show connecting lines */
  showLine?: boolean;
  
  /** Enable search functionality */
  searchable?: boolean;
  
  /** Expand callback */
  onExpand?: (expandedKeys: string[]) => void;
  
  /** Check callback */
  onCheck?: (checkedKeys: string[], info: TreeCheckInfo) => void;
  
  /** Select callback */
  onSelect?: (selectedKeys: string[], info: TreeSelectInfo) => void;
  
  /** Search callback */
  onSearch?: (value: string) => void;
  
  /** Fixed height for scrollable tree */
  height?: number | string;
}

// Legacy alias
export type DynTreeNode = TreeNode;
