import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function NameEntry() {
  const navigate = useNavigate();
  const { setDishes } = useGame();
  const [name, setName] = useState('');

  // Clear dishes when entering this page (user is starting over)
  useEffect(() => {
    setDishes([]);
  }, [setDishes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: persist name to context or storage
    navigate('/restaurant');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[28px] md:text-[36px] leading-tight font-extrabold text-[#F44336] mb-8 whitespace-normal md:whitespace-nowrap">what’s your name?</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="enter name"
              className="w-full rounded-xl bg-[#F8DDA5] placeholder-[#C9B68F] text-[#7A6F5E] text-lg px-5 py-3 border border-[#E7C88F] focus:outline-none focus:ring-2 focus:ring-[#F7C970] text-center placeholder:text-center"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-[#FF3B30] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim()}
            >
              next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NameEntry;


