import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from './components/ApperIcon'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-primary rounded-8 flex items-center justify-center"
            >
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-xl font-display font-semibold text-surface-900">
              TaskFlow
            </h1>
          </div>
          <div className="text-sm text-surface-500 font-medium">
            Stay organized, stay productive
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout