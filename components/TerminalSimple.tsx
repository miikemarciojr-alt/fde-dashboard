'use client'

import { useState, useRef, useEffect } from 'react'
import { Maximize2, Minimize2, Trash2 } from 'lucide-react'

interface TerminalProps {
  selectedCommand: string | null
}

export default function Terminal({ selectedCommand }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    '╔══════════════════════════════════════════╗',
    '║     FDE Dashboard Terminal v1.0          ║',
    '╚══════════════════════════════════════════╝',
    '',
    '✨ 実際のFDE-Workspaceで動作します',
    '💡 Tip: ls, cd, npm コマンドなど全て実行可能',
    '📁 作業ディレクトリ: ~/Desktop/FDE-Workspace',
    ''
  ])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cwd, setCwd] = useState('/Users/miikemarciojunior/Desktop/FDE-Workspace')
  const outputRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // 選択されたコマンドの実行
  useEffect(() => {
    if (selectedCommand) {
      const commandDescriptions: Record<string, string> = {
        'demo-faq': 'FAQ検索デモを作成します...',
        'demo-dashboard': 'ダッシュボードデモを作成します...',
        'demo-quick': 'カスタムデモを作成します。要件を入力してください。',
        'prototype': 'プロトタイプを作成します...',
        'deploy-vercel': 'Vercelにデプロイします...',
        'tech-proposal': '技術提案書を生成します...',
        'tech-estimate': '工数見積もりを生成します...',
        'helpfeel-integrate': 'Helpfeel統合サンプルを作成します...'
      }

      setOutput(prev => [
        ...prev,
        `$ ${selectedCommand}`,
        `🚀 Running: ${selectedCommand}`,
        commandDescriptions[selectedCommand] || '',
        '⏳ この機能は開発中です。完全実装をお待ちください。',
        ''
      ])
    }
  }, [selectedCommand])

  const executeCommand = async (command: string) => {
    if (!command.trim()) return

    setIsRunning(true)
    setOutput(prev => [...prev, `$ ${command}`])

    try {
      // 基本的なコマンドをローカル処理
      if (command === 'clear') {
        setOutput([''])
        setIsRunning(false)
        return
      }

      if (command === 'help') {
        setOutput(prev => [
          ...prev,
          '🔧 FDE Dashboard Terminal',
          '',
          '📂 現在のディレクトリ: ' + cwd,
          '',
          '利用可能なコマンド（実際のシェルコマンドが実行されます）:',
          '  ls -la           - ファイル詳細一覧',
          '  cd <dir>         - ディレクトリ移動',
          '  pwd              - 現在のディレクトリ',
          '  npm run dev      - 開発サーバー起動',
          '  git status       - Gitステータス',
          '  clear            - 画面をクリア',
          '  help             - このヘルプ',
          '',
          '💡 パイプ(|)や&&などのシェル機能も使えます',
          '例: ls -la | grep json',
          ''
        ])
        setIsRunning(false)
        return
      }

      // サーバーサイドでコマンド実行
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, cwd })
      })

      if (!response.ok) {
        setOutput(prev => [...prev, `❌ Error: ${response.statusText}`, ''])
        setIsRunning(false)
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let result = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += decoder.decode(value)
        }

        setOutput(prev => [...prev, result, ''])
      }
    } catch (error) {
      setOutput(prev => [...prev, `❌ Error: ${error}`, ''])
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input.trim())
      setInput('')
    }
  }

  const clearOutput = () => {
    setOutput([''])
  }

  return (
    <div
      className={`
        bg-gray-900 rounded-lg border border-gray-700 overflow-hidden
        transition-all duration-300
        ${isExpanded ? 'fixed inset-4 z-50' : 'relative'}
      `}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400 ml-3">Terminal</span>
          {isRunning && (
            <span className="flex items-center space-x-1 text-yellow-400 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span>Running...</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearOutput}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="クリア"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={isExpanded ? '縮小' : '拡大'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4">
        {/* Output */}
        <div
          ref={outputRef}
          className="font-mono text-sm text-green-400 whitespace-pre-wrap overflow-y-auto mb-4"
          style={{
            height: isExpanded ? 'calc(100vh - 200px)' : '400px',
            scrollBehavior: 'smooth'
          }}
        >
          {output.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-blue-400 font-bold' : ''}>
              {line}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-blue-400 font-mono font-bold">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isRunning}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm"
            placeholder="コマンドを入力..."
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
