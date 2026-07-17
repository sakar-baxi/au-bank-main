import React from "react";
import { CheckCircle2, Zap, Clock } from "lucide-react";

interface AIHeroSectionProps {
  userName: string;
  onOpenChat: () => void;
  onNavigate?: (page: 'dashboard' | 'orders' | 'agent') => void;
}

export const AIHeroSection: React.FC<AIHeroSectionProps> = ({ userName, onOpenChat, onNavigate }) => {
  const benefits = [
    { text: "Lifetime Zero Balance", sub: "No maintenance charges" },
    { text: "Up to 5.75%* Interest", sub: "With ActivMoney auto-sweep" },
    { text: "Free Virtual Debit Card", sub: "Instant generation" }
  ];

  return (
    <div className="relative overflow-hidden rounded-xl bg-black border border-gray-800 p-8 shadow-2xl">
      {/* Subtle Red Accents/Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* Top Section: Header, CTA, Visual */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-gray-400 font-medium flex items-center gap-2">
                Welcome back, {userName.split(' ')[0]} 👋
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Upgrade to your <span className="text-red-500">Salary Account</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Experience the power of zero-balance banking with premium corporate privileges.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <button
                onClick={() => onNavigate ? onNavigate('agent') : onOpenChat()}
                className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-red-900/20"
              >
                Open Account Now
                <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Takes only 5 mins</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Tilted 3D Card Effect */}
          <div className="hidden md:block relative w-56 h-32 flex-shrink-0 mr-4 mt-2">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-700 flex flex-col justify-between p-4 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 group cursor-pointer origin-bottom-right">
                <div className="flex justify-between items-start">
                  <div className="text-2xl font-bold text-white">811</div>
                  <div className="w-6 h-4 rounded bg-yellow-500/20 border border-yellow-500/50"></div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-mono mb-1">•••• •••• •••• 8110</div>
                  <div className="text-xs text-red-500 uppercase tracking-wider font-bold">Salary</div>
                </div>
             </div>
             {/* Back card for depth */}
             <div className="absolute inset-0 bg-red-900/20 rounded-xl transform rotate-12 -z-10 scale-95 translate-y-2"></div>
          </div>
        </div>

        {/* Bottom Section: Benefits Strip */}
        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className="bg-gray-900 p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-200">{benefit.text}</div>
                  <div className="text-sm text-gray-500">{benefit.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
