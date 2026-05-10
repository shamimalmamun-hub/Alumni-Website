import { Registration } from '../types';
import { formatDate, cn } from '../lib/utils';

interface RegistrationListProps {
  registrations: Registration[];
  hideActions?: boolean;
  showPrintStyles?: boolean;
}

export default function RegistrationList({ registrations, hideActions, showPrintStyles }: RegistrationListProps) {
  return (
    <div className={showPrintStyles ? "print-table" : ""}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Name / নাম</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Phone / ব্যাচ</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Batch</th>
            <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Amt / টাকা</th>
            {!hideActions && (
              <th className="py-4 px-2 text-xs font-black uppercase text-gray-400 tracking-widest">Food Status</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {registrations.map((reg) => (
            <tr key={reg.id} className="hover:bg-gray-50 transition-colors group">
              <td className="py-4 px-2">
                <p className="font-bold text-[#1A1A1A]">{reg.name}</p>
                <p className="text-xs text-gray-400 font-medium">{reg.email}</p>
              </td>
              <td className="py-4 px-2 font-semibold text-gray-600">{reg.phone}</td>
              <td className="py-4 px-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-tight">
                  {reg.batch}
                </span>
              </td>
              <td className="py-4 px-2 font-black text-black">৳{reg.amount}</td>
              {!hideActions && (
                <td className="py-4 px-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    reg.foodReceived 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  )}>
                    {reg.foodReceived ? 'Claimed' : 'Not Yet'}
                  </span>
                </td>
              )}
            </tr>
          ))}
          {registrations.length === 0 && (
            <tr>
              <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase italic">
                No registrations found / কাউকে পাওয়া যায়নি
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        @media print {
          .print-table {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white;
          }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #eee; padding: 10px; font-size: 10pt; }
          th { background-color: #f9f9f9 !important; -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// Remove trailing import
