import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskCreationAndSearch from '@/components/organisms/TaskCreationAndSearch';
import TaskListSection from '@/components/organisms/TaskListSection';
import NoTasksYetContent from '@/components/organisms/NoTasksYetContent';
import NoTasksFoundMessage from '@/components/organisms/NoTasksFoundMessage';
import StatsPanel from '@/components/organisms/StatsPanel';
import TaskModal from '@/components/organisms/TaskModal';

// services are NOT components, keep their path as is
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';
import statsService from '@/services/api/statsService';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData, statsData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        statsService.getAll()
      ]);

      // Map tasks to include category object for easier prop passing
      const tasksWithCategories = tasksData.map(task => ({
        ...task,
        category: categoriesData.find(cat => cat.id === task.categoryId)
      }));

      setTasks(tasksWithCategories);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      const category = categories.find(cat => cat.id === newTask.categoryId);
      setTasks(prev => [{ ...newTask, category }, ...prev]);
      toast.success('Task created successfully');
      const updatedStats = await statsService.getAll();
      setStats(updatedStats);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      const category = categories.find(cat => cat.id === updatedTask.categoryId);
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...updatedTask, category } : task
      ));
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed!' : 'Task reopened');
        const updatedStats = await statsService.getAll();
        setStats(updatedStats);
      } else {
        toast.success('Task updated');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted');
      const updatedStats = await statsService.getAll();
      setStats(updatedStats);
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  // Filter tasks based on selected category and search
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;
    const matchesSearch = !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Separate completed and pending tasks
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;


  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadData} />;
  }

  if (tasks.length === 0) {
    return <NoTasksYetContent onCreateFirstTask={() => openTaskModal()} />;
  }

  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-full overflow-hidden">
        <div className="lg:col-span-2">
          <CategorySidebar
            categories={categories}
            tasks={tasks}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="lg:col-span-8 min-w-0">
          <TaskCreationAndSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddTaskClick={() => openTaskModal()}
          />

          <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <TaskListSection
              title="Pending Tasks"
              tasks={pendingTasks}
              onToggleCompletion={handleTaskUpdate}
              onEdit={openTaskModal}
              iconName="Clock"
              iconColorClass="text-surface-600"
            />
            <TaskListSection
              title="Completed Tasks"
              tasks={completedTasks}
              onToggleCompletion={handleTaskUpdate}
              onEdit={openTaskModal}
              iconName="CheckCircle"
              iconColorClass="text-success"
            />
            {filteredTasks.length === 0 && (
              <NoTasksFoundMessage
                searchQuery={searchQuery}
                selectedCategoryName={selectedCategoryName}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <StatsPanel stats={stats} />
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={closeTaskModal}
        task={editingTask}
        categories={categories}
        onSave={editingTask ? handleTaskUpdate : handleTaskCreate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default HomePage;