import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function FlavorJourney() {
  const navigate = useNavigate();
  const { restaurantName } = useGame();
  const scrollRef = useRef(null);
  const [showFade, setShowFade] = useState(true);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowFade(!isAtBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    
    // Check initial state after a small delay
    setTimeout(() => {
      handleScroll();
    }, 100);

    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  const shareFlavorJourney = async () => {
    const text = `My Flavor Journey on Playte:\n\n😍 Most Loved: Spicy tuna roll\n🤨 Nacho Type: Fried halloumi\n😐 Hot & Cold: Bread\n😁 Best Taste Buds: Sami\n\nCheck out my dining experience at ${restaurantName || '[restaurant name]'}!`;
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: 'My Flavor Journey', 
          text: text 
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Copied flavor journey to clipboard');
      }
    } catch (e) {
      // User cancelled sharing
    }
  };

  const endGame = () => {
    navigate('/');
  };

  return (
    <div className="h-screen bg-[#FEF5E6] flex flex-col relative" style={{height: '100dvh'}}>
      <style jsx>{`
        .logo-blend {
          background-color: transparent;
          mix-blend-mode: multiply;
        }
      `}</style>
      {/* Fixed header */}
      <div className="flex-shrink-0 px-6 pt-10 pb-4 bg-[#FEF5E6]">
        <div className="w-full max-w-[420px] mx-auto text-center">
          <img src="/playte-logo.png" alt="playte" className="mx-auto w-[140px] mb-4 logo-blend" />
          <div className="text-[#8C8376] italic">{restaurantName || '[restaurant name]'}</div>
        </div>
      </div>

      {/* Fixed fade overlay at bottom of scrollable area - only shows when not at bottom */}
      {showFade && (
        <div className="absolute left-0 right-0 h-16 bg-gradient-to-t from-[#7A6F5E]/40 via-[#8C8376]/20 to-transparent pointer-events-none z-30" style={{bottom: '10.5rem'}}></div>
      )}

      {/* Scrollable content with fade overlay */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="px-6 py-2">
          <div className="w-full max-w-[420px] mx-auto">
            <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-4 pb-12 text-center relative">
              {/* Flavor Journey Sections */}
              <div className="space-y-8">
                {/* Most Loved */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    most loved 😍
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">clean plate club</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                    Spicy tuna roll
                  </div>
                </div>

                {/* Nacho Type */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    nacho type 🤨
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">zero out of ten, respectfully</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                    Fried halloumi
                  </div>
                </div>

                {/* Hot & Cold */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    hot & cold 😐
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">the great playte debate</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                    Bread
                  </div>
                </div>

                {/* Best Taste Buds */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    best (taste) buds 😁
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">you should share next time</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                    Sami
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed buttons at bottom */}
      <div className="flex-shrink-0 px-6 pt-2 pb-6 bg-[#FEF5E6] border-t border-[#E7C88F]">
        <div className="max-w-[420px] mx-auto space-y-4">
          <button
            onClick={shareFlavorJourney}
            className="w-full rounded-full bg-[#F27E7E] hover:brightness-95 text-white text-xl font-semibold py-4"
          >
            share flavor journey
          </button>
          <button
            onClick={endGame}
            className="w-full rounded-full bg-[#FF8A80] hover:brightness-95 text-white text-xl font-semibold py-4"
          >
            end game
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlavorJourney;


