import React, { useState } from "react";
import { Package, Shield, LineChart, Banknote, CreditCard, Landmark, Coins } from "lucide-react";

export const ProductMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Products', Icon: Package },
    { id: 'deposits', label: 'Deposits', Icon: Coins },
    { id: 'cards', label: 'Cards', Icon: CreditCard },
    { id: 'loans', label: 'Loans', Icon: Banknote },
    { id: 'investments', label: 'Investments', Icon: LineChart },
    { id: 'insurance', label: 'Insurance', Icon: Shield },
  ];

  const products = [
    {
      id: 1,
      category: 'deposits',
      Icon: Landmark,
      name: 'Fixed & Recurring Deposits',
      description: 'Grow savings with high interest rates (up to 7.40% p.a.) or start small with systematic monthly investments.',
      rate: 'Up to 7.40% p.a.',
      badge: 'Secure',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    },
    {
      id: 3,
      category: 'cards',
      Icon: CreditCard,
      name: 'Kotak811 Credit Cards',
      description: 'Reward-focused credit cards with exclusive dining and travel offers.',
      rate: 'Lifetime Free Options',
      badge: 'Rewards',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    },
    {
      id: 4,
      category: 'loans',
      Icon: Banknote,
      name: 'Kotak811 Personal Loan',
      description: 'Quick personal loans with minimal documentation for your needs.',
      rate: 'Instant Approval',
      badge: 'Fast',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    },
    {
      id: 5,
      category: 'investments',
      Icon: LineChart,
      name: 'Open Demat Account',
      description: 'Seamless trading with Kotak Securities. Zero brokerage on intraday.',
      rate: 'Zero Brokerage',
      badge: 'Trading',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    },
    {
      id: 6,
      category: 'investments',
      Icon: Landmark,
      name: 'Kotak811 Corporate NPS',
      description: 'Secure your retirement with National Pension System corporate benefits.',
      rate: 'Tax Benefits',
      badge: 'Retirement',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    },
    {
      id: 7,
      category: 'insurance',
      Icon: Shield,
      name: 'Kotak Life Insurance',
      description: 'Comprehensive life coverage to secure your family’s future.',
      rate: 'High Coverage',
      badge: 'Protection',
      badgeColor: 'bg-[#ff0049]/10 text-[#ff0049] dark:bg-[#ff0049]/20 dark:text-[#ff0049]'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Marketplace</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Explore financial products & services tailored for you</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
            }`}
          >
            <span className="inline-flex items-center"><cat.Icon className="w-4 h-4 mr-1" /></span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full hover:border-red-500/20"
          >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#ff0049]/10 transition-colors duration-300 group-hover:scale-110">
                  <product.Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#ff0049] transition-colors" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${product.badgeColor} group-hover:shadow-sm transition-all`}>
                  {product.badge}
                </span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#ff0049] transition-colors" title={product.name}>{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">{product.description}</p>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                 <p className="text-sm font-medium text-gray-900 dark:text-white">
                   {product.rate}
                 </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between group-hover:border-red-500/10 transition-colors">
               <span className="text-sm font-medium text-gray-500 group-hover:text-[#222222] dark:group-hover:text-white transition-colors">View Details</span>
               <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#222222] group-hover:text-white transition-all duration-300 group-hover:rotate-45">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                 </svg>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No products found in this category</p>
        </div>
      )}
    </div>
  );
};
