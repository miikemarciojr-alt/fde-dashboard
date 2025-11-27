'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { Play, Square, Maximize2, Minimize2 } from 'lucide-react'
import '@xterm/xterm/css/xterm.css'

interface TerminalProps {
  selectedCommand: string | null
}

export default function Terminal({ selectedCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentInput, setCurrentInput] = useState('')

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    // ターミナルの初期化
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e293b',
        foreground: '#e2e8f0',
        cursor: '#60a5fa',
        black: '#1e293b',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#f1f5f9',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f8fafc'
      },
      rows: 20
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    terminal.open(terminalRef.current)
    fitAddon.fit()

    // Welcome message
    terminal.writeln('\x1b[1;32m╔══════════════════════════════════════════╗\x1b[0m')
    terminal.writeln('\x1b[1;32m║     FDE Dashboard Terminal v1.0          ║\x1b[0m')
    terminal.writeln('\x1b[1;32m╚══════════════════════════════════════════╝\x1b[0m')
    terminal.writeln('')
    terminal.writeln('✨ コマンドを選択するか、直接入力してください')
    terminal.writeln('💡 Tip: 上のボタンからコマンドを選ぶと自動実行されます')
    terminal.writeln('')
    terminal.write('\x1b[1;36m$\x1b[0m ')

    // 入力処理
    let input = ''
    terminal.onData((data) => {
      const code = data.charCodeAt(0)

      if (code === 13) {
        // Enter
        terminal.writeln('')
        if (input.trim()) {
          executeCommand(input.trim(), terminal)
        }
        input = ''
        terminal.write('\x1b[1;36m$\x1b[0m ')
      } else if (code === 127) {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (code >= 32) {
        // 通常の文字
        input += data
        terminal.write(data)
      }
      setCurrentInput(input)
    })

    xtermRef.current = terminal
    fitAddonRef.current = fitAddon

    // Resize handling
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  // コマンド実行
  const executeCommand = async (command: string, terminal: XTerm) => {
    setIsRunning(true)

    try {
      // APIエンドポイントにコマンドを送信
      terminal.writeln(`\x1b[1;33m⚙️  Executing: ${command}\x1b[0m`)

      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })

      if (!response.ok) {
        terminal.writeln(`\x1b[1;31m❌ Error: ${response.statusText}\x1b[0m`)
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          terminal.write(text)
        }
      }

      terminal.writeln('')
      terminal.writeln('\x1b[1;32m✅ Command completed\x1b[0m')
    } catch (error) {
      terminal.writeln(`\x1b[1;31m❌ Error: ${error}\x1b[0m`)
    } finally {
      setIsRunning(false)
    }
  }

  // 選択されたコマンドの実行
  useEffect(() => {
    if (selectedCommand && xtermRef.current) {
      const terminal = xtermRef.current
      terminal.writeln('')
      terminal.writeln(`\x1b[1;35m🚀 Running: ${selectedCommand}\x1b[0m`)
      terminal.writeln('')

      // コマンドに応じた説明を表示
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

      terminal.writeln(commandDescriptions[selectedCommand] || '')
      terminal.writeln('\x1b[2mこの機能は開発中です。完全実装をお待ちください。\x1b[0m')
      terminal.writeln('')
      terminal.write('\x1b[1;36m$\x1b[0m ')
    }
  }, [selectedCommand])

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
      <div
        ref={terminalRef}
        className="p-2"
        style={{ height: isExpanded ? 'calc(100% - 42px)' : '400px' }}
      />
    </div>
  )
}
