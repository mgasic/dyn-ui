/**
 * DynPage - Complete page layout component
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import React, {
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import type {
  ComponentRef,
  CSSProperties,
  ElementType,
} from 'react';
import {
  type DynPageProps,
  type DynPageBreadcrumb,
  type DynPageAction,
  type LayoutSpacing,
  type LayoutSize,
} from '../../types/layout.types';
import { generateId } from '../../utils/accessibility';
import { classNames } from '../../utils/classNames';
import { DynButton } from '../DynButton';
import type { DynButtonVariant } from '../DynButton/DynButton.types';
import styles from './DynPage.module.css';

type CSSVarStyles = CSSProperties & Record<string, string | number | undefined>;

const toPascalCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const CONTENT_PADDING_TOKENS: Record<LayoutSpacing, string> = {
  none: '0',
  xs: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
  sm: 'var(--dyn-spacing-lg, var(--spacing-lg, 1rem))',
  md: 'var(--dyn-spacing-xl, var(--spacing-xl, 1.5rem)) var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem))',
  lg: 'var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) calc(var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) + var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem)))',
  xl: 'calc(var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) + var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))) var(--dyn-spacing-3xl, var(--spacing-3xl, 3rem))',
};

const HEADER_PADDING_TOKENS: Record<LayoutSpacing, string> = {
  none: '0',
  xs: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem)) var(--dyn-spacing-lg, var(--spacing-lg, 1rem))',
  sm: 'var(--dyn-spacing-lg, var(--spacing-lg, 1rem)) var(--dyn-spacing-xl, var(--spacing-xl, 1.5rem))',
  md: 'var(--dyn-spacing-xl, var(--spacing-xl, 1.5rem)) var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem))',
  lg: 'var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) calc(var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) + var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem)))',
  xl: 'calc(var(--dyn-spacing-2xl, var(--spacing-2xl, 2rem)) + var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))) var(--dyn-spacing-3xl, var(--spacing-3xl, 3rem))',
};

const isLayoutSpacing = (value: unknown): value is LayoutSpacing =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(CONTENT_PADDING_TOKENS, value);

const resolveContentPadding = (
  spacing: LayoutSpacing | CSSProperties['padding'] | undefined,
) => {
  if (!spacing || isLayoutSpacing(spacing)) return undefined;
  return typeof spacing === 'number' ? `${spacing}px` : spacing;
};

const resolveHeaderPadding = (spacing: LayoutSpacing | undefined) => {
  if (!spacing) return undefined;
  return HEADER_PADDING_TOKENS[spacing] ?? HEADER_PADDING_TOKENS.md;
};

const renderBreadcrumbItems = (breadcrumbs: DynPageBreadcrumb[]) => (
  <nav className={styles.breadcrumbs} aria-label="Navegação">
    <ol className={styles.breadcrumbList}>
      {breadcrumbs.map((breadcrumb, index) => (
        <li key={index} className={styles.breadcrumbItem}>
          {breadcrumb.href || breadcrumb.onClick ? (
            <a
              href={breadcrumb.href}
              onClick={(event) => {
                if (breadcrumb.onClick) {
                  event.preventDefault();
                  breadcrumb.onClick();
                }
              }}
              className={styles.breadcrumbLink}
            >
              {breadcrumb.title}
            </a>
          ) : (
            <span className={styles.breadcrumbText}>{breadcrumb.title}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

const resolveActionVariant = (type: DynPageAction['type']): DynButtonVariant => {
  switch (type) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const renderActionButtons = (actions: DynPageAction[], size: LayoutSize | undefined) => {
  if (actions.length === 0) return null;

  return (
    <div className={styles.actions}>
      {actions.map((action) => {
        const variant: DynButtonVariant = resolveActionVariant(action.type);
        const isDanger = action.type === 'danger';

        return (
          <DynButton
            key={action.key}
            variant={variant}
            danger={isDanger}
            size={size === 'large' ? 'large' : 'medium'}
            disabled={action.disabled}
            loading={action.loading}
            onClick={action.onClick}
            startIcon={action.icon}
          >
            {action.title}
          </DynButton>
        );
      })}
    </div>
  );
};

const DynPageComponent = <E extends ElementType = 'main'>(
  {
    as,
    title,
    subtitle,
    breadcrumbs = [],
    actions = [],
    children,
    loading = false,
    error,
    size = 'medium',
    padding = 'md',
    headerPadding,
    background = 'page',
    className,
    style,
    slots,
    'data-testid': dataTestId,
    'aria-labelledby': ariaLabelledbyOverride,
    role: roleOverride,
    ...rest
  }: DynPageProps<E>,
  ref: React.ForwardedRef<ComponentRef<E>>
) => {
  const Component = (as ?? 'main') as ElementType;
  const headerId = useMemo(() => generateId('dyn-page-header'), []);
  const titleId = useMemo(() => generateId('dyn-page-title'), []);

  const resolvedContentPadding = resolveContentPadding(padding);
  const resolvedHeaderPadding = resolveHeaderPadding(headerPadding);

  const pageStyle = useMemo(() => {
    const next: CSSVarStyles = { ...(style as CSSVarStyles) };

    if (resolvedContentPadding) {
      next['--dyn-page-content-padding'] = resolvedContentPadding;
    }

    if (resolvedHeaderPadding) {
      next['--dyn-page-header-padding'] = resolvedHeaderPadding;
    }

    return Object.keys(next).length > 0 ? next : undefined;
  }, [resolvedContentPadding, resolvedHeaderPadding, style]);

  const sizeClass =
    size === 'small'
      ? styles.sizeSmall
      : size === 'large'
        ? styles.sizeLarge
        : undefined;

  const paddingClass = isLayoutSpacing(padding)
    ? styles[`padding${toPascalCase(padding)}` as keyof typeof styles]
    : undefined;

  const backgroundClass =
    background === 'page'
      ? styles.backgroundPage
      : background === 'surface'
        ? styles.backgroundSurface
        : undefined;

  const pageClasses = classNames(
    styles.root,
    sizeClass,
    paddingClass,
    backgroundClass,
    {
      [styles.isLoading]: loading,
      [styles.isError]: !!error,
    },
    'dyn-page',
    className,
  );

  const headerLabelId = title || slots?.header ? titleId : undefined;
  const ariaLabelledby = ariaLabelledbyOverride ?? headerLabelId;
  const role = roleOverride ?? (Component === 'main' ? undefined : 'main');

  const memoizedRenderBreadcrumbs = useCallback(() => {
    if (breadcrumbs.length === 0) {
      return null;
    }

    return renderBreadcrumbItems(breadcrumbs);
  }, [breadcrumbs]);

  const headerActions = useMemo(() => {
    if (actions.length === 0) {
      return null;
    }

    return renderActionButtons(actions, size);
  }, [actions, size]);

  const headerContent = useMemo(() => {
    if (slots?.header) {
      return slots.header({
        title,
        subtitle,
        breadcrumbs,
        actions,
        titleId,
        renderBreadcrumbs: memoizedRenderBreadcrumbs,
        renderActions: () => headerActions,
      });
    }

    const breadcrumbsElement = memoizedRenderBreadcrumbs();
    const hasTitleContent = Boolean(title || subtitle || headerActions);

    if (!breadcrumbsElement && !hasTitleContent) {
      return null;
    }

    return (
      <>
        {breadcrumbsElement}
        {hasTitleContent && (
          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              {title ? (
                <h1 id={titleId} className={styles.title}>
                  {title}
                </h1>
              ) : null}
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            </div>
            {headerActions}
          </div>
        )}
      </>
    );
  }, [
    actions,
    breadcrumbs,
    headerActions,
    memoizedRenderBreadcrumbs,
    slots,
    subtitle,
    title,
    titleId,
  ]);

  if (loading) {
    return (
      <Component
        ref={ref as React.Ref<ComponentRef<E>>}
        className={pageClasses}
        style={pageStyle}
        data-testid={dataTestId}
        aria-labelledby={ariaLabelledby}
        role={role}
        {...rest}
      >
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Carregando página...</span>
        </div>
      </Component>
    );
  }

  if (error) {
    return (
      <Component
        ref={ref as React.Ref<ComponentRef<E>>}
        className={pageClasses}
        style={pageStyle}
        data-testid={dataTestId}
        aria-labelledby={ariaLabelledby}
        role={role}
        {...rest}
      >
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠</div>
          <div>
            {typeof error === 'string' ? (
              <span className={styles.errorMessage}>{error}</span>
            ) : (
              error
            )}
          </div>
        </div>
      </Component>
    );
  }

  return (
    <Component
      ref={ref as React.Ref<ComponentRef<E>>}
      className={pageClasses}
      style={pageStyle}
      data-testid={dataTestId}
      aria-labelledby={ariaLabelledby}
      role={role}
      {...rest}
    >
      <header id={headerId} className={styles.header} aria-labelledby={headerLabelId}>
        {headerContent}
      </header>
      <div className={styles.content}>{children}</div>
    </Component>
  );
};

type DynPageForwardRef = <E extends ElementType = 'main'>(
  props: DynPageProps<E> & { ref?: React.Ref<ComponentRef<E>> }
) => React.ReactElement | null;

const DynPage = forwardRef(
  DynPageComponent as unknown as DynPageForwardRef
) as DynPageForwardRef;

DynPage.displayName = 'DynPage';

export { DynPage };
export default DynPage;
