import React from "react";
import { Card } from "@/components/ui/card";

interface CompactHealthScoreProps {
  score: number;
  salary: number;
  tenure: number;
}

export const CompactHealthScore: React.FC<CompactHealthScoreProps> = ({ score, salary, tenure }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50 border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Financial Health</p>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(score)}</p>
        </div>
        
        <div className="text-right space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-semibold">₹{(salary / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tenure</p>
            <p className="text-sm font-semibold">{tenure}y</p>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  );
};