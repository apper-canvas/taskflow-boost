import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import TaskCard from '@/components/molecules/TaskCard';

const TaskListSection = ({ title, tasks, onToggleCompletion, onEdit, iconName, iconColorClass }) => {
  if (tasks.length === 0) return null;

  return (
    <div>
      <Text as="h4" className="mb-4 flex items-center">
        <ApperIcon name={iconName} className={`w-4 h-4 mr-2 ${iconColorClass}`} />
        {title} ({tasks.length})
      </Text>
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              category={task.category}
              onToggleCompletion={onToggleCompletion}
              onEdit={onEdit}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskListSection;