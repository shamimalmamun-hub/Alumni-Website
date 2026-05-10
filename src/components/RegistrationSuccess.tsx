import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Registration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Download, Home, Printer } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegistrationSuccess() {
  const { id } = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistration() {
      if (!id) return;
      try {
        const docRef = doc(db, 'registrations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRegistration({ id: docSnap.id, ...docSnap.data() } as Registration);
        }
      } catch (error) {
        console.error('Error fetching registration:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistration();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Registration Not Found</h1>
        <Link to="/" className="text-black underline">Back to Registration</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 print:py-0">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] p-10 overflow-hidden shadow-xl border border-[#E5E5E5] print:shadow-none print:border-none"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Registration Successful!</h1>
          <p className="text-xl text-[#6B7280]">আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে।</p>
        </div>

        <div className="bg-[#F9FAFB] rounded-3xl p-8 mb-8 border border-[#F3F4F6] flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">Registration ID</p>
              <p className="text-xl font-mono font-bold text-[#1A1A1A]">{id?.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">Full Name</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{registration.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">Batch</p>
              <p className="text-lg font-semibold">{registration.batch}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E5E5] flex flex-col items-center">
            <QRCodeSVG value={id || ''} size={180} level="H" includeMargin={true} />
            <p className="mt-4 text-xs font-bold text-[#6B7280] uppercase tracking-tighter">Your Entry Pass</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-5 h-5" /> Print Ticket
          </button>
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold hover:bg-[#333333] transition-colors"
          >
            <Home className="w-5 h-5" /> Done
          </Link>
        </div>

        <div className="hidden print:block border-t-2 border-dashed border-gray-300 pt-8 text-center text-sm text-gray-500">
          <p>This is your official invitation. Please bring a copy (digital or physical) to the event.</p>
          <p className="mt-1 font-bold">Venue: Main Campus Auditorium | Date: Dec 20, 2026</p>
        </div>
      </motion.div>
    </div>
  );
}
