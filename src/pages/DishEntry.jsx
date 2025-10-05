import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function DishEntry() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const { dishes, setDishes } = useGame();

  const addDish = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    // Check if dish already exists (case-insensitive)
    const alreadyExists = dishes.some(dish => 
      dish.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (alreadyExists) {
      // Show a brief visual feedback that item already exists
      setShowDuplicateMessage(true);
      setTimeout(() => setShowDuplicateMessage(false), 2000);
      setInput('');
      return;
    }
    
    setDishes((prev) => [...prev, trimmed]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDish(input);
    }
  };

  const removeDish = (idx) => {
    setDishes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/gatherAround');
  };

  // Ensure pills are visible on mount if coming back
  useEffect(() => {}, [dishes]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[clamp(20px,6.5vw,36px)] leading-tight font-extrabold text-[#F44336] mb-3 text-center whitespace-nowrap">what did you order?</h1>
          <p className="text-[#8C8376] text-sm mb-6">don’t forget to include bread, beverages, and desserts</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="enter items"
                className="w-full rounded-xl bg-[#F8DDA5] placeholder-[#C9B68F] text-[#7A6F5E] text-lg px-5 py-3 border border-[#E7C88F] focus:outline-none focus:ring-2 focus:ring-[#F7C970] text-center placeholder:text-center"
              />
              <div className="text-[10px] text-[#8C8376] -mt-3">
                min 4 items
                {showDuplicateMessage && (
                  <span className="text-[#FF3B30] ml-2">• item already added</span>
                )}
              </div>

              {dishes.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {dishes.map((dish, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 rounded-xl bg-[#F8DDA5] border border-[#E7C88F] text-[#7A6F5E] px-3 py-1 text-sm">
                      {dish}
                      <button type="button" onClick={() => removeDish(idx)} className="ml-1 text-[#7A6F5E] hover:text-[#5f574a]">×</button>
                    </span>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#FF3B30] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={dishes.length < 4}
              >
                next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DishEntry;


