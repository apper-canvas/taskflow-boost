import taskService from './taskService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class StatsService {
  async getAll() {
    await delay(250)
    const tasks = await taskService.getAll()
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    const completedTasks = tasks.filter(t => t.completed)
    const completedToday = completedTasks.filter(t => {
      if (!t.completedAt) return false
      const completedDate = new Date(t.completedAt)
      return completedDate >= today
    }).length
    
    const completedThisWeek = completedTasks.filter(t => {
      if (!t.completedAt) return false
      const completedDate = new Date(t.completedAt)
      return completedDate >= weekStart
    }).length
    
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0
    
    // Calculate streak (simplified - consecutive days with completed tasks)
    let streak = 0
    const checkDate = new Date(today)
    while (streak < 30) { // Check up to 30 days back
      const dayTasks = completedTasks.filter(t => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        return completedDate.toDateString() === checkDate.toDateString()
      })
      
      if (dayTasks.length > 0) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return {
      totalTasks,
      completedToday,
      completedThisWeek,
      streak,
      completionRate
    }
  }
}

export default new StatsService()