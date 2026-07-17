import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, PiggyBank, Home, LineChart, Gem, MessageSquare } from "lucide-react";

interface Message {
  type: 'user' | 'agent' | 'thinking';
  text: string;
  steps?: string[];
  result?: {
    title: string;
    value: string;
    details: string[];
  };
}

interface AIAgentSidebarProps {
  userName: string;
  salary: number;
  tenure: number;
  score: number;
}

export const AIAgentSidebar: React.FC<AIAgentSidebarProps> = ({ userName, salary, tenure, score }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const smartActions = [
    {
      Icon: PiggyBank,
      question: 'What interest rate for personal loan?',
      shortLabel: 'Loan Interest Rate',
      agenticResponse: {
        thinking: [
          '🔍 Accessing your financial profile...',
          '📊 Health score detected: 78/100 (Good)',
          '💰 Annual income verified: ₹8.5L',
          '📅 Employment tenure: 3.5 years',
          '🏦 Checking Kotak811 rate database...',
          '🎯 Cross-referencing with employee benefits...',
          '✨ Calculating personalized rate...'
        ],
        result: {
          title: 'Personal Loan Rate',
          value: '10.5% p.a.',
          details: [
            '💵 Pre-approved amount: ₹15L',
            '📅 Flexible tenure: Up to 5 years',
            '🎁 Processing fee: ₹0 (Waived)',
            '✅ Zero collateral required',
            '⚡ Instant disbursal in 24 hours'
          ]
        }
      }
    },
    {
      Icon: Home,
      question: 'Am I eligible for home loan?',
      shortLabel: 'Home Loan Check',
      agenticResponse: {
        thinking: [
          '🏠 Analyzing home loan eligibility...',
          '💼 Income assessment: ₹8.5L/year',
          '📈 Credit score verification in progress...',
          '🧮 Calculating EMI capacity (40% of income)...',
          '🎯 Max loan amount: ₹50L approved',
          '🏆 Special corporate rate detected',
          '✅ Final eligibility confirmed'
        ],
        result: {
          title: 'Home Loan Eligibility',
          value: 'Yes! Up to ₹50L',
          details: [
            '💎 Interest rate: 8.25% p.a. (Corporate)',
            '📅 Max tenure: 20 years',
            '💰 EMI: ₹34,200/month approx',
            '🎁 Processing fee waived',
            '💸 Tax benefits: Save up to ₹3.5L/year'
          ]
        }
      }
    },
    {
      Icon: LineChart,
      question: 'How to save maximum tax?',
      shortLabel: 'Tax Optimization',
      agenticResponse: {
        thinking: [
          '📊 Analyzing tax bracket for ₹8.5L income...',
          '💰 Current liability: 30% tax slab',
          '🔍 Scanning all available deductions...',
          '💎 80C: ₹1.5L available',
          '🏥 80D: Health insurance ₹25k',
          '🎯 NPS 80CCD(1B): ₹50k extra',
          '📈 Optimizing investment mix...',
          '✨ Total tax saving calculated'
        ],
        result: {
          title: 'Tax Optimization Plan',
          value: 'Save ₹1.56L',
          details: [
            '📈 80C: ELSS Mutual Funds ₹1.5L',
            '🏥 80D: Health insurance ₹25k',
            '💼 80CCD(1B): NPS ₹50k',
            '🏠 Home loan interest: Extra benefit',
            '💰 Total tax saved: ₹1.56L'
          ]
        }
      }
    },
    {
      Icon: Gem,
      question: 'Best investment for 1 year?',
      shortLabel: 'Investment Advice',
      agenticResponse: {
        thinking: [
          '📊 Analyzing current market conditions...',
          '🎯 Assessing your risk profile: Moderate',
          '💹 Comparing FD vs Debt Funds vs Liquid Funds...',
          '🏦 Kotak811 FD rate: 7.5% p.a.',
          '📈 Debt funds: 6-8% returns',
          '💰 Factoring in liquidity needs...',
          '✅ Best option identified'
        ],
        result: {
          title: 'Best 1-Year Investment',
          value: 'Fixed Deposit @ 7.5%',
          details: [
            '💰 Returns: ₹7,500 per ₹1L',
            '🛡️ Zero risk, fully guaranteed',
            '🎁 Tax-saving FD option available',
            '⚡ Premature withdrawal allowed',
            '📊 Better than savings account (3.5%)'
          ]
        }
      }
    }
  ];

  const handleSmartAction = async (action: typeof smartActions[0]) => {
    // Add user question
    setMessages(prev => [...prev, { type: 'user', text: action.question }]);
    setIsThinking(true);

    // Simulate thinking process
    const thinkingSteps = action.agenticResponse.thinking;
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking');
        return [...filtered, { 
          type: 'thinking', 
          text: thinkingSteps[i],
          steps: thinkingSteps.slice(0, i + 1)
        }];
      });
    }

    // Show final result
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsThinking(false);
    setMessages(prev => {
      const filtered = prev.filter(m => m.type !== 'thinking');
      return [...filtered, { 
        type: 'agent', 
        text: `Based on your profile, here's what I found:`,
        result: action.agenticResponse.result
      }];
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
    setInputValue('');

    // Simulate thinking for custom questions
    setIsThinking(true);
    const thinkingSteps = [
      '🔍 Understanding your question...',
      '📊 Analyzing your financial profile...',
      '💡 Searching knowledge base...',
      '✨ Preparing personalized answer...'
    ];

    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking');
        return [...filtered, { 
          type: 'thinking', 
          text: thinkingSteps[i],
          steps: thinkingSteps.slice(0, i + 1)
        }];
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsThinking(false);
    
    setMessages(prev => {
      const filtered = prev.filter(m => m.type !== 'thinking');
      return [...filtered, { 
        type: 'agent', 
        text: "Based on your profile (Salary: ₹8.5L, Tenure: 3.5y, Score: 78), I can provide personalized financial guidance. Try the smart action buttons above for instant detailed analysis, or ask me specific questions about loans, investments, insurance, or tax planning!" 
      }];
    });
  };

  const stripEmoji = (s: string) => s.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();

  return (
    <div className="sticky top-24 h-[calc(100vh-7rem)]">
      {/* Single Unified Agent Card */}
      <Card className="h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        {/* Agent Header - Integrated into card */}
        <div className="bg-primary text-white p-5 border-b border-primary/80">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">FinAgent</h3>
              <p className="text-xs text-primary/20">Your AI Financial Agent</p>
            </div>
          </div>
        </div>

        {/* Smart Actions - Integrated */}
        {messages.length === 0 && (
          <div className="p-4 bg-gray-50 dark:from-gray-800/50 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Try these smart actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {smartActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSmartAction(action as any)}
                  className="group bg-white dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-gray-700 rounded-lg p-3 text-left transition-all border border-gray-200 dark:border-gray-700 hover:border-primary/70 shadow-sm"
                >
                  <div className="mb-1">
                    {(action as any).Icon ? (
                      <(action as any).Icon className="w-4 h-4 text-gray-500" />
                    ) : null}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                    {action.shortLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages - Integrated */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-6">
                  Hi {userName.split(' ')[0]}! I'm FinAgent, your AI-powered financial advisor.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 rounded-xl px-3 py-2 text-xs shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )}

                {msg.type === 'thinking' && msg.steps && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] bg-primary/5 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-primary/20 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary">Thinking...</span>
                      </div>
                      {msg.steps.map((step, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{stripEmoji(step)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === 'agent' && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%]">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                        {msg.text}
                      </div>
                      {msg.result && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 shadow-sm">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{msg.result.title}</span>
                            <span className="text-lg font-bold text-green-700 dark:text-green-400">{msg.result.value}</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.result.details.map((detail, i) => (
                              <div key={i} className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300">
                                <svg className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{stripEmoji(detail)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Input - Integrated at bottom */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask FinAgent anything..."
              className="flex-1 text-sm bg-white dark:bg-gray-800"
              disabled={isThinking}
            />
            <Button 
              onClick={handleSend} 
              size="sm"
              disabled={!inputValue.trim() || isThinking}
              className="shrink-0"
              variant="secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
