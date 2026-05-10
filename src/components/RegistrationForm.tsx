import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, Phone, Mail, User, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
    amount: '500', // Default amount
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'registrations'), {
        ...formData,
        amount: Number(formData.amount),
        foodReceived: false,
        receivedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Send confirmation email via server
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            registrationId: docRef.id
          }),
        });
      } catch (err) {
        console.warn('Failed to trigger email notification:', err);
      }

      navigate(`/success/${docRef.id}`);
    } catch (error) {
      console.error('Registration error:', error);
      alert('রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E5E5]"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reunion Registration</h1>
          <p className="text-[#6B7280] font-medium italic">প্রাক্তন শিক্ষার্থী পুনর্মিলনী রেজিস্ট্রেশন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name / পূর্ণ নাম
            </label>
            <input
              required
              name="name"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email / ইমেইল
              </label>
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
                placeholder="email@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone / ফোন
              </label>
              <input
                required
                name="phone"
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
                placeholder="01XXXXXXXXX"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Batch / ব্যাচ
              </label>
              <input
                required
                name="batch"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
                placeholder="e.g. 2015"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Amount / টাকা
              </label>
              <input
                required
                name="amount"
                type="number"
                min="500"
                value={formData.amount}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#333333] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#9CA3AF] leading-relaxed">
          By registering, you agree to the reunion guidelines.<br/>
          রেজিস্ট্রেশন করে আপনি পুনর্মিলনী নির্দেশিকা মেনে নিচ্ছেন।
        </p>
      </motion.div>
    </div>
  );
}
