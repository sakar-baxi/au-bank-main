import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Home, PiggyBank, LineChart } from "lucide-react";

interface AIAssistantProps {
  userName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userName, isExpanded, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant' as const,
      text: `Hi ${userName.split(' ')[0]}! I'm your AI Financial Advisor. I can help you plan for your goals, find the best financial products, and answer any questions about your benefits.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    { Icon: Car, label: 'Plan to buy a car', action: 'car' },
    { Icon: Home, label: 'Home loan planning', action: 'home' },
    { Icon: PiggyBank, label: 'Investment advice', action: 'invest' },
    { Icon: LineChart, label: 'Tax saving tips', action: 'tax' },
  ];

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      car: "I'd like to buy a car next year",
      home: "I'm planning to buy a home",
      invest: "I want investment suggestions",
      tax: "Help me save on taxes"
    };
    
    handleSendMessage(actionMessages[action]);
  };

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { type: 'user' as const, text }
    ];
    
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'car': "Great! Based on your salary of ₹8.5L/year, I recommend:\n\n1. Pre-approved Car Loan: Up to ₹12L at 8.5% interest\n2. Down payment savings: Start an auto-debit RD of ₹15k/month\n3. Insurance: Bundled car + personal accident coverage\n\nWould you like me to start your car loan application?",
        'home': "Excellent decision! Let me create a personalized home buying plan:\n\n1. Pre-approved Home Loan: Up to ₹40L at 8.25%\n2. Eligibility: Based on 3.5 years tenure\n3. Tax benefits: Save up to ₹3.5L/year\n\nShall we start with a quick eligibility check?",
        'invest': "Perfect timing! Here are personalized investment options:\n\n1. ELSS Mutual Funds: Tax-saving + wealth creation\n2. Fixed Deposits: 7.5% returns, fully secure\n3. Systematic Investment Plans: Start with ₹5k/month\n\nWhat's your investment goal and time horizon?",
        'tax': "I can help you save significantly!\n\nCurrent tax bracket: 30%\nPotential savings: Up to ₹1.5L\n\nRecommended:\n1. ELSS: ₹1.5L under 80C\n2. Health Insurance: ₹25k under 80D\n3. NPS: Additional ₹50k under 80CCD\n\nWant me to create a tax-saving plan?"
      };

      let responseText = "I understand you're interested in that! Let me analyze your profile and suggest the best options. Could you provide more details about your timeline and budget?";
      
      // Check for matching keywords
      Object.keys(responses).forEach(key => {
        if (text.toLowerCase().includes(key)) {
          responseText = responses[key];
        }
      });

      setMessages([...newMessages, { type: 'assistant' as const, text: responseText }]);
    }, 1000);
  };

  return (
          <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
      {/* Collapsed View */}
      {!isExpanded ? (
        <div className="p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Financial Advisor</h2>
                  <p className="text-blue-100">Your personalized financial companion</p>
                </div>
              </div>

              <p className="text-lg text-blue-50 mb-6">
                Hi {userName.split(' ')[0]}! I can help you achieve your financial goals. What would you like to do today?
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.action)}
                    className="bg-white/10 backdrop-blur hover:bg-white/20 rounded-xl p-4 text-left transition-all hover:scale-105"
                  >
                    <div className="mb-2">
                      <action.Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium">{action.label}</div>
                  </button>
                ))}
              </div>

              <Button 
                onClick={onToggle}
                className="bg-white text-primary hover:bg-blue-50"
              >
                Start Conversation →
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Chat View */
        <div className="flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="bg-white/10 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-white">
                <h3 className="font-semibold">AI Financial Advisor</h3>
                <p className="text-xs text-blue-100">Online · Powered by AI</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-white text-blue-900 rounded-br-sm'
                      : 'bg-white/10 backdrop-blur text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white/10 backdrop-blur border-t border-white/20 p-4">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your finances..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-white text-primary hover:bg-blue-50"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
