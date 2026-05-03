import { Product } from '@/mocks/products';

interface PricingTableProps {
  pricing: Product['pricing'];
}

export function PricingTable({ pricing }: PricingTableProps) {
  const plans = [
    { label: 'Daily', price: pricing.perDay, unit: 'day', highlight: false },
    { label: 'Weekly', price: pricing.perWeek, unit: 'week', highlight: true },
    { label: 'Monthly', price: pricing.perMonth, unit: 'month', highlight: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
      <div className="p-4 bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <h3 className="text-xs font-black text-[#171717] uppercase tracking-widest">Rental Plans</h3>
      </div>
      <div className="divide-y divide-[#E5E5E5]">
        {plans.map((plan) => (
          <div 
            key={plan.label} 
            className={`p-4 flex items-center justify-between ${plan.highlight ? 'bg-[#E4F9FF]/30' : ''}`}
          >
            <div>
              <p className="text-sm font-bold text-[#171717]">{plan.label}</p>
              <p className="text-[10px] text-[#737373]">Best for short term</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-[#171717]">₹{plan.price.toLocaleString()}</p>
              <p className="text-[10px] text-[#737373]">per {plan.unit}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#F5F5F5] flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#737373] uppercase">Security Deposit</span>
        <span className="text-sm font-bold text-[#171717]">₹{pricing.deposit.toLocaleString()}</span>
      </div>
    </div>
  );
}
