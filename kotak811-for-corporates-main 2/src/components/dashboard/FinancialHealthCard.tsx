import React from "react";

interface FinancialHealthCardProps {
  score: number;
  salary: number;
  tenure: number;
}

export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({ score, salary, tenure }) => {
  const getScoreColor = (score: number) => {
    // Keep semantic colors (green/yellow/red) for health, independent of brand
    if (score >= 80) return { from: 'from-green-400', to: 'to-emerald-500', text: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200' };
    if (score >= 60) return { from: 'from-yellow-400', to: 'to-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' };
    return { from: 'from-red-400', to: 'to-pink-500', text: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[hsl(var(--primary))]/5 dark:from-gray-800 dark:to-gray-800/50 border border-primary/20 dark:border-gray-700 p-6">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent rounded-bl-full opacity-30"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-2 h-2 ${colors.bg} ${colors.text} rounded-full`}></div>
              <span className="text-sm font-medium text-muted-foreground">Financial Health</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className={`text-5xl font-bold bg-gradient-to-r ${colors.from} ${colors.to} bg-clip-text text-transparent`}>
                {score}
              </span>
              <div>
                <p className="text-lg text-muted-foreground">/ 100</p>
                <p className={`text-sm font-semibold ${colors.text}`}>{getScoreLabel(score)}</p>
              </div>
            </div>
          </div>

          {/* Score Ring */}
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                strokeLinecap="round"
                className={`${colors.text}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{score}%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-muted-foreground mb-1">Annual Salary</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(salary / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-muted-foreground mb-1">Work Tenure</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{tenure} years</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-[hsl(var(--primary))]/8 to-[hsl(var(--primary))]/16 dark:from-primary/20 dark:to-primary/40 rounded-xl p-3 border border-primary/20 dark:border-primary/60">
          <p className="text-xs font-semibold text-primary mb-2">🎯 Your Benefits</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-xs font-medium">
              Pre-approved loans
            </span>
            <span className="px-2 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-xs font-medium">
              Premium cards
            </span>
            <span className="px-2 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-xs font-medium">
              Higher FD rates
            </span>
            <span className="px-2 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-xs font-medium">
              Zero-fee insurance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
