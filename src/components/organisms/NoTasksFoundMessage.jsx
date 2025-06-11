import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const NoTasksFoundMessage = ({ searchQuery, selectedCategoryName }) => {
  const message = searchQuery
    ? `No tasks match "${searchQuery}"`
    : selectedCategoryName && selectedCategoryName !== 'all'
      ? `No tasks in ${selectedCategoryName}`
      : 'Create your first task to get started';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-surface-100 rounded-12 flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="Search" className="w-8 h-8 text-surface-400" />
      </div>
      <Text as="h3" className="text-lg font-medium mb-2">
        No tasks found
      </Text>
      <Text as="p">
        {message}
      </Text>
    </motion.div>
  );
};

export default NoTasksFoundMessage;