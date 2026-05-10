import React from 'react';
import { Users, Banknote, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardStatsProps {
  totalRegistrations: number;
  totalMoney: number;
  foodCount: number;
}

export default function DashboardStats({ totalRegistrations, totalMoney, foodCount }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Registrations / মোট রেজিঃ',
      value: totalRegistrations,
      icon: Users,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      sub: 'Participants'
    },
    {
      label: 'Total Collected / মোট টাকা',
      value: `৳${totalMoney.toLocaleString('bn-BD')}`,
      icon: Banknote,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      sub: 'BDT'
    },
    {
      label: 'Food Served / খাবার নিয়েছেন',
      value: foodCount,
      icon: Utensils,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      sub: 'Coupons'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 -mr-8 -mt-8 rounded-full", stat.color)}></div>
          <div className="flex items-start justify-between mb-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.color)}>
              <stat.icon className="text-white w-7 h-7" />
            </div>
            <p className={cn("text-sm font-black uppercase tracking-tighter", stat.textColor)}>{stat.sub}</p>
          </div>
          <h4 className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</h4>
          <p className="text-4xl font-black tracking-tight">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}


