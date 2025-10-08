/**
 * DynPage - Complete page layout component
 * Part of DYN UI Layout Components Group - SCOPE 7
 */

import React from 'react';
import { DynPageProps } from '../../types/layout.types';
import { classNames } from '../../utils/classNames';
import { DynButton } from '../DynButton';

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
  const pageClasses = classNames(
    'dyn-page',
    `dyn-page--${size}`,
    `dyn-page--padding-${padding}`,
    `dyn-page--${background}`,
    {
      'dyn-page--loading': loading,
      'dyn-page--error': !!error
    },
    className
  );

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <nav className="dyn-page-breadcrumbs" aria-label="Navegação">
        <ol className="dyn-page-breadcrumb-list">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="dyn-page-breadcrumb-item">
              {breadcrumb.href || breadcrumb.onClick ? (
                <a
                  href={breadcrumb.href}
                  onClick={(e) => {
                    if (breadcrumb.onClick) {
                      e.preventDefault();
                      breadcrumb.onClick();
                    }
                  }}
                  className="dyn-page-breadcrumb-link"
                >
                  {breadcrumb.title}
                </a>
              ) : (
                <span className="dyn-page-breadcrumb-text">{breadcrumb.title}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="dyn-page-breadcrumb-separator" aria-hidden="true">/</span>
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
      <div className="dyn-page-actions">
        {actions.map((action) => (
          <DynButton
            key={action.key}
            kind={action.type || 'secondary'}
            size={size === 'large' ? 'large' : 'medium'}
            disabled={action.disabled}
            loading={action.loading}
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.title}
          </DynButton>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={pageClasses} id={id} data-testid={testId}>
        <div className="dyn-page-loading">
          <div className="dyn-page-spinner"></div>
          <span>Carregando página...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageClasses} id={id} data-testid={testId}>
        <div className="dyn-page-error">
          <div className="dyn-page-error-icon">⚠</div>
          <div className="dyn-page-error-content">
            {typeof error === 'string' ? (
              <span className="dyn-page-error-message">{error}</span>
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
      <header className="dyn-page-header">
        {renderBreadcrumbs()}
        
        <div className="dyn-page-title-section">
          <div className="dyn-page-title-content">
            <h1 className="dyn-page-title">{title}</h1>
            {subtitle && (
              <p className="dyn-page-subtitle">{subtitle}</p>
            )}
          </div>
          {renderActions()}
        </div>
      </header>

      <main className="dyn-page-content">
        {children}
      </main>
    </div>
  );
};

DynPage.displayName = 'DynPage';

export default DynPage;