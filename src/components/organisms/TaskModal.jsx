import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  // Subtask-related state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [subtaskLoading, setSubtaskLoading] = useState(false);
  const newSubtaskInputRef = useRef(null);

  // Computed values for subtasks
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(s => s.status === 'completed').length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description,
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
      // Load existing subtasks
      setSubtasks(task.subtasks || []);
    } else {
      setFormState({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priority: 'medium',
        dueDate: ''
      });
      setSubtasks([]);
    }
    // Reset subtask editing state
    setEditingSubtask(null);
    setNewSubtaskTitle('');
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

  // Subtask handlers
  const handleKeyDown = (e, action, ...args) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(...args);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    
    setSubtaskLoading(true);
    try {
      const newSubtask = {
        id: `subtask-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        status: 'pending',
        order: subtasks.length
      };
      
      setSubtasks(prev => [...prev, newSubtask]);
      setNewSubtaskTitle('');
      
      // Focus back to input for continuous adding
      if (newSubtaskInputRef.current) {
        newSubtaskInputRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to add subtask:', error);
    } finally {
      setSubtaskLoading(false);
    }
  };

  const handleToggleSubtaskStatus = (subtaskId) => {
    setSubtasks(prev => 
      prev.map(subtask => 
        subtask.id === subtaskId 
          ? { 
              ...subtask, 
              status: subtask.status === 'completed' ? 'pending' : 'completed' 
            }
          : subtask
      )
    );
  };

  const handleUpdateSubtask = (subtaskId, updates) => {
    setSubtasks(prev => 
      prev.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, ...updates }
          : subtask
      )
    );
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSubtasks(updatedItems);
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

                {/* Subtasks Section */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Text as="h4" className="flex items-center">
                      <ApperIcon name="CheckSquare" className="w-4 h-4 mr-2 text-primary" />
                      Subtasks
                      {totalSubtasks > 0 && (
                        <span className="ml-2 text-sm text-surface-600">
                          ({completedSubtasks}/{totalSubtasks})
                        </span>
                      )}
                    </Text>
                    {totalSubtasks > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="h-full bg-success rounded-full"
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <Text as="span" className="text-xs text-surface-600">
                          {Math.round(progressPercentage)}%
                        </Text>
                      </div>
                    )}
                  </div>

                  {/* Add Subtask */}
                  <div className="flex space-x-2 mb-4">
                    <Input
                      ref={newSubtaskInputRef}
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add a subtask..."
                      className="flex-1 subtask-input"
                      onKeyDown={(e) => handleKeyDown(e, handleAddSubtask)}
                      disabled={subtaskLoading}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSubtask}
                      variant="primary"
                      className="px-3 py-2 rounded-8"
                      disabled={!newSubtaskTitle.trim() || subtaskLoading}
                      aria-label="Add subtask"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Subtasks List */}
                  {subtasks.length > 0 && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="subtasks">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-surface-50 rounded-8 p-2' : ''}`}
                          >
                            <AnimatePresence>
                              {subtasks.map((subtask, index) => (
                                <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                  {(provided, snapshot) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className={`subtask-item flex items-center space-x-3 p-3 bg-surface-50 rounded-8 ${
                                        snapshot.isDragging ? 'subtask-dragging' : ''
                                      }`}
                                    >
                                      {/* Drag Handle */}
                                      <div
                                        {...provided.dragHandleProps}
                                        className="subtask-drag-handle"
                                        tabIndex={0}
                                        aria-label="Drag to reorder"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            // Focus management for keyboard users
                                          }
                                        }}
                                      >
                                        <ApperIcon name="GripVertical" className="w-4 h-4 text-surface-400" />
                                      </div>

                                      {/* Status Checkbox */}
                                      <button
                                        type="button"
                                        onClick={() => handleToggleSubtaskStatus(subtask.id)}
                                        onKeyDown={(e) => handleKeyDown(e, handleToggleSubtaskStatus, subtask.id)}
                                        className={`w-5 h-5 rounded border-2 transition-all duration-150 flex items-center justify-center ${
                                          subtask.status === 'completed'
                                            ? 'bg-success border-success text-white'
                                            : 'border-surface-300 hover:border-success hover:bg-success/10'
                                        }`}
                                        disabled={subtaskLoading}
                                        aria-label={`Mark subtask as ${subtask.status === 'completed' ? 'incomplete' : 'complete'}`}
                                      >
                                        {subtask.status === 'completed' && (
                                          <ApperIcon name="Check" className="w-3 h-3" />
                                        )}
                                      </button>

                                      {/* Subtask Content */}
                                      <div className="flex-1 min-w-0">
                                        {editingSubtask === subtask.id ? (
                                          <Input
                                            type="text"
                                            value={subtask.title}
                                            onChange={(e) => {
                                              const updatedSubtasks = subtasks.map(s =>
                                                s.id === subtask.id ? { ...s, title: e.target.value } : s
                                              );
                                              setSubtasks(updatedSubtasks);
                                            }}
                                            onBlur={() => {
                                              setEditingSubtask(null);
                                              handleUpdateSubtask(subtask.id, { title: subtask.title });
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                setEditingSubtask(null);
                                                handleUpdateSubtask(subtask.id, { title: subtask.title });
                                              } else if (e.key === 'Escape') {
                                                setEditingSubtask(null);
                                              }
                                            }}
                                            className="subtask-input"
                                            autoFocus
                                          />
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => setEditingSubtask(subtask.id)}
                                            className={`text-left w-full p-1 rounded hover:bg-white/50 transition-colors ${
                                              subtask.status === 'completed' ? 'line-through text-surface-500' : ''
                                            }`}
                                            aria-label="Click to edit subtask"
                                          >
                                            <Text as="span" className="break-words">
                                              {subtask.title}
                                            </Text>
                                          </button>
                                        )}
                                      </div>

                                      {/* Delete Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubtask(subtask.id)}
                                        onKeyDown={(e) => handleKeyDown(e, handleDeleteSubtask, subtask.id)}
                                        className="text-surface-400 hover:text-error transition-colors p-1 rounded"
                                        disabled={subtaskLoading}
                                        aria-label="Delete subtask"
                                      >
                                        <ApperIcon name="X" className="w-4 h-4" />
                                      </button>

                                      {/* Screen Reader Status */}
                                      <div className="sr-only">
                                        Subtask {index + 1} of {subtasks.length}, 
                                        Status: {subtask.status === 'completed' ? 'completed' : 'incomplete'}
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                            </AnimatePresence>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}

                  {subtasks.length === 0 && (
                    <div className="text-center py-8 text-surface-500">
                      <ApperIcon name="CheckSquare" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <Text as="p" className="text-sm">
                        No subtasks yet. Add one above to break down this task.
                      </Text>
                    </div>
                  )}
                </div>

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