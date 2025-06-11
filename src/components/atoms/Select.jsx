import React from 'react';

const Select = ({ label, id, value, onChange, options, className = '', ...props }) => {
  const baseClasses = "w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150";

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-surface-900 mb-2">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;