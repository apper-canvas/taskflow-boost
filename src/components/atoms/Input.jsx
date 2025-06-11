import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, placeholder, className = '', required = false, rows = 1, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150";

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-surface-900 mb-2">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClasses} resize-none ${className}`}
          rows={rows}
          required={required}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClasses} ${className}`}
          required={required}
          {...props}
        />
      )}
    </div>
  );
};

export default Input;