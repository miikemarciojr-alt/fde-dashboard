'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  FileQuestion,
  LayoutDashboard,
  Zap,
  Hammer,
  Rocket,
  FileText,
  Calculator,
  Code,
  Target,
  TrendingUp
} from 'lucide-react'
import CommandButton from '@/components/CommandButton'
import TaskManager from '@/components/TaskManagerEnhanced'
import CosenseLinks from '@/components/CosenseLinks'
import CommandExecutionPanel from '@/components/CommandExecutionPanel'

// ターミナルコンポーネントは動的インポート（ブラウザ専用）
const Terminal = dynamic(() => import('@/components/TerminalSimple'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-600">ターミナルを読み込み中...</p>
    </div>
  )
})

export default function Home() {
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)

  const commands = [
    {
      id: 'demo-faq',
      name: 'FAQ Demo',
      description: 'FAQ検索デモを作成',
      icon: FileQuestion,
      color: 'bg-blue-600',
      estimatedTime: '30-45分'
    },
    {
      id: 'demo-dashboard',
      name: 'Dashboard',
      description: 'ダッシュボードデモを作成',
      icon: LayoutDashboard,
      color: 'bg-teal-600',
      estimatedTime: '45-60分'
    },
    {
      id: 'demo-quick',
      name: 'Quick Demo',
      description: 'カスタムデモを爆速作成',
      icon: Zap,
      color: 'bg-cyan-600',
      estimatedTime: '30-90分'
    },
    {
      id: 'deploy-vercel',
      name: 'Deploy',
      description: 'Vercelにデプロイ',
      icon: Rocket,
      color: 'bg-blue-500',
      estimatedTime: '5-10分'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FDE Dashboard</h1>
                <p className="text-sm text-gray-500">三池ジュニオール - PODs業務支援</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Helpfeel PODs</p>
                <p className="text-xs text-gray-500">Nota Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">今週のタスク</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Target className="w-12 h-12 opacity-20" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm mb-1">完了済み</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-20" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm mb-1">デモ作成数</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Rocket className="w-12 h-12 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <TaskManager />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                クイックアクション
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {commands.map((command) => (
                  <button
                    key={command.id}
                    onClick={() => setSelectedCommand(command.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${selectedCommand === command.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 ${command.color} rounded-lg flex items-center justify-center mb-2`}>
                      <command.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{command.name}</h3>
                    <p className="text-xs text-gray-500">{command.estimatedTime}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cosense Links */}
          <div className="space-y-6">
            <CosenseLinks />
          </div>
        </div>

        {/* Command Execution Progress */}
        {selectedCommand && (
          <section className="mb-6">
            <CommandExecutionPanel
              commandId={selectedCommand}
              commandName={commands.find(c => c.id === selectedCommand)?.name || ''}
            />
          </section>
        )}

        {/* Terminal */}
        <section>
          <Terminal selectedCommand={selectedCommand} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          <p className="font-medium">FDE Dashboard by Helpfeel PODs</p>
          <p className="text-xs mt-1">Powered by Claude Code & Next.js</p>
        </div>
      </footer>
    </div>
  )
}
