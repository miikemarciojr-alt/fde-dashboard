import { LucideIcon } from 'lucide-react'

interface CommandButtonProps {
  command: {
    id: string
    name: string
    description: string
    icon: LucideIcon
    color: string
    estimatedTime: string
  }
  onClick: () => void
  isSelected: boolean
}

export default function CommandButton({ command, onClick, isSelected }: CommandButtonProps) {
  const Icon = command.icon

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border-2 transition-all duration-200
        ${isSelected
          ? 'border-white shadow-lg shadow-white/20 scale-105'
          : 'border-gray-700 hover:border-gray-600 hover:scale-102'
        }
        bg-gray-800/50 backdrop-blur-sm p-4 text-left
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`${command.color} p-2 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{command.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{command.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">⏱️ {command.estimatedTime}</span>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </button>
  )
}
