import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const TaskCreationAndSearch = ({ searchQuery, onSearchChange, onAddTaskClick }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <Button onClick={onAddTaskClick} className="px-4 py-3 rounded-8" variant="primary">
        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
};

export default TaskCreationAndSearch;