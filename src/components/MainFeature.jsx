import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast, isFuture } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({
  tasks,
  categories,
  stats,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}) => {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })

  // Filter tasks based on selected category and search
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Separate completed and pending tasks
  const pendingTasks = filteredTasks.filter(task => !task.completed)
  const completedTasks = filteredTasks.filter(task => task.completed)

  const openTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task)
      setTaskForm({
        title: task.title,
        description: task.description,
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      })
    } else {
      setEditingTask(null)
      setTaskForm({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priority: 'medium',
        dueDate: ''
      })
    }
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      categoryId: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const handleTaskSubmit = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) return

    const taskData = {
      ...taskForm,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null
    }

    if (editingTask) {
      onTaskUpdate(editingTask.id, taskData)
    } else {
      onTaskCreate(taskData)
    }
    closeTaskModal()
  }

  const toggleTaskCompletion = (task) => {
    onTaskUpdate(task.id, { completed: !task.completed })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error'
      case 'medium': return 'border-accent'
      case 'low': return 'border-surface-400'
      default: return 'border-surface-400'
    }
  }

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error'
      case 'medium': return 'bg-accent/10 text-accent'
      case 'low': return 'bg-surface-400/10 text-surface-600'
      default: return 'bg-surface-400/10 text-surface-600'
    }
  }

  const getCategoryById = (id) => categories.find(cat => cat.id === id)

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    if (isToday(date)) return 'today'
    if (isPast(date)) return 'overdue'
    if (isFuture(date)) return 'upcoming'
    return null
  }

  if (tasks.length === 0) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 max-w-md mx-auto"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 bg-primary/10 rounded-12 flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="CheckSquare" className="w-12 h-12 text-primary" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-surface-900 mb-2">
            No tasks yet
          </h3>
          <p className="text-surface-600 mb-6 leading-relaxed">
            Get started by creating your first task and stay organized with TaskFlow
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openTaskModal()}
            className="px-6 py-3 bg-primary text-white rounded-8 font-medium hover:brightness-110 transition-all duration-150"
          >
            Create Your First Task
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-full overflow-hidden">
        {/* Category Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-12 p-4 shadow-sm h-fit">
            <h3 className="font-display font-semibold text-surface-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange('all')}
                className={`w-full text-left px-3 py-2 rounded-20 text-sm font-medium transition-all duration-150 ${
                  selectedCategory === 'all'
                    ? 'bg-primary/15 text-primary'
                    : 'text-surface-700 hover:bg-surface-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>All Tasks</span>
                  <span className="text-xs bg-surface-200 px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </div>
              </motion.button>
              
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-20 text-sm font-medium transition-all duration-150 ${
                    selectedCategory === category.id
                      ? 'text-primary'
                      : 'text-surface-700 hover:bg-surface-100'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id 
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
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs bg-surface-200 px-2 py-1 rounded-full">
                      {tasks.filter(t => t.categoryId === category.id).length}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List Area */}
        <div className="lg:col-span-8 min-w-0">
          {/* Search and Quick Add */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-8 border border-surface-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05, brightness: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTaskModal()}
              className="px-4 py-3 bg-primary text-white rounded-8 font-medium hover:brightness-110 transition-all duration-150 flex items-center"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Task
            </motion.button>
          </div>

          {/* Task Lists */}
          <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h4 className="font-display font-semibold text-surface-900 mb-4 flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-surface-600" />
                  Pending Tasks ({pendingTasks.length})
                </h4>
                <div className="space-y-3">
                  <AnimatePresence>
                    {pendingTasks.map((task, index) => {
                      const category = getCategoryById(task.categoryId)
                      const dueDateStatus = getDueDateStatus(task.dueDate)
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          className={`bg-white rounded-12 p-4 border-l-4 cursor-pointer transition-all duration-200 ${getPriorityColor(task.priority)}`}
                          onClick={() => openTaskModal(task)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-surface-900 break-words">
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-surface-600 mt-1 break-words">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleTaskCompletion(task)
                              }}
                              className="ml-3 w-6 h-6 rounded-full border-2 border-surface-300 hover:border-success hover:bg-success/10 transition-all duration-150 flex items-center justify-center"
                            >
                              {task.completed && (
                                <ApperIcon name="Check" className="w-3 h-3 text-success" />
                              )}
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              {category && (
                                <div className="flex items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="text-surface-600">{category.name}</span>
                                </div>
                              )}
                              
                              <span className={`px-2 py-1 rounded-full font-medium ${getPriorityBg(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            {task.dueDate && (
                              <div className={`flex items-center ${
                                dueDateStatus === 'overdue' ? 'text-error' :
                                dueDateStatus === 'today' ? 'text-accent' :
                                'text-surface-600'
                              }`}>
                                <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h4 className="font-display font-semibold text-surface-900 mb-4 flex items-center">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2 text-success" />
                  Completed Tasks ({completedTasks.length})
                </h4>
                <div className="space-y-3">
                  <AnimatePresence>
                    {completedTasks.map((task, index) => {
                      const category = getCategoryById(task.categoryId)
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-12 p-4 border-l-4 border-success/50 opacity-75 cursor-pointer transition-all duration-200"
                          onClick={() => openTaskModal(task)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-surface-700 line-through break-words">
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-surface-500 mt-1 line-through break-words">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleTaskCompletion(task)
                              }}
                              className="ml-3 w-6 h-6 rounded-full bg-success text-white transition-all duration-150 flex items-center justify-center"
                            >
                              <ApperIcon name="Check" className="w-3 h-3" />
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              {category && (
                                <div className="flex items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1 opacity-50"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span className="text-surface-500">{category.name}</span>
                                </div>
                              )}
                            </div>
                            
                            {task.completedAt && (
                              <div className="flex items-center text-success">
                                <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                                <span>Completed {format(new Date(task.completedAt), 'MMM d')}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-surface-100 rounded-12 flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Search" className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-lg font-display font-medium text-surface-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-surface-600">
                  {searchQuery 
                    ? `No tasks match "${searchQuery}"`
                    : selectedCategory !== 'all' 
                      ? `No tasks in ${getCategoryById(selectedCategory)?.name || 'this category'}`
                      : 'Create your first task to get started'
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-12 p-4 shadow-sm">
            <h3 className="font-display font-semibold text-surface-900 mb-4">Progress</h3>
            
            {stats && (
              <div className="space-y-4">
                {/* Completion Ring */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx={40}
                        cy={40}
                        r={30}
                        fill="transparent"
                        stroke="#E2E8F0"
                        strokeWidth={6}
                      />
                      <motion.circle
                        cx={40}
                        cy={40}
                        r={30}
                        fill="transparent"
                        stroke="#5B4FE7"
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={188.4}
                        initial={{ strokeDashoffset: 188.4 }}
                        animate={{ 
                          strokeDashoffset: 188.4 - (188.4 * (stats.completionRate / 100))
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-display font-bold text-surface-900">
                        {Math.round(stats.completionRate)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-surface-600 mt-2">Today's Progress</p>
                </div>

                {/* Stats Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-success/10 rounded-8 flex items-center justify-center mr-3">
                        <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900">Completed Today</p>
                        <p className="text-xs text-surface-600">{stats.completedToday} tasks</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-info/5 rounded-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-info/10 rounded-8 flex items-center justify-center mr-3">
                        <ApperIcon name="Calendar" className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900">This Week</p>
                        <p className="text-xs text-surface-600">{stats.completedThisWeek} completed</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent/5 rounded-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-accent/10 rounded-8 flex items-center justify-center mr-3">
                        <ApperIcon name="Flame" className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900">Streak</p>
                        <p className="text-xs text-surface-600">{stats.streak} days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
              onClick={closeTaskModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-12 shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-semibold text-surface-900">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeTaskModal}
                    className="w-8 h-8 rounded-8 flex items-center justify-center hover:bg-surface-100 transition-colors duration-150"
                  >
                    <ApperIcon name="X" className="w-4 h-4 text-surface-600" />
                  </motion.button>
                </div>

                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150 resize-none"
                      placeholder="Enter task description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-900 mb-2">
                        Category
                      </label>
                      <select
                        value={taskForm.categoryId}
                        onChange={(e) => setTaskForm({ ...taskForm, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-900 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-200 rounded-8 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    {editingTask && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onTaskDelete(editingTask.id)
                          closeTaskModal()
                        }}
                        className="px-4 py-2 text-error hover:bg-error/5 rounded-8 font-medium transition-all duration-150"
                      >
                        Delete Task
                      </motion.button>
                    )}
                    
                    <div className="flex space-x-3 ml-auto">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={closeTaskModal}
                        className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-8 font-medium transition-all duration-150"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05, brightness: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary text-white rounded-8 font-medium hover:brightness-110 transition-all duration-150"
                      >
                        {editingTask ? 'Update Task' : 'Create Task'}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature