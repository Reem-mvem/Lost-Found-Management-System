import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Settings } from 'lucide-react';
import { openAIService, ChatMessage } from '../utils/openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const UserClaim: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you find your lost item. What did you lose today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const extractItemDataFromConversation = (history: ChatMessage[]) => {
    // Simple extraction based on conversation context
    // In a real implementation, you might use more sophisticated NLP
    const conversationText = history.filter(m => m.role === 'user').map(m => m.content).join(' ');
    
    return {
      type: extractFromText(conversationText, ['phone', 'wallet', 'keys', 'bag', 'laptop', 'watch', 'glasses']) || 'Item',
      color: extractFromText(conversationText, ['black', 'white', 'red', 'blue', 'green', 'yellow', 'brown', 'silver', 'gold']) || 'Unknown',
      brand: extractFromText(conversationText, ['apple', 'samsung', 'nike', 'adidas', 'coach', 'michael kors']) || 'Unknown',
      location: extractLocation(conversationText) || 'Unknown location',
      description: conversationText.slice(0, 200),
      contactName: extractFromText(conversationText, [], /my name is ([a-zA-Z\s]+)/i) || 'User',
      contactEmail: extractFromText(conversationText, [], /[\w\.-]+@[\w\.-]+\.\w+/) || 'user@example.com',
      contactPhone: extractFromText(conversationText, [], /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/) || '555-0123'
    };
  };

  const extractFromText = (text: string, keywords: string[], regex?: RegExp): string => {
    if (regex) {
      const match = text.match(regex);
      return match ? match[1] || match[0] : '';
    }
    
    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return keyword;
      }
    }
    return '';
  };

  const extractLocation = (text: string): string => {
    const locationKeywords = ['library', 'cafeteria', 'gym', 'classroom', 'parking', 'lobby', 'bathroom', 'office'];
    return extractFromText(text, locationKeywords) || 'Campus area';
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    addMessage(currentMessage, 'user');
    
    // Update conversation history
    const newHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: currentMessage }
    ];
    setConversationHistory(newHistory);

    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await openAIService.sendMessage(newHistory);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage(aiResponse, 'bot');
        
        // Update conversation history with AI response
        setConversationHistory([
          ...newHistory,
          { role: 'assistant' as const, content: aiResponse }
        ]);

        // Check if AI indicates conversation is complete
        if (aiResponse.toLowerCase().includes('tracking number') || 
            aiResponse.toLowerCase().includes('submitted your') || 
            aiResponse.toLowerCase().includes('report has been') ||
            aiResponse.toLowerCase().includes('claim has been submitted')) {
          // Extract information for processing
          const extractedData = extractItemDataFromConversation(newHistory);
          setTimeout(() => {
            processClaim(extractedData);
          }, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      addMessage("I apologize, but I'm having trouble responding right now. Please try again.", 'bot');
    }
  };

  const processClaim = (data: any) => {
    // Create a claim
    const trackingNumber = 'LF' + Date.now().toString().slice(-6);
    const claim = {
      id: Date.now().toString(),
      itemId: '', // Will be matched by AI in real implementation
      userDescription: `${data.type} - ${data.color} - ${data.brand} - Lost at: ${data.location} - Details: ${data.description}`,
      contactInfo: `${data.contactName} - ${data.contactEmail} - ${data.contactPhone}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      trackingNumber
    };

    // Save to localStorage (in production, this would be an API call)
    const existingClaims = JSON.parse(localStorage.getItem('claims') || '[]');
    existingClaims.push(claim);
    localStorage.setItem('claims', JSON.stringify(existingClaims));

    addMessage(
      `Perfect! I've created your claim with tracking number ${trackingNumber}. I'm now searching our database for matches. You'll be redirected to your confirmation page where you can track your claim status.`,
      'bot'
    );

    // Redirect to confirmation page after a delay
    setTimeout(() => {
      navigate(`/claim-confirmation/${trackingNumber}`);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lost Item Assistant</h1>
              <p className="text-gray-600">Describe your lost item and we'll help you find it using AI</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  className="w-full resize-none border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={1}
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>

        {/* Conversation Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Status</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {conversationHistory.filter(m => m.role === 'user').length} messages exchanged
              </span>
            </div>
            {openAIService.isConfigured() && (
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">AI Powered</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserClaim;