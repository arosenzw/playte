import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <style jsx>{`
        .logo-blend {
          background-color: transparent;
          mix-blend-mode: multiply;
        }
      `}</style>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <div className="mb-16">
            <div className="text-[44px] leading-none font-semibold text-[#F7C970] mb-6">let’s</div>
            <img src="/playte-logo.png" alt="playte" className="mx-auto w-[88%] logo-blend" />
          </div>

          <div className="space-y-8">
            <div>
              <button
                onClick={() => navigate('/name')}
                className="w-full rounded-full bg-[#F27E7E] hover:brightness-95 text-white text-[28px] leading-none font-semibold py-5 shadow-sm"
              >
                start a game
              </button>
              <div className="mt-3 text-[18px] text-[#B4A999]">add your dishes + invite friends</div>
            </div>

            <div>
              <button
                onClick={() => navigate('/join')}
                className="w-full rounded-full bg-[#FF3B30] hover:brightness-95 text-white text-[28px] leading-none font-semibold py-5 shadow-sm"
              >
                join a game
              </button>
              <div className="mt-3 text-[18px] text-[#B4A999]">enter table pin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


