/**
 * DynPage - Complete page layout component
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import React from 'react';
import { DynPageProps } from '../../types/layout.types';
import { classNames } from '../../utils/classNames';
import { DynButton } from '../DynButton';
import type { DynButtonVariant } from '../DynButton/DynButton.types';
import styles from './DynPage.module.css';

export const DynPage: React.FC<DynPageProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  children,
  loading = false,
  error,
  size = 'medium',
  padding = 'md',
  background = 'page',
  className,
  id,
  'data-testid': testId
}) => {
  const sizeClass =
    size === 'small'
      ? styles.sizeSmall
      : size === 'large'
        ? styles.sizeLarge
        : undefined;

  const paddingClass =
    padding === 'none'
      ? styles.paddingNone
      : padding === 'xs'
        ? styles.paddingXs
        : padding === 'sm'
          ? styles.paddingSm
          : padding === 'lg'
            ? styles.paddingLg
            : padding === 'xl'
              ? styles.paddingXl
              : styles.paddingMd;

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
      [styles.isError]: !!error
    },
    'dyn-page',
    className
  );

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <nav className={styles.breadcrumbs} aria-label="Navegação">
        <ol className={styles.breadcrumbList}>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className={styles.breadcrumbItem}>
              {breadcrumb.href || breadcrumb.onClick ? (
                <a
                  href={breadcrumb.href}
                  onClick={(e) => {
                    if (breadcrumb.onClick) {
                      e.preventDefault();
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
                <span className={styles.breadcrumbSeparator} aria-hidden="true">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const renderActions = () => {
    if (actions.length === 0) return null;

    return (
      <div className={styles.actions}>
        {actions.map((action) => {
          const variant: DynButtonVariant =
            action.type === 'primary'
              ? 'primary'
              : action.type === 'secondary'
                ? 'secondary'
                : 'primary';
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

  if (loading) {
    return (
      <div className={pageClasses} id={id} data-testid={testId}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Carregando página...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageClasses} id={id} data-testid={testId}>
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
      </div>
    );
  }

  return (
    <div className={pageClasses} id={id} data-testid={testId}>
      <header className={styles.header}>
        {renderBreadcrumbs()}

        <div className={styles.titleSection}>
          <div className={styles.titleContent}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && (
              <p className={styles.subtitle}>{subtitle}</p>
            )}
          </div>
          {renderActions()}
        </div>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

DynPage.displayName = 'DynPage';

export default DynPage;
