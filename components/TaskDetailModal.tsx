'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Tag, Flag, User, Clock } from 'lucide-react'

export interface Task {
  id: string
  title: string
  description: string
  category: 'IS' | 'FS' | 'Demo' | 'Proposal' | 'Other'
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
  dueDate?: string
  assignee: string
  createdAt: string
  updatedAt: string
}

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskDetailModal({ task, isOpen, onClose, onSave, onDelete }: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })
    }
  }, [task])

  if (!isOpen || !editedTask) return null

  const handleSave = () => {
    if (!editedTask.title.trim()) {
      alert('タイトルは必須です')
      return
    }
    onSave({ ...editedTask, updatedAt: new Date().toISOString() })
    onClose()
  }

  const handleDelete = () => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      onDelete(editedTask.id)
      onClose()
    }
  }

  const categoryOptions: Array<{ value: Task['category']; label: string; color: string }> = [
    { value: 'IS', label: 'IS（インサイドセールス）', color: 'bg-blue-500' },
    { value: 'FS', label: 'FS（フィールドセールス）', color: 'bg-purple-500' },
    { value: 'Demo', label: 'デモ作成', color: 'bg-teal-500' },
    { value: 'Proposal', label: '提案書作成', color: 'bg-orange-500' },
    { value: 'Other', label: 'その他', color: 'bg-gray-500' }
  ]

  const priorityOptions: Array<{ value: Task['priority']; label: string; color: string }> = [
    { value: 'high', label: '高', color: 'text-red-600 bg-red-50 border-red-200' },
    { value: 'medium', label: '中', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { value: 'low', label: '低', color: 'text-green-600 bg-green-50 border-green-200' }
  ]

  const statusOptions: Array<{ value: Task['status']; label: string; color: string }> = [
    { value: 'todo', label: '未着手', color: 'bg-gray-100 text-gray-700' },
    { value: 'in-progress', label: '進行中', color: 'bg-blue-100 text-blue-700' },
    { value: 'done', label: '完了', color: 'bg-green-100 text-green-700' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">タスク詳細</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
              placeholder="タスクのタイトルを入力..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明・メモ
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="タスクの詳細、メモ、関連情報などを記入..."
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 mr-1" />
                カテゴリ
              </label>
              <select
                value={editedTask.category}
                onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value as Task['category'] })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 mr-1" />
                優先度
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                ステータス
              </label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                期限
              </label>
              <input
                type="date"
                value={editedTask.dueDate || ''}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-1" />
              担当者
            </label>
            <input
              type="text"
              value={editedTask.assignee}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">作成日:</span>{' '}
                {new Date(editedTask.createdAt).toLocaleString('ja-JP')}
              </div>
              <div>
                <span className="font-medium">更新日:</span>{' '}
                {new Date(editedTask.updatedAt).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            削除
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
