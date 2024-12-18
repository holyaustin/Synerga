import React, { useState, useEffect, useCallback } from 'react'
import { generateTextWithGemini } from './geminiApi'
import { ChevronDown } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

interface KYCDocument {
  type: string
  status: 'pending' | 'verified' | 'rejected'
}

interface SmartContractDetails {
  name: string
  symbol: string
  totalSupply: string
  features: string[]
}

interface TransactionDetails {
  receiverId: string
  amount: string
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
}

interface SecurityHistory {
  transactions: string[];
  privateKeys: string[];
}

const WELCOME_MESSAGE = `Welcome to BlockBot! 🔗

I'm your blockchain and cryptocurrency expert. I can help you with:
- Generating and explaining smart contracts in Solidity
- Clarifying blockchain concepts and terminology
- Guiding you through blockchain transactions
- Assisting with crypto portfolio management
- Answering questions about blockchain technology and cryptocurrencies
- Completing KYC verification process
- Transferring funds securely

What would you like to know about blockchain technology?`

const BLOCKCHAIN_TOPICS = [
  'Smart Contracts',
  'Consensus Mechanisms',
  'Cryptocurrencies',
  'DeFi',
  'NFTs',
  'Blockchain Scalability',
  'Tokenomics',
  'Crypto Wallets',
  'Mining and Staking',
  'Blockchain Use Cases',
  'Start KYC',
  'Transfer Funds'
] as const

const KYC_DOCUMENTS = [
  'Government-issued ID',
  'Proof of address',
  'Selfie with ID'
]

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: WELCOME_MESSAGE,
      role: 'assistant'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [kycStep, setKycStep] = useState(0)
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([])
  const [transferStep, setTransferStep] = useState(0)
  const [transferDetails, setTransferDetails] = useState<TransactionDetails>({
    receiverId: '',
    amount: '',
    timestamp: 0,
    status: 'pending'
  })
  const [smartContractStep, setSmartContractStep] = useState(0)
  const [smartContractDetails, setSmartContractDetails] = useState<SmartContractDetails>({
    name: '',
    symbol: '',
    totalSupply: '',
    features: []
  })
  const [showSecurityDropdown, setShowSecurityDropdown] = useState(false)
  const [securityHistory] = useState<SecurityHistory>({
    transactions: [
      'Tx1: 0x123...abc - 1.5 ETH sent',
      'Tx2: 0x456...def - 0.5 BTC received',
      'Tx3: 0x789...ghi - 1000 USDT transferred',
    ],
    privateKeys: [
      '0xabcd...1234 (expired)',
      '0xefgh...5678 (active)',
      '0xijkl...9012 (revoked)',
    ],
  });
  

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement> | null, topic?: string) => {
    e?.preventDefault()
    const userInput = topic || input.trim()
    if ((!userInput && !topic) || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: userInput,
      role: 'user' as const
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateResponse(userInput)

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant' as const
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setSelectedTopic(null)
    }
  }, [input, isLoading])

  useEffect(() => {
    if (selectedTopic) {
      handleSubmit(null, selectedTopic)
    }
  }, [selectedTopic, handleSubmit])

  const generateResponse = async (input: string): Promise<string> => {
    const lowercaseInput = input.toLowerCase()

    if (lowercaseInput.includes('kyc') || kycStep > 0) {
      return handleKYCProcess(lowercaseInput)
    } else if (lowercaseInput.includes('smart contract') || smartContractStep > 0) {
      return await handleSmartContractQuery(lowercaseInput)
    } else if (lowercaseInput.includes('consensus')) {
      return handleConsensusQuery()
    } else if (lowercaseInput.includes('transfer funds') || transferStep > 0) {
      return await handleTransferFunds(lowercaseInput)
    } else {
      return await handleGeneralQuery(input)
    }
  }

  const handleKYCProcess = (input: string): string => {
    if (kycStep === 0) {
      setKycStep(1)
      return `Welcome to the KYC verification process. Please provide the following documents:

1. Government-issued ID (passport or driver's license)
2. Proof of address (utility bill or bank statement)
3. Selfie with your ID

Click the "Upload Document" button to simulate uploading each document.`
    }

    if (input.startsWith('upload document')) {
      const fileName = input.split('upload document ')[1];
      const documentType = KYC_DOCUMENTS[kycDocuments.length]
      setKycDocuments(prev => [...prev, { type: documentType, status: 'pending' }])
      
      if (kycDocuments.length + 1 >= KYC_DOCUMENTS.length) {
        setKycStep(0)
        return `Thank you for submitting all required documents. Your KYC verification is complete!

Status: VERIFIED ✅

You can now proceed with using our platform's features.`
      }

      return `Document "${documentType}" (${fileName}) received. Please submit the remaining documents.
Currently submitted: ${kycDocuments.length + 1}/${KYC_DOCUMENTS.length} documents.`
    }

    return 'Please click the "Upload Document" button to submit your documents.'
  }

  const handleSmartContractQuery = async (input: string): Promise<string> => {
    if (smartContractStep === 0) {
      setSmartContractStep(1)
      return "Let's create a smart contract. What should be the name of your token?"
    }

    if (smartContractStep === 1) {
      setSmartContractDetails(prev => ({ ...prev, name: input }))
      setSmartContractStep(2)
      return "Great! Now, what should be the symbol of your token?"
    }

    if (smartContractStep === 2) {
      setSmartContractDetails(prev => ({ ...prev, symbol: input }))
      setSmartContractStep(3)
      return "Excellent. What should be the total supply of your token?"
    }

    if (smartContractStep === 3) {
      setSmartContractDetails(prev => ({ ...prev, totalSupply: input }))
      setSmartContractStep(4)
      return "Almost done. What features would you like to include? (e.g., mintable, burnable, pausable)"
    }

    if (smartContractStep === 4) {
      const contractFeatures = input.split(',').map(feature => feature.trim())
      setSmartContractDetails(prev => ({ ...prev, features: contractFeatures }))
      setSmartContractStep(0)

      const prompt = `Generate a Solidity smart contract for an ERC20 token with the following specifications:
        - Token Name: ${smartContractDetails.name}
        - Token Symbol: ${smartContractDetails.symbol}
        - Total Supply: ${smartContractDetails.totalSupply}
        - Features: ${contractFeatures.join(', ')}
        
        Provide the complete contract code and a brief explanation of its functionality.`

      try {
        const response = await generateTextWithGemini(prompt)
        return response
      } catch (error) {
        console.error('Error generating smart contract:', error)
        return "I apologize, but I encountered an error while generating the smart contract. Please try again with different specifications."
      }
    }

    return "An error occurred during the smart contract creation process. Please try again by selecting 'Smart Contracts'."
  }

  const handleConsensusQuery = (): string => {
    return `Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the validity of transactions. Popular mechanisms include:

1. Proof of Work (PoW)
2. Proof of Stake (PoS)
3. Delegated Proof of Stake (DPoS)

Would you like to learn more about any specific consensus mechanism?`
  }

  const handleTransferFunds = async (input: string): Promise<string> => {
    if (transferStep === 0) {
      setTransferStep(1)
      setTransferDetails(prev => ({ ...prev, status: 'pending' }))
      return "To transfer funds, please provide the receiver's ID:"
    }

    if (transferStep === 1) {
      setTransferDetails(prev => ({ ...prev, receiverId: input }))
      setTransferStep(2)
      return "Thank you. Now, please enter the amount you want to transfer:"
    }

    if (transferStep === 2) {
      setTransferDetails(prev => ({ ...prev, amount: input }))
      setTransferStep(3)
      const dummyPrivateKey = generateDummyPrivateKey()
      return `For security purposes, please confirm this transaction using the following private key:\n\n${dummyPrivateKey}\n\nPlease enter the private key to confirm the transaction:`
    }

    if (transferStep === 3) {
      const isValid = await verifyPrivateKey(input)
      setTransferStep(0)

      if (!isValid) {
        setTransferDetails(prev => ({ ...prev, status: 'failed' }))
        return "Invalid private key. Transaction cancelled for security reasons."
      }

      setTransferDetails(prev => ({
        ...prev,
        timestamp: Date.now(),
        status: 'completed'
      }))

      return `Transaction completed successfully!

Details:
- Receiver ID: ${transferDetails.receiverId}
- Amount: ${transferDetails.amount}
- Status: ✅ Completed
- Transaction ID: ${Date.now().toString(16)}
- Timestamp: ${new Date().toLocaleString()}

Your funds have been transferred securely.`
    }

    return "An error occurred during the transfer process. Please try again by selecting 'Transfer Funds'."
  }

  const handleGeneralQuery = async (input: string): Promise<string> => {
    const prompt = `As a blockchain expert, provide a detailed but concise response to this question about blockchain technology: "${input}". Focus on accuracy and clarity.`
    
    try {
      const response = await generateTextWithGemini(prompt)
      return response
    } catch (error) {
      console.error('Error getting Gemini response:', error)
      return "I apologize, but I encountered an error while processing your request. Please try again or select a specific blockchain topic."
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  const generateDummyPrivateKey = () => {
    const characters = '0123456789abcdef'
    let privateKey = '0x'
    for (let i = 0; i < 64; i++) {
      privateKey += characters[Math.floor(Math.random() * characters.length)]
    }
    return privateKey
  }

  const verifyPrivateKey = (privateKey: string) => {
    const isValidFormat = /^0x[0-9a-f]{64}$/i.test(privateKey)
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(isValidFormat)
      }, 1000)
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between gap-2 p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          <h1 className="font-semibold">BlockBot</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSecurityDropdown(!showSecurityDropdown)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Security
            <ChevronDown className="w-4 h-4" />
          </button>
          {showSecurityDropdown && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <h3 className="font-semibold mb-2">Transaction History</h3>
                  <ul className="list-disc list-inside">
                    {securityHistory.transactions.map((tx, index) => (
                      <li key={index} className="truncate">{tx}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="px-4 py-2 text-sm text-gray-700">
                  <h3 className="font-semibold mb-2">Private Keys Used</h3>
                  <ul className="list-disc list-inside">
                    {securityHistory.privateKeys.map((key, index) => (
                      <li key={index} className="truncate">{key}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t space-y-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {BLOCKCHAIN_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className="px-2 py-1 text-sm bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topic}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about blockchain, smart contracts, or crypto..."
            className="flex-1 min-h-[2.5rem] max-h-[10rem] p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ height: '40px' }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Send'}
          </button>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleSubmit(null, `upload document ${file.name}`);
              }
            }}
            className="hidden"
            id="file-upload"
          />
        </form>
        {kycStep > 0 && (
          <label
            htmlFor="file-upload"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer inline-block"
          >
            Upload Document
          </label>
        )}
      </div>
    </div>
  )
}

