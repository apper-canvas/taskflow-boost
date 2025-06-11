import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Text from '@/components/atoms/Text';
import { format, isToday, isPast } from 'date-fns';

const TaskCard = ({ task, category, onToggleCompletion, onEdit, index }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error';
      case 'medium': return 'border-accent';
      case 'low': return 'border-surface-400';
      default: return 'border-surface-400';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-accent/10 text-accent';
      case 'low': return 'bg-surface-400/10 text-surface-600';
      default: return 'bg-surface-400/10 text-surface-600';
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'overdue';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const completedAtDate = task.completedAt ? new Date(task.completedAt) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      className={`bg-white rounded-12 p-4 border-l-4 cursor-pointer transition-all duration-200 ${
        task.completed ? 'border-success/50 opacity-75' : getPriorityColor(task.priority)
      }`}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Text as="h5" className={`break-words ${task.completed ? 'text-surface-700 line-through' : ''}`}>
            {task.title}
          </Text>
          {task.description && (
            <Text as="p" className={`text-sm mt-1 break-words ${task.completed ? 'text-surface-500 line-through' : ''}`}>
              {task.description}
            </Text>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompletion(task);
          }}
          className={`ml-3 w-6 h-6 rounded-full transition-all duration-150 flex items-center justify-center ${
            task.completed
              ? 'bg-success text-white'
              : 'border-2 border-surface-300 hover:border-success hover:bg-success/10'
          }`}
        >
          {task.completed && (
            <ApperIcon name="Check" className={`w-3 h-3 ${task.completed ? '' : 'text-success'}`} />
          )}
        </motion.button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {category && (
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-1 ${task.completed ? 'opacity-50' : ''}`}
                style={{ backgroundColor: category.color }}
              />
              <Text as="span" className={`${task.completed ? 'text-surface-500' : 'text-surface-600'}`}>
                {category.name}
              </Text>
            </div>
          )}

          {!task.completed && (
            <Badge className={getPriorityBg(task.priority)}>
              {task.priority}
            </Badge>
          )}
        </div>

        {task.dueDate && !task.completed && (
          <div className={`flex items-center ${
            dueDateStatus === 'overdue' ? 'text-error' :
            dueDateStatus === 'today' ? 'text-accent' :
            'text-surface-600'
          }`}>
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
<Text as="span">{format(new Date(task.dueDate), 'MMM d')}</Text>
          </div>
        )}

        {task.completed && completedAtDate && (
          <div className="flex items-center text-success">
            <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
            <Text as="span">Completed {format(completedAtDate, 'MMM d')}</Text>
          </div>
        )}
      </div>

      {/* Subtask Progress Indicator */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-surface-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckSquare" className="w-3 h-3 text-surface-500" />
              <Text as="span" className="text-surface-600">
                Subtasks: {task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length}
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-300"
                  style={{
                    width: `${task.subtasks.length > 0 ? (task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100 : 0}%`
                  }}
                />
              </div>
              <Text as="span" className="text-surface-500 min-w-[2rem] text-right">
                {task.subtasks.length > 0 
                  ? Math.round((task.subtasks.filter(s => s.status === 'completed').length / task.subtasks.length) * 100)
                  : 0}%
              </Text>
            </div>
          </div>
        </div>
      )}
    </motion.div>
};

export default TaskCard;