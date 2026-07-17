import React from "react";
import { Car, Globe, Home, GraduationCap, PiggyBank, Lightbulb } from "lucide-react";

export const GoalJourneys: React.FC = () => {
  const activeGoals = [
    {
      id: 1,
      icon: Car,
      title: 'Buy a Car',
      target: '₹8L',
      current: '₹2.3L',
      progress: 29,
      timeline: '14 months',
      status: 'On track',
      statusColor: 'text-green-600',
      recommendations: [
        { type: 'Auto Loan', value: '₹5.7L pre-approved' },
        { type: 'RD Account', value: 'Save ₹15k/month' }
      ]
    },
    {
      id: 2,
      icon: Globe,
      title: 'Europe Trip',
      target: '₹3.5L',
      current: '₹1.8L',
      progress: 51,
      timeline: '8 months',
      status: 'Ahead',
      statusColor: 'text-blue-600',
      recommendations: [
        { type: 'Travel Card', value: 'Zero forex fees' },
        { type: 'Travel Insurance', value: '₹999 only' }
      ]
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Journeys</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your financial goals</p>
        </div>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {activeGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#ff0049]/10 transition-colors">
                    <goal.icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#ff0049]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{goal.title}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{goal.timeline} remaining</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700 ${goal.statusColor}`}>
                    {goal.status}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                   <div>
                     <span className="text-2xl font-bold text-gray-900 dark:text-white">{goal.current}</span>
                     <span className="text-xs text-gray-500 ml-1">of {goal.target}</span>
                   </div>
                   <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              
              <button className="w-full py-2 flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-white hover:bg-[#222222] dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Lightbulb className="w-4 h-4" />
                  <span>View Recommendations</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
