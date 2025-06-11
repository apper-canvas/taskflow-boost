import React from 'react';

const Text = ({ as: Component = 'p', children, className = '', ...props }) => {
  const baseClasses = {
    h1: "text-2xl font-display font-bold text-surface-900",
    h3: "text-lg font-display font-semibold text-surface-900",
    h4: "font-display font-semibold text-surface-900",
    h5: "font-medium text-surface-900",
    p: "text-surface-600",
    span: ""
  };

  return (
    <Component className={`${baseClasses[Component] || ''} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Text;