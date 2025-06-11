import React from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';

const CategoryButton = ({ category, isSelected, onClick, taskCount }) => {
  return (
    <Button
      variant="none"
      onClick={() => onClick(category.id)}
      className={`w-full text-left px-3 py-2 rounded-20 text-sm ${
        isSelected
          ? 'text-primary'
          : 'text-surface-700 hover:bg-surface-100'
      }`}
      style={{
        backgroundColor: isSelected
          ? `${category.color}20`
          : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: category.color }}
          />
          <Text as="span" className="text-sm font-medium">
            {category.name}
          </Text>
        </div>
        <Badge className="bg-surface-200 text-xs">
          {taskCount}
        </Badge>
      </div>
    </Button>
  );
};

export default CategoryButton;