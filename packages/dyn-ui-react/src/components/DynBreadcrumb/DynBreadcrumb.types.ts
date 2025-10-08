/**
 * DynBreadcrumb TypeScript type definitions
 * Navigation breadcrumb component types for path indication
 */

export interface BreadcrumbItem {
  label: string;
  link?: string;
  action?: () => void;
}

export interface DynBreadcrumbProps {
  items: BreadcrumbItem[];
  favorite?: boolean;
  favoriteService?: string;
  separator?: string | React.ReactNode;
  maxItems?: number;
  className?: string;
  onFavorite?: (favorited: boolean) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export interface DynBreadcrumbRef {
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;
}

// Default separator
export const DEFAULT_SEPARATOR = 'dyn-icon-arrow-right';

// Default literals
export const BREADCRUMB_LITERALS = {
  addToFavorites: 'Adicionar aos favoritos',
  removeFromFavorites: 'Remover dos favoritos',
  showMore: 'Mostrar mais itens',
  home: 'Início'
};
