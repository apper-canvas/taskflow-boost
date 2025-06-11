import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', type = 'button', variant = 'primary', as: Component = 'button', ...props }) => {
  const baseClasses = "font-medium transition-all duration-150 flex items-center justify-center";
  const variantClasses = {
    primary: "bg-primary text-white hover:brightness-110",
    secondary: "text-surface-600 hover:bg-surface-100",
    danger: "text-error hover:bg-error/5",
    icon: "w-8 h-8 rounded-8 hover:bg-surface-100",
    outline: "border-2 border-surface-300 hover:border-success hover:bg-success/10",
    success: "bg-success text-white",
    none: "" // For buttons that should not have default styling applied
  };

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };
  
  // Custom handling for 'as' prop to render different HTML elements or components
  const Comp = motion[Component] || motion.button;

  return (
    <Comp
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type={Component === 'button' ? type : undefined} // Only apply type to button elements
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Button;