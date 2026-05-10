import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: (status: boolean) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Invalid username or password / ভুল ইউজারনেম বা পাসওয়ার্ড');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F5]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Admin Console</h1>
          <p className="text-[#6B7280] font-medium">এডমিন প্যানেলে লগইন করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 group"
          >
            Login to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
