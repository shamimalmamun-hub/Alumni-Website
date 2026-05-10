import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Registration } from '../types';
import { CheckCircle, XCircle, Loader2, Utensils, User, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../lib/utils';

export default function QRScannerView() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'already' | 'error' | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    }, false);

    scanner.render((decodedText) => {
      setScannedResult(decodedText);
      scanner.pause(true); // Pause scanner after finding one
    }, (error) => {
      // Ignore errors during scan
    });

    return () => {
      scanner.clear().catch(err => console.error('Failed to clear scanner', err));
    };
  }, []);

  useEffect(() => {
    if (scannedResult) {
      handleScan(scannedResult);
    }
  }, [scannedResult]);

  const handleScan = async (id: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const docRef = doc(db, 'registrations', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Registration;
        setRegistration(data);
        if (data.foodReceived) {
          setStatus('already');
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Scan handling error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReceived = async () => {
    if (!registration) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'registrations', registration.id);
      await updateDoc(docRef, {
        foodReceived: true,
        receivedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStatus('success');
      setRegistration(prev => prev ? { ...prev, foodReceived: true } : null);
    } catch (error) {
      console.error('Error marking as received:', error);
      alert('Fail to update / আপডেট করা সম্ভব হয়নি');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScannedResult(null);
    setRegistration(null);
    setStatus(null);
    // Resume scanner
    const readerElement = document.getElementById('reader');
    if (readerElement) {
       // Unfortunately Html5QrcodeScanner doesn't expose a simple "resume" easily in a way that respects the pause
       // So we just reload the page part if needed or re-render
       window.location.reload(); // Simple way to reset complex scanner state
    }
  };

  return (
    <div className="space-y-6">
      {!scannedResult && (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div id="reader" className="w-full"></div>
        </div>
      )}

      <AnimatePresence>
        {scannedResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative"
          >
             <button 
                onClick={handleReset}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

            {loading && !registration && (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                <p className="font-bold">Fetching details...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Invalid QR Code</h3>
                <p className="text-gray-500">এই কিউআর কোডটি পাওয়া যায়নি।</p>
              </div>
            )}

            {registration && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{registration.name}</h2>
                    <p className="text-gray-500 font-bold flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" /> Batch {registration.batch}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="font-bold">{registration.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="font-bold text-green-600">Paid (৳{registration.amount})</p>
                  </div>
                </div>

                {registration.foodReceived ? (
                  <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl text-center">
                    <Utensils className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-lg font-black text-orange-700">Food Already Claimed!</h3>
                    <p className="text-orange-600 font-medium">নিয়েছেন: {formatDate(registration.receivedAt?.toDate ? registration.receivedAt.toDate() : registration.receivedAt)}</p>
                  </div>
                ) : (
                  <button
                    disabled={loading}
                    onClick={handleMarkReceived}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                    Confirm Food Distribution
                  </button>
                )}

                {status === 'success' && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-3 bg-green-500 text-white p-4 rounded-2xl"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <p className="font-bold">Food marked as served successfully!</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
