import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const LandingPage: React.FC = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const dummyUserData = {
    privateKey: "0x1234...abcd",
    walletAddress: "0xABCD...5678",
    tokenPortfolio: "$10,000 USD",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-500">
            Synerga
          </Link>
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              onMouseEnter={() => setShowProfileDetails(true)}
              onMouseLeave={() => setShowProfileDetails(false)}
            >
              <User className="w-6 h-6 text-gray-400" />
            </button>
            {showProfileDetails && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 z-10">
                <h3 className="font-semibold text-lg text-green-400 mb-2">User Profile</h3>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Private Key:</span> {dummyUserData.privateKey}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">Wallet:</span> {dummyUserData.walletAddress}
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  <span className="font-medium">Token Portfolio:</span> {dummyUserData.tokenPortfolio}
                </p>
                <button className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors duration-200">
                  Remove Account
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
  className="bg-cover bg-center bg-no-repeat py-20"
  style={{
    backgroundImage: ('/blockchain.jpg'), // Ensure the image is in the public folder
  }}
>
  <div className="container mx-auto px-4 text-center bg-gray-900 bg-opacity-70 py-12 rounded-lg">
    <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
      Welcome to Synerga
    </h1>
    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
      Your AI-powered blockchain bot tool for all your blockchain-related queries and insights.Transfer Funds and draft Smart Contracts Securely, and Easily!
    </p>
    <Link
      to="/Chatbot"
      className="inline-block rounded-md bg-green-500 px-8 py-3 text-lg font-medium text-gray-900 hover:bg-green-400 transition-colors duration-200"
    >
      Get Started
    </Link>
  </div>
</section>
      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-12">What Synerga Can Do</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Understand User Queries",
                description: "Answers blockchain-related questions and provides step-by-step guides for common tasks.",
                icon: "💬",
              },
              {
                title: "Identity Verification Simulation",
                description: "Simulates real-world KYC processes by allowing users to upload dummy ID documents.",
                icon: "🆔",
              },
              {
                title: " Blockchain Transactions",
                description: "Users can input wallet addresses and amounts to simulate transactions.",
                icon: "💸",
              },
              {
                title: "Smart Contract Generator",
                description: "Generates a Solidity smart contract based on user-provided parameters.",
                icon: "📄",
              },
              {
                title: "Token Portfolio Management",
                description: "Create and manage a token portfolio with simulated buying and selling.",
                icon: "📊",
              },
              {
                title: "Educational Features",
                description: "Learn about blockchain security, wallet safety, and risk management.",
                icon: "🎓",
              },
              {
                title: "Simulated Security Practices",
                description: "Experience mock two-factor authentication and wallet validation workflows.",
                icon: "🔒",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-green-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Ready to explore the blockchain world?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Leverage BlockchainGPT to simplify your blockchain journey and make informed decisions.
          </p>
          <Link
            to="/input"
            className="inline-block rounded-md bg-gray-900 px-8 py-3 text-lg font-medium text-green-400 hover:bg-gray-800 transition-colors duration-200"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Synerga. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;