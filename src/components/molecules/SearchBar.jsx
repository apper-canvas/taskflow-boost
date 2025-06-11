import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex-1 relative">
      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-3 bg-white rounded-8 border border-surface-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      />
    </div>
  );
};

export default SearchBar;