import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Mixing() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/results'), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF3B30]">
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FF3B30] px-8 pt-48 pb-40 text-center text-white">
          <h1 className="text-[clamp(24px,6.5vw,40px)] font-semibold leading-snug">mixing up<br/>your flavors…</h1>

          <style>{`
            @keyframes gentle-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .gentle-bounce { animation: gentle-bounce 1.6s ease-in-out infinite; }
          `}</style>

          <div className="mt-14 flex justify-center">
            <img src="/mixing.png" alt="mixing bowl and whisk" className="gentle-bounce w-[140px] h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mixing;


