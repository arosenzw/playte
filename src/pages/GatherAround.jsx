import React from 'react';
import { useNavigate } from 'react-router-dom';

function GatherAround() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[clamp(22px,6vw,36px)] font-extrabold text-[#F44336]">gather around</h1>
          <p className="text-[#8C8376] mt-3">share the game pin with your table to get everyone playing</p>

          <div className="my-16">
            <div className="text-[#F44336] font-semibold" style={{fontSize: 'clamp(48px, 18vw, 120px)'}}>12345</div>
          </div>

          <div className="text-[#8C8376] mb-4">0 people joined your playte</div>

          <button
            onClick={() => navigate('/ranking')}
            className="w-full rounded-full bg-[#F27E7E] enabled:hover:brightness-95 text-white text-xl font-semibold py-4"
          >
            start game
          </button>
        </div>
      </div>
    </div>
  );
}

export default GatherAround;


