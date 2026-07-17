import React from "react";

interface FinancialHealthScoreProps {
  score: number; // 0-100
  salary: number;
  tenure: number;
}

export const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ score, salary, tenure }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Your Financial Health
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="80"
                cy="80"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{getScoreLabel(score)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Salary</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(salary / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tenure</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenure} years
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Eligible Benefits</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                Pre-approved loans
              </span>
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                Premium credit cards
              </span>
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                Higher FD rates
              </span>
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                Zero-fee insurance
              </span>
            </div>
          </div>

            <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Want to improve your score?</span>
            <button className="text-primary dark:text-primary/80 hover:underline font-medium">
              Get recommendations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
