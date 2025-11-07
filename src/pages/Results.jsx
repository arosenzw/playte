import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restaurantName } = useGame();

  const [results, setResults] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const revealTimeouts = useRef([]);

  const routeGameId = searchParams.get('game') || searchParams.get('gameId') || searchParams.get('roomId');
  const displayRestaurantName = restaurantName || localStorage.getItem('currentRestaurantName') || '';

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 60, origin: { x: 0.2, y: 0.6 } });
      confetti({ particleCount: 50, spread: 60, origin: { x: 0.8, y: 0.6 } });
    }, 200);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      const storedRoomId = routeGameId || localStorage.getItem('currentRoomId');

      if (!storedRoomId) {
        setError('We could not find your game.');
        setIsLoading(false);
        return;
      }

      if (routeGameId) {
        localStorage.setItem('currentRoomId', routeGameId);
      }

      const { data, error: rpcError } = await supabase.rpc('get_ranked_results', {
        p_game_table_id: storedRoomId,
      });

      if (rpcError) {
        console.error('Error fetching ranked results:', rpcError);
        setError('There was a problem loading the results. Please try again.');
        setResults([]);
      } else {
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => (a.rank_order ?? Infinity) - (b.rank_order ?? Infinity))
          : [];
        setResults(sorted);
      }

      setIsLoading(false);
    };

    fetchResults();
  }, [routeGameId]);

  useEffect(() => {
    // Clear any existing timeouts before scheduling new ones
    revealTimeouts.current.forEach(clearTimeout);
    revealTimeouts.current = [];

    if (!results.length) {
      setVisibleItems([]);
      return;
    }

    setVisibleItems([]);

    results.forEach((_, index) => {
      const timeout = setTimeout(() => {
        const item = results[results.length - 1 - index];
        setVisibleItems((prev) => (prev.includes(item.dish_id) ? prev : [...prev, item.dish_id]));

        if (index === results.length - 1) {
          triggerConfetti();
        }
      }, index * 600);

      revealTimeouts.current.push(timeout);
    });

    return () => {
      revealTimeouts.current.forEach(clearTimeout);
      revealTimeouts.current = [];
    };
  }, [results]);

  const share = async () => {
    if (!results.length) return;

    const text = `My ranking on Playte:\n${results
      .map((result) => `#${result.rank_order} ${result.dish_name}`)
      .join('\n')}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Playte ranking', text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Copied ranking to clipboard');
      }
    } catch (e) {
      // User cancelled share – no action needed
    }
  };

  const hasResults = !isLoading && !error && results.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{ minHeight: '100dvh' }}>
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
            <div className="text-[#8C8376] italic mt-2">{displayRestaurantName || 'your restaurant'}</div>
          </div>

          <div className="min-h-[220px] flex flex-col justify-center">
            {isLoading && (
              <div className="text-[#8C8376] text-base">loading results…</div>
            )}

            {!isLoading && error && (
              <div className="text-[#FF3B30] text-base">{error}</div>
            )}

            {hasResults && (
              <ul className="space-y-4">
                {results.map((item) => {
                  const isVisible = visibleItems.includes(item.dish_id);
                  const isWinner = item.rank_order === 1 && isVisible;

                  return (
                    <li
                      key={item.dish_id}
                      className={`flex items-center ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } ${isWinner ? '' : 'transition-all duration-700'}`}
                    >
                      <div className="text-[#FF3B30] font-semibold mr-3 text-xl"># {item.rank_order}</div>
                      <div
                        className={`flex-1 rounded-2xl border px-4 py-3 text-[#4C463D] ${
                          isWinner
                            ? 'bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-yellow-300 shadow-lg'
                            : 'bg-[#F8DDA5] border-[#E7C88F]'
                        }`}
                      >
                        <div className="text-lg font-semibold">{item.dish_name}</div>
                        <div className="text-xs text-[#8C8376] mt-1">
                          {item.total_points} pts · {item.ballot_count}{' '}
                          {item.ballot_count === 1 ? 'vote' : 'votes'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!isLoading && !error && results.length === 0 && (
              <div className="text-[#8C8376] text-base">No rankings yet — stay tuned!</div>
            )}
          </div>

          <div className="mt-10 space-y-4">
            <button
              onClick={share}
              className="w-full rounded-full bg-[#F27E7E] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!results.length}
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


