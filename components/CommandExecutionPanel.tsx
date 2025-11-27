'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'

interface ExecutionStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'error'
  startTime?: Date
  endTime?: Date
  output?: string
}

interface CommandExecutionPanelProps {
  commandId: string | null
  commandName: string
}

export default function CommandExecutionPanel({ commandId, commandName }: CommandExecutionPanelProps) {
  const [steps, setSteps] = useState<ExecutionStep[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (commandId) {
      startExecution(commandId)
    }
  }, [commandId])

  const startExecution = async (cmdId: string) => {
    setIsExecuting(true)
    setCurrentStepIndex(0)

    // コマンドに応じたステップを定義
    const commandSteps: Record<string, ExecutionStep[]> = {
      'demo-faq': [
        { id: '1', label: 'Next.jsプロジェクトを初期化中...', status: 'pending' },
        { id: '2', label: 'FAQ検索コンポーネントを作成中...', status: 'pending' },
        { id: '3', label: 'サンプルデータを生成中...', status: 'pending' },
        { id: '4', label: 'スタイルを適用中...', status: 'pending' },
        { id: '5', label: '動作確認中...', status: 'pending' }
      ],
      'demo-dashboard': [
        { id: '1', label: 'Next.jsプロジェクトを初期化中...', status: 'pending' },
        { id: '2', label: 'ダッシュボードレイアウトを作成中...', status: 'pending' },
        { id: '3', label: 'グラフコンポーネントをインストール中...', status: 'pending' },
        { id: '4', label: 'データ可視化を実装中...', status: 'pending' },
        { id: '5', label: '動作確認中...', status: 'pending' }
      ],
      'demo-quick': [
        { id: '1', label: '要件を分析中...', status: 'pending' },
        { id: '2', label: '最適な技術スタックを選択中...', status: 'pending' },
        { id: '3', label: 'プロジェクトを生成中...', status: 'pending' },
        { id: '4', label: 'コア機能を実装中...', status: 'pending' },
        { id: '5', label: 'デプロイ準備中...', status: 'pending' }
      ],
      'deploy-vercel': [
        { id: '1', label: 'プロジェクトをビルド中...', status: 'pending' },
        { id: '2', label: 'Vercelに接続中...', status: 'pending' },
        { id: '3', label: 'デプロイ実行中...', status: 'pending' },
        { id: '4', label: 'URL生成中...', status: 'pending' }
      ]
    }

    const initialSteps = commandSteps[cmdId] || [
      { id: '1', label: '処理を開始中...', status: 'pending' },
      { id: '2', label: '実行中...', status: 'pending' }
    ]

    setSteps(initialSteps)

    // ステップを順次実行（シミュレーション）
    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStepIndex(i)

      // ステップを実行中に
      setSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: 'running', startTime: new Date() } : step
      ))

      // ランダムな実行時間（1-3秒）
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      // ステップを完了に
      setSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: 'completed', endTime: new Date() } : step
      ))
    }

    setIsExecuting(false)
  }

  if (!commandId) return null

  const completedSteps = steps.filter(s => s.status === 'completed').length
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isExecuting ? 'bg-blue-100' : 'bg-green-100'}
          `}>
            {isExecuting ? (
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {commandName}
            </h3>
            <p className="text-sm text-gray-500">
              {isExecuting ? '実行中...' : '完了しました！'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</div>
          <div className="text-xs text-gray-500">{completedSteps}/{totalSteps} ステップ</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.status === 'completed' ? CheckCircle :
                      step.status === 'running' ? Loader2 :
                      step.status === 'error' ? XCircle : Clock

          return (
            <div
              key={step.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all
                ${step.status === 'running' ? 'bg-blue-50 border-2 border-blue-200' : ''}
                ${step.status === 'completed' ? 'bg-green-50' : ''}
                ${step.status === 'pending' ? 'opacity-50' : ''}
              `}
            >
              <Icon className={`
                w-5 h-5 flex-shrink-0
                ${step.status === 'completed' ? 'text-green-600' : ''}
                ${step.status === 'running' ? 'text-blue-600 animate-spin' : ''}
                ${step.status === 'error' ? 'text-red-600' : ''}
                ${step.status === 'pending' ? 'text-gray-400' : ''}
              `} />
              <span className={`
                flex-1 text-sm font-medium
                ${step.status === 'completed' ? 'text-green-700' : ''}
                ${step.status === 'running' ? 'text-blue-700' : ''}
                ${step.status === 'pending' ? 'text-gray-500' : ''}
              `}>
                {step.label}
              </span>
              {step.status === 'running' && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Message */}
      {!isExecuting && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                デモの作成が完了しました！
              </p>
              <p className="text-xs text-green-700 mt-1">
                ターミナルで確認するか、Vercelにデプロイしてください。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
