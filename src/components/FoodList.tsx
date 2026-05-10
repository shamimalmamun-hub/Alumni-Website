import React from 'react';
import { Registration } from '../types';
import { formatDate } from '../lib/utils';

interface FoodListProps {
  registrations: Registration[];
}

export default function FoodList({ registrations }: FoodListProps) {
  return (
    <div className="print-area">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Name</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Batch</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Phone</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Received At / নেওয়ার সময়</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {registrations.map((reg) => (
            <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-2">
                <p className="font-bold text-[#1A1A1A]">{reg.name}</p>
                <p className="text-xs text-gray-400">{reg.email}</p>
              </td>
              <td className="py-4 px-2 font-bold">{reg.batch}</td>
              <td className="py-4 px-2">{reg.phone}</td>
              <td className="py-4 px-2 font-semibold">
                <span className="text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                   {formatDate(reg.receivedAt?.toDate ? reg.receivedAt.toDate() : reg.receivedAt)}
                </span>
              </td>
            </tr>
          ))}
          {registrations.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center text-gray-400 font-bold uppercase italic">
                Nobody has received food yet / কেউ এখনো খাবার নেয়নি
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
