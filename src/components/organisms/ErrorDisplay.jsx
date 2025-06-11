import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="w-16 h-16 bg-error/10 rounded-12 flex items-center justify-center mx-auto mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </motion.div>
        </div>
        <Text as="h3" className="text-lg font-semibold mb-2">Something went wrong</Text>
        <Text as="p" className="mb-4">{message}</Text>
        <Button onClick={onRetry} className="px-4 py-2 rounded-8" variant="primary">
          Try Again
        </Button>
      </motion.div>
    </div>
  );
};

export default ErrorDisplay;