import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import IconWrapper from '@/components/atoms/IconWrapper';

const NoTasksYetContent = ({ onCreateFirstTask }) => {
  return (
    <div className="h-full p-6 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12 max-w-md mx-auto"
      >
        <IconWrapper
          animateProps={{ y: [0, -10, 0] }}
          transitionProps={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 bg-primary/10"
        >
          <ApperIcon name="CheckSquare" className="w-12 h-12 text-primary" />
        </IconWrapper>
        <Text as="h3" className="text-xl mb-2">No tasks yet</Text>
        <Text as="p" className="mb-6 leading-relaxed">
          Get started by creating your first task and stay organized with TaskFlow
        </Text>
        <Button onClick={onCreateFirstTask} className="px-6 py-3 rounded-8" variant="primary">
          Create Your First Task
        </Button>
      </motion.div>
    </div>
  );
};

export default NoTasksYetContent;