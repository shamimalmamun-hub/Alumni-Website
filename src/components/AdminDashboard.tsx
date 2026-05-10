import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Registration } from '../types';
import { 
  Users, 
  Banknote, 
  Utensils, 
  QrCode, 
  LogOut, 
  LayoutDashboard,
  Printer,
  Search
} from 'lucide-react';
import DashboardStats from './DashboardStats';
import RegistrationList from './RegistrationList';
import FoodList from './FoodList';
import QRScannerView from './QRScannerView';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'list' | 'food' | 'scan'>('stats');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
      setRegistrations(data);
    });
    return () => unsubscribe();
  }, []);

  const totalMoney = registrations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const foodCount = registrations.filter(r => r.foodReceived).length;

  const filteredRegistrations = registrations.filter(reg => {
    const query = searchQuery.toLowerCase();
    return (
      reg.name.toLowerCase().includes(query) ||
      reg.phone.includes(query) ||
      reg.email.toLowerCase().includes(query)
    );
  });

  const filteredFoodRegistrations = registrations
    .filter(r => r.foodReceived)
    .filter(reg => {
      const query = searchQuery.toLowerCase();
      return (
        reg.name.toLowerCase().includes(query) ||
        reg.phone.includes(query)
      );
    });

  const tabs = [
    { id: 'stats', label: 'Stats/ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'list', label: 'All Alumni/সবাই', icon: Users },
    { id: 'food', label: 'Food Taken/খাবার নিয়েছে', icon: Utensils },
    { id: 'scan', label: 'Scan QR/স্ক্যান করুন', icon: QrCode },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-black text-white p-6 md:sticky md:top-0 md:h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Users className="text-black w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight">Alumni Pro</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-white text-black shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F5F5F5] p-6 md:p-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard Overview</h1>
                    <p className="text-gray-500 font-medium italic">পুনর্মিলনী ড্যাশবোর্ড ওভারভিউ</p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl font-bold border border-gray-200 hover:border-black transition-all print:hidden"
                  >
                    <Printer className="w-5 h-5" /> Full Report
                  </button>
                </div>
                <DashboardStats 
                  totalRegistrations={registrations.length}
                  totalMoney={totalMoney}
                  foodCount={foodCount}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       Recent Registrations / সাম্প্রতিক রেজিস্ট্রেশন
                    </h3>
                    <RegistrationList registrations={registrations.slice(0, 5)} hideActions />
                  </div>
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <QrCode className="text-blue-500 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quick Scan</h3>
                    <p className="text-gray-500 text-sm mb-6">Scan QR codes to mark food distribution quickly.</p>
                    <button 
                      onClick={() => setActiveTab('scan')}
                      className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                    >
                      Open Scanner
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'list' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
                  <div>
                    <h1 className="text-2xl font-black">All Alumni Registrations</h1>
                    <p className="text-gray-500 text-sm">টোটাল {registrations.length} জন রেজিঃ করেছেন</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto print:hidden">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search name or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black translate-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-xl font-bold hover:opacity-80 transition-all"
                    >
                      <Printer className="w-5 h-5" /> Print All
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm overflow-x-auto">
                   <RegistrationList registrations={filteredRegistrations} showPrintStyles />
                </div>
              </div>
            )}

            {activeTab === 'food' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
                  <div>
                    <h1 className="text-2xl font-black">Food Distribution List</h1>
                    <p className="text-gray-500 text-sm">টোটাল {foodCount} জন খাবার নিয়েছেন</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto print:hidden">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search name or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black translate-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-xl font-bold hover:opacity-80 transition-all"
                    >
                      <Printer className="w-5 h-5" /> Print List
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm overflow-x-auto">
                  <FoodList registrations={filteredFoodRegistrations} />
                </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-black mb-2">Scan Participant QR</h1>
                  <p className="text-gray-500 mb-8 font-medium">কিউআর কোড স্ক্যান করে খাবার নিশ্চিত করুন</p>
                </div>
                <QRScannerView />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
