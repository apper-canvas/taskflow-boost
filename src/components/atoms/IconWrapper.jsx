import React from 'react';
import { motion } from 'framer-motion';

const IconWrapper = ({ children, className = '', animateProps = {}, transitionProps = {}, ...props }) => {
  return (
    <motion.div
      className={`rounded-12 flex items-center justify-center mx-auto mb-6 ${className}`}
      animate={animateProps}
      transition={transitionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default IconWrapper;