'use client'

import { Eye, Rocket, Clock } from 'lucide-react'

export default function ProjectList() {
  // TODO: これは後でAPIから取得する
  const projects = [
    {
      id: '1',
      name: 'my-faq-demo',
      type: 'FAQ Demo',
      createdAt: '1時間前',
      status: 'deployed',
      url: 'https://my-faq-demo.vercel.app'
    },
    {
      id: '2',
      name: 'dashboard-demo',
      type: 'Dashboard',
      createdAt: '昨日',
      status: 'deployed',
      url: 'https://dashboard-demo.vercel.app'
    },
    {
      id: '3',
      name: 'quick-prototype',
      type: 'Quick Demo',
      createdAt: '2日前',
      status: 'local',
      url: null
    }
  ]

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
      <div className="divide-y divide-gray-700">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{project.createdAt}</span>
                    </span>
                    <span>•</span>
                    <span>{project.type}</span>
                    {project.status === 'deployed' && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Deployed</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                {project.status === 'deployed' && project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Open</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
