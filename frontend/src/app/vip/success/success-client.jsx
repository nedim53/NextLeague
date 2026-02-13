'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        const res = await fetch(`${API}/verify-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.valid) {
          setShowModal(true);
          await fetch(`${API}/confirm-purchase`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Greška prilikom verifikacije:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="relative min-h-screen bg-[#031716] text-white flex flex-col items-center justify-center px-4">
      
      {/* Loading modal */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#032f30] text-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-[#6ba3be] animate-slide-up text-center">
            <p className="text-lg font-semibold">Verifying your purchase...</p>
          </div>
        </div>
      )}

      {/* Success */}
      {!loading && showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#032f30] via-[#0a7075] to-[#0c969c] text-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-[#6ba3be] animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎉</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#e0f7fa]">Purchase successful!</h2>
            </div>

            <p className="text-sm text-[#d1e3e5] mb-6 leading-relaxed">
              Enjoy your new features and benefits as a VIP member!
            </p>

            <button
              onClick={() => location.href = '/homepage'}
              className="w-full bg-[#274d60] hover:bg-[#1f3b4a] text-white py-2.5 px-4 rounded-md font-semibold tracking-wide transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && !showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#032f30] via-[#0a7075] to-[#0c969c] text-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-[#6ba3be] animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#e0f7fa]">Purchase unsuccessful!</h2>
            </div>

            <p className="text-sm text-[#d1e3e5] mb-6 leading-relaxed">
              We're sorry, but your purchase was not successful. Please try again or contact support.
            </p>

            <button
              onClick={() => location.href = '/homepage'}
              className="w-full bg-[#274d60] hover:bg-[#1f3b4a] text-white py-2.5 px-4 rounded-md font-semibold tracking-wide transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animacije */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }
        .animate-slide-up {
          animation: slide-up 0.35s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPageClient() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-[#031716] text-white flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#032f30] text-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-[#6ba3be] text-center">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
