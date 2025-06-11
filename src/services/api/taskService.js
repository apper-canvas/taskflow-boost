import { taskData } from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...taskData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await delay(300)
    const taskIndex = this.tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      completedAt: updates.completed ? new Date().toISOString() : null
    }
    
    this.tasks[taskIndex] = updatedTask
    return { ...updatedTask }
  }

  async delete(id) {
    await delay(250)
    const taskIndex = this.tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    this.tasks.splice(taskIndex, 1)
    return true
  }

  async getByCategory(categoryId) {
    await delay(200)
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }))
  }

  async getCompleted() {
    await delay(200)
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }))
  }

  async getPending() {
    await delay(200)
return this.tasks.filter(t => !t.completed).map(t => ({ ...t }))
  }

  // Subtask operations
  async createSubtask(taskId, subtaskData) {
    await delay(250)
    const taskIndex = this.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const task = this.tasks[taskIndex]
    if (!task.subtasks) {
      task.subtasks = []
    }

    const newSubtask = {
      id: Date.now().toString(),
      title: subtaskData.title,
      description: subtaskData.description || '',
      status: 'todo',
      order: task.subtasks.length,
      taskId: taskId,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    task.subtasks.push(newSubtask)
    return { ...newSubtask }
  }

  async updateSubtask(taskId, subtaskId, updates) {
    await delay(200)
    const taskIndex = this.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const task = this.tasks[taskIndex]
    if (!task.subtasks) {
      throw new Error('No subtasks found')
    }

    const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId)
    if (subtaskIndex === -1) {
      throw new Error('Subtask not found')
    }

    const updatedSubtask = {
      ...task.subtasks[subtaskIndex],
      ...updates,
      completedAt: updates.status === 'completed' ? new Date().toISOString() : null
    }

    task.subtasks[subtaskIndex] = updatedSubtask
    return { ...updatedSubtask }
  }

  async deleteSubtask(taskId, subtaskId) {
    await delay(200)
    const taskIndex = this.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const task = this.tasks[taskIndex]
    if (!task.subtasks) {
      throw new Error('No subtasks found')
    }

    const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId)
    if (subtaskIndex === -1) {
      throw new Error('Subtask not found')
    }

    task.subtasks.splice(subtaskIndex, 1)
    
    // Reorder remaining subtasks
    task.subtasks.forEach((subtask, index) => {
      subtask.order = index
    })

    return true
  }

  async reorderSubtasks(taskId, subtaskIds) {
    await delay(250)
    const taskIndex = this.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const task = this.tasks[taskIndex]
    if (!task.subtasks) {
      throw new Error('No subtasks found')
    }

    // Create a map for quick lookup
    const subtaskMap = new Map(task.subtasks.map(s => [s.id, s]))
    
    // Reorder subtasks based on provided order
    task.subtasks = subtaskIds.map((id, index) => {
      const subtask = subtaskMap.get(id)
      if (!subtask) {
        throw new Error(`Subtask ${id} not found`)
      }
      return { ...subtask, order: index }
    })

    return [...task.subtasks]
  }

  async toggleSubtaskStatus(taskId, subtaskId) {
    await delay(200)
    const taskIndex = this.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const task = this.tasks[taskIndex]
    if (!task.subtasks) {
      throw new Error('No subtasks found')
    }

    const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId)
    if (subtaskIndex === -1) {
      throw new Error('Subtask not found')
    }

    const subtask = task.subtasks[subtaskIndex]
    const newStatus = subtask.status === 'completed' ? 'todo' : 'completed'
    
    const updatedSubtask = {
      ...subtask,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null
    }

    task.subtasks[subtaskIndex] = updatedSubtask
    return { ...updatedSubtask }
  }
}

export default new TaskService()