'use client'

import { useState } from 'react'
import { ExternalLink, Plus, Trash2, BookOpen } from 'lucide-react'

interface CosenseLink {
  id: string
  title: string
  url: string
  category: string
  addedAt: string
}

export default function CosenseLinks() {
  const [links, setLinks] = useState<CosenseLink[]>([
    {
      id: '1',
      title: 'PODs業績計画',
      url: 'https://scrapbox.io/nota-internal/PODs',
      category: '計画',
      addedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'FDE業務ガイド',
      url: 'https://scrapbox.io/nota-internal/FDE',
      category: 'ガイド',
      addedAt: new Date().toISOString()
    }
  ])
  const [showAddLink, setShowAddLink] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' })

  const addLink = () => {
    if (!newLink.title || !newLink.url) return

    const link: CosenseLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      category: newLink.category || 'その他',
      addedAt: new Date().toISOString()
    }

    setLinks([link, ...links])
    setNewLink({ title: '', url: '', category: '' })
    setShowAddLink(false)
  }

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Cosense リンク</h2>
        </div>
        <button
          onClick={() => setShowAddLink(!showAddLink)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>追加</span>
        </button>
      </div>

      {/* Add Link Form */}
      {showAddLink && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
          <input
            type="text"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            placeholder="タイトル"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="URL (https://scrapbox.io/...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newLink.category}
            onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
            placeholder="カテゴリ（任意）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={addLink}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              追加
            </button>
            <button
              onClick={() => {
                setShowAddLink(false)
                setNewLink({ title: '', url: '', category: '' })
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-2">
        {links.map(link => (
          <div
            key={link.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {link.category}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 font-medium truncate"
                >
                  {link.title}
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{link.url}</p>
            </div>
            <button
              onClick={() => deleteLink(link.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Cosenseリンクを追加してください</p>
        </div>
      )}
    </div>
  )
}
