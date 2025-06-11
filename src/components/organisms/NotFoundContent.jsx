import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import IconWrapper from '@/components/atoms/IconWrapper';

const NotFoundContent = () => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 max-w-md mx-auto"
    >
      <IconWrapper
        animateProps={{ y: [0, -10, 0] }}
        transitionProps={{ repeat: Infinity, duration: 3 }}
        className="w-24 h-24 bg-primary/10"
      >
        <ApperIcon name="FileQuestion" className="w-12 h-12 text-primary" />
      </IconWrapper>

      <Text as="h1" className="mb-2">Page Not Found</Text>
      <Text as="p" className="mb-6">
        The page you're looking for doesn't exist or has been moved.
      </Text>

      <Button as={Link} to="/" className="px-6 py-3 rounded-8" variant="primary">
        <ApperIcon name="Home" className="w-4 h-4 mr-2" />
        Back to Tasks
      </Button>
    </motion.div>
  );
};

export default NotFoundContent;