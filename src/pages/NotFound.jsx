import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8 max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 bg-primary/10 rounded-12 flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="FileQuestion" className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-surface-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-8 font-medium hover:brightness-110 transition-all duration-150"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound