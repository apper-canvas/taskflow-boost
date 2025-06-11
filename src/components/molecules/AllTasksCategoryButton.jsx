import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Text from '@/components/atoms/Text';

const AllTasksCategoryButton = ({ isSelected, onClick, taskCount }) => {
  return (
    <Button
      variant="none"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-20 text-sm ${
        isSelected
          ? 'bg-primary/15 text-primary'
          : 'text-surface-700 hover:bg-surface-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <Text as="span" className="text-sm font-medium">All Tasks</Text>
        <Badge className="bg-surface-200 text-xs">{taskCount}</Badge>
      </div>
    </Button>
  );
};

export default AllTasksCategoryButton;