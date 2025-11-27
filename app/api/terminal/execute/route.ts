import { NextRequest } from 'next/server'
import { exec } from 'child_process'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { command, cwd } = await request.json()

    if (!command) {
      return new Response('Command is required', { status: 400 })
    }

    // 作業ディレクトリ
    const workingDir = cwd || process.env.FDE_WORKSPACE_PATH || '/Users/miikemarciojunior/Desktop/FDE-Workspace'

    // ストリーミングレスポンスを作成
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // コマンドを実行（shellモードでパイプや&&などをサポート）
        const proc = exec(command, {
          cwd: workingDir,
          maxBuffer: 1024 * 1024 * 10, // 10MB
          env: { ...process.env, FORCE_COLOR: '1' }
        })

        // stdout
        proc.stdout.on('data', (data) => {
          controller.enqueue(encoder.encode(data.toString()))
        })

        // stderr
        proc.stderr.on('data', (data) => {
          controller.enqueue(encoder.encode(`\x1b[31m${data.toString()}\x1b[0m`))
        })

        // 終了時
        proc.on('close', (code) => {
          if (code !== 0) {
            controller.enqueue(
              encoder.encode(`\n\x1b[31mProcess exited with code ${code}\x1b[0m\n`)
            )
          }
          controller.close()
        })

        // エラー時
        proc.on('error', (error) => {
          controller.enqueue(
            encoder.encode(`\n\x1b[31mError: ${error.message}\x1b[0m\n`)
          )
          controller.close()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    })
  } catch (error) {
    console.error('Terminal execution error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
