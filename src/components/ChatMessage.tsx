import React from 'react'
import { Message } from '../types'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isCode = message.text.startsWith('```solidity') && message.text.endsWith('```')

  if (isCode) {
    const code = message.text.slice(11, -3).trim() // Remove ```solidity and ``` wrapper
    return (
      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-3/4 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          <SyntaxHighlighter language="solidity" style={docco}>
            {code}
          </SyntaxHighlighter>
          <button
            onClick={() => {
              const blob = new Blob([code], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'smart_contract.sol'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download .sol file
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3/4 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        {message.text}
      </div>
    </div>
  )
}

export default ChatMessage

