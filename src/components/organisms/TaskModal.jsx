import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Text from '@/components/atoms/Text';
import { format } from 'date-fns';

const TaskModal = ({ isOpen, onClose, task, categories, onSave, onDelete }) => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description,
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
    } else {
      setFormState({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priority: 'medium',
        dueDate: ''
      });
    }
  }, [isOpen, task, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    const taskData = {
      ...formState,
      dueDate: formState.dueDate ? new Date(formState.dueDate).toISOString() : null
    };

    onSave(task?.id, taskData);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-12 shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Text as="h3">{task ? 'Edit Task' : 'Create New Task'}</Text>
                <Button onClick={onClose} variant="icon">
                  <ApperIcon name="X" className="w-4 h-4 text-surface-600" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Task Title *"
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formState.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                />
                <Input
                  label="Description"
                  id="description"
                  name="description"
                  type="textarea"
                  value={formState.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter task description..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    id="categoryId"
                    name="categoryId"
                    value={formState.categoryId}
                    onChange={handleChange}
                    options={categoryOptions}
                  />
                  <Select
                    label="Priority"
                    id="priority"
                    name="priority"
                    value={formState.priority}
                    onChange={handleChange}
                    options={priorityOptions}
                  />
                </div>

                <Input
                  label="Due Date"
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formState.dueDate}
                  onChange={handleChange}
                />

                <div className="flex justify-between pt-4">
                  {task && (
                    <Button type="button" onClick={handleDelete} variant="danger" className="px-4 py-2 rounded-8">
                      Delete Task
                    </Button>
                  )}

                  <div className="flex space-x-3 ml-auto">
                    <Button type="button" onClick={onClose} variant="secondary" className="px-4 py-2 rounded-8">
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="px-4 py-2 rounded-8">
                      {task ? 'Update Task' : 'Create Task'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;