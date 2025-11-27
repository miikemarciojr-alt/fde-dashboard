'use client'

import { useState } from 'react'
import { Plus, Check, MoreVertical, Clock, Calendar as CalendarIcon } from 'lucide-react'
import TaskDetailModal, { Task } from './TaskDetailModal'

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '日本生命のデモ作成',
      description: 'FAQ検索機能のデモを作成。要件：\n- ひらがな/カタカナ対応\n- レスポンシブデザイン\n- Vercelデプロイ',
      category: 'Demo',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-11-30',
      assignee: '三池ジュニオール',
      createdAt: '2025-11-25T10:00:00Z',
      updatedAt: '2025-11-27T06:00:00Z'
    },
    {
      id: '2',
      title: 'IS架電リストの整理',
      description: '11月分の架電リストを整理し、優先順位をつける。\n\n対象:\n- 未接触企業: 30社\n- 再アプローチ: 15社',
      category: 'IS',
      priority: 'medium',
      status: 'todo',
      assignee: '三池ジュニオール',
      createdAt: '2025-11-26T14:00:00Z',
      updatedAt: '2025-11-26T14:00:00Z'
    }
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const categoryColors = {
    IS: 'bg-blue-500',
    FS: 'bg-purple-500',
    Demo: 'bg-teal-500',
    Proposal: 'bg-orange-500',
    Other: 'bg-gray-500'
  }

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  }

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-700 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'done': 'bg-green-100 text-green-700 border-green-200'
  }

  const statusLabels = {
    'todo': '未着手',
    'in-progress': '進行中',
    'done': '完了'
  }

  const openTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const createNewTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      category: 'Other',
      priority: 'medium',
      status: 'todo',
      assignee: '三池ジュニオール',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
    setIsCreating(false)

    // 作成後すぐに編集モーダルを開く
    setSelectedTask(newTask)
    setIsModalOpen(true)
  }

  const saveTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const statusFlow: Task['status'][] = ['todo', 'in-progress', 'done']
        const currentIndex = statusFlow.indexOf(task.status)
        const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length]
        return { ...task, status: nextStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const groupedTasks = {
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'todo': tasks.filter(t => t.status === 'todo'),
    'done': tasks.filter(t => t.status === 'done')
  }

  const renderTask = (task: Task) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

    return (
      <div
        key={task.id}
        onClick={() => openTask(task)}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start space-x-3">
          {/* Status Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleStatus(task.id)
            }}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 transition-all mt-0.5
              ${task.status === 'done'
                ? 'bg-green-600 border-green-600'
                : 'border-gray-300 hover:border-blue-600'
              }
            `}
          >
            {task.status === 'done' && <Check className="w-4 h-4 text-white" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Priority */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{priorityIcons[task.priority]}</span>
              <h3 className={`font-semibold text-gray-900 ${task.status === 'done' ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </h3>
            </div>

            {/* Description Preview */}
            {task.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <span className={`px-2 py-0.5 text-xs font-medium text-white rounded ${categoryColors[task.category]}`}>
                {task.category}
              </span>

              {/* Status */}
              <span className={`px-2 py-0.5 text-xs font-medium border rounded ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span className={`flex items-center space-x-1 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  <CalendarIcon className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
                  {isOverdue && <span className="text-red-600">⚠️</span>}
                </span>
              )}

              {/* Assignee */}
              <span className="flex items-center space-x-1 text-xs text-gray-500">
                <span>👤</span>
                <span>{task.assignee}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">タスク管理</h2>
            <p className="text-sm text-gray-500 mt-1">
              進行中: {groupedTasks['in-progress'].length} /
              未着手: {groupedTasks['todo'].length} /
              完了: {groupedTasks['done'].length}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新規タスク</span>
          </button>
        </div>

        {/* Quick Add */}
        {isCreating && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewTask()}
              placeholder="タスクのタイトルを入力..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autoFocus
            />
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={createNewTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium"
              >
                作成して編集
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewTaskTitle('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* Tasks by Status */}
        <div className="space-y-6">
          {/* In Progress */}
          {groupedTasks['in-progress'].length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                進行中 ({groupedTasks['in-progress'].length})
              </h3>
              <div className="space-y-2">
                {groupedTasks['in-progress'].map(renderTask)}
              </div>
            </div>
          )}

          {/* Todo */}
          {groupedTasks['todo'].length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                未着手 ({groupedTasks['todo'].length})
              </h3>
              <div className="space-y-2">
                {groupedTasks['todo'].map(renderTask)}
              </div>
            </div>
          )}

          {/* Done */}
          {groupedTasks['done'].length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                完了済み ({groupedTasks['done'].length})
              </h3>
              <div className="space-y-2 opacity-75">
                {groupedTasks['done'].map(renderTask)}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">タスクがありません</p>
              <p className="text-sm mt-1">「新規タスク」ボタンから作成してください</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
        onSave={saveTask}
        onDelete={deleteTask}
      />
    </>
  )
}
