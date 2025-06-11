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
}

export default new TaskService()