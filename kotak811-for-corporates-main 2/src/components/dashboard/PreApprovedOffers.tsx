import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, PiggyBank, Home } from "lucide-react";

export const PreApprovedOffers: React.FC = () => {
  const offers = [
    {
      id: 1,
      type: 'Salary Account',
      title: 'Kotak 811 Salary Account',
      subtitle: 'Zero-balance digital salary account with full mobile banking.',
      amount: '₹0 minimum balance',
      features: [
        'Zero-balance corporate salary account',
        'Free virtual debit card with instant issuance',
        'UPI & mobile banking from day one'
      ],
      badge: 'Pre-approved',
      badgeColor: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
      Icon: CreditCard,
      expiresIn: '7 days'
    },
    {
      id: 2,
      type: 'Personal Loan',
      title: 'Kotak 811 Personal Loan',
      subtitle: 'Instant, paperless personal loan for salaried employees.',
      amount: 'Up to ₹15L',
      features: [
        'Preferential rates for Kotak 811 salary credit',
        '100% digital journey with minimal documents',
        'Flexible tenure up to 5 years'
      ],
      badge: 'Pre-approved',
      badgeColor: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
      Icon: PiggyBank,
      expiresIn: '5 days'
    },
    {
      id: 3,
      type: 'Credit Card',
      title: '811 Super Credit Card',
      subtitle: 'Lifetime-free secured credit card to build credit.',
      amount: 'FD-backed',
      features: [
        'Simplified documentation for salary employees',
        'Cashback, travel & fuel benefits',
        'Corporate offers on spends & EMI conversions'
      ],
      badge: 'Credit Builder',
      badgeColor: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
      Icon: Home,
      expiresIn: '10 days'
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pre-approved Offers</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Exclusive deals tailored for you</p>
        </div>
        <button className="text-primary dark:text-primary/80 hover:underline text-sm font-medium">
          View all
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${offer.badgeColor}`}>
                {offer.badge}
              </span>
            </div>

            {/* Icon & Title */}
            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <offer.Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{offer.type}</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">{offer.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{offer.subtitle}</p>
            </div>

            {/* Main Benefit/Amount */}
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
               <div className="flex items-end justify-between mb-4">
                 <div>
                   <p className="text-xs text-gray-500 mb-0.5">Benefit</p>
                   <p className="text-lg font-bold text-gray-900 dark:text-white">{offer.amount}</p>
                 </div>
               </div>
               <Button className="w-full bg-[#222222] dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-200 transition-colors">
                 Apply Now
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
