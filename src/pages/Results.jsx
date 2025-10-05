import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';

function Results() {
  const navigate = useNavigate();
  const { dishes, restaurantName } = useGame();
  const [visibleItems, setVisibleItems] = useState([]);

  // Animate items appearing one by one from worst to best (competition reveal)
  useEffect(() => {
    if (dishes.length === 0) return;

    // Start with empty array
    setVisibleItems([]);
    
    // Add items one by one, starting from the last (worst) ranked item
    dishes.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, dishes[dishes.length - 1 - index]]);
        
        // Trigger confetti when winner (first place) appears
        if (index === dishes.length - 1) {
          // Multiple confetti bursts for celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Additional bursts from different angles
          setTimeout(() => {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { x: 0.2, y: 0.6 }
            });
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { x: 0.8, y: 0.6 }
            });
          }, 200);
        }
      }, index * 600); // 600ms delay between each item for dramatic effect
    });
  }, [dishes]);

  const share = async () => {
    const text = `My ranking on Playte:\n` + dishes.map((d, i) => `#${i + 1} ${d}`).join('\n');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Playte ranking', text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Copied ranking to clipboard');
      }
    } catch (e) {
      // no-op if user cancels
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <style jsx>{`
        .logo-blend {
          background-color: transparent;
          mix-blend-mode: multiply;
        }
      `}</style>
      <div className="w-full max-w-[520px] mx-auto px-5 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-4 md:px-6 pt-10 pb-10 text-center">
          <div className="mb-6">
            <img src="/playte-logo.png" alt="playte" className="mx-auto w-[140px] logo-blend" />
            <div className="text-[#8C8376] italic mt-2">{restaurantName || '[restaurant name]'}</div>
          </div>

          <ul className="space-y-4">
            {dishes.map((label, idx) => {
              const isVisible = visibleItems.includes(label);
              const isWinner = idx === 0 && isVisible; // First place and visible
              return (
                <li 
                  key={idx} 
                  className={`flex items-center ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  } ${isWinner ? '' : 'transition-all duration-700'}`}
                >
                  <div className="text-[#FF3B30] font-semibold mr-3 text-xl"># {idx + 1}</div>
                  <div className={`flex-1 rounded-2xl border px-4 py-3 text-[#4C463D] ${
                    isWinner 
                      ? 'bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-yellow-300 shadow-lg' 
                      : 'bg-[#F8DDA5] border-[#E7C88F]'
                  }`}>
                    {label}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 space-y-4">
            <button
              onClick={share}
              className="w-full rounded-full bg-[#F27E7E] hover:brightness-95 text-white text-xl font-semibold py-4"
            >
              share ranking
            </button>
            <button
              onClick={() => navigate('/flavorJourney')}
              className="w-full rounded-full bg-[#FF8A80] hover:brightness-95 text-white text-xl font-semibold py-4"
            >
              see flavor journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;


