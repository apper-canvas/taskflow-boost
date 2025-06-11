import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatItem = ({ iconName, title, value, bgColorClass, iconColorClass }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-8 ${bgColorClass}`}>
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-8 flex items-center justify-center mr-3 ${bgColorClass.replace('/5', '/10')}`}>
          <ApperIcon name={iconName} className={`w-4 h-4 ${iconColorClass}`} />
        </div>
        <div>
          <Text as="p" className="text-sm font-medium text-surface-900">{title}</Text>
          <Text as="p" className="text-xs text-surface-600">{value}</Text>
        </div>
      </div>
    </div>
  );
};

export default StatItem;