import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import taskService from '../services/api/taskService'
import categoryService from '../services/api/categoryService'
import statsService from '../services/api/statsService'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, categoriesData, statsData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        statsService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
      setStats(statsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      toast.success('Task created successfully')
      // Update stats
      const updatedStats = await statsService.getAll()
      setStats(updatedStats)
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleTaskUpdate = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed!' : 'Task reopened')
        // Update stats when completion status changes
        const updatedStats = await statsService.getAll()
        setStats(updatedStats)
      } else {
        toast.success('Task updated')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleTaskDelete = async (id) => {
    try {
      await taskService.delete(id)
      setTasks(prev => prev.filter(task => task.id !== id))
      toast.success('Task deleted')
      // Update stats
      const updatedStats = await statsService.getAll()
      setStats(updatedStats)
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Category Sidebar Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-12 p-4 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-20"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-surface-200 rounded-20"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Task List Skeleton */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-12 bg-white rounded-12 shadow-sm"></div>
              </div>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-white rounded-12 p-6 shadow-sm">
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-surface-200 rounded w-3/4"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Panel Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-12 p-4 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-surface-200 rounded w-16"></div>
                <div className="h-16 bg-surface-200 rounded-12"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 bg-error/10 rounded-12 flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
            </motion.div>
          </div>
          <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-8 font-medium hover:brightness-110 transition-all duration-150"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <MainFeature
      tasks={tasks}
      categories={categories}
      stats={stats}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onTaskCreate={handleTaskCreate}
      onTaskUpdate={handleTaskUpdate}
      onTaskDelete={handleTaskDelete}
    />
  )
}

export default Home