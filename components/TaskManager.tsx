'use client'

import { useState } from 'react'
import { Plus, Check, Trash2, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  category: 'IS' | 'FS' | 'Demo' | 'Proposal' | 'Other'
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  completed: boolean
  createdAt: string
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '日本生命のデモ作成',
      category: 'Demo',
      priority: 'high',
      dueDate: '2025-11-30',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'IS架電リストの整理',
      category: 'IS',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  const categoryColors = {
    IS: 'bg-blue-500',
    FS: 'bg-purple-500',
    Demo: 'bg-teal-500',
    Proposal: 'bg-orange-500',
    Other: 'bg-gray-500'
  }

  const priorityColors = {
    high: 'text-red-400 border-red-400',
    medium: 'text-yellow-400 border-yellow-400',
    low: 'text-green-400 border-green-400'
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: 'Other',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setShowAddTask(false)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">タスク管理</h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeTasks.length}件のアクティブタスク
          </p>
        </div>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>追加</span>
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="新しいタスクを入力..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={addTask}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              追加
            </button>
            <button
              onClick={() => {
                setShowAddTask(false)
                setNewTaskTitle('')
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div className="space-y-2 mb-6">
        {activeTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-600 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-xs font-medium text-white rounded ${categoryColors[task.category]}`}>
                  {task.category}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium border rounded ${priorityColors[task.priority]}`}>
                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
              <p className="text-gray-900 mt-1">{task.title}</p>
              {task.dueDate && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            完了済み ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 w-5 h-5 rounded bg-blue-600 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </button>
                <p className="flex-1 text-gray-500 line-through">{task.title}</p>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
