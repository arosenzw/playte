import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { supabase } from '../lib/supabase';
import { calculateSpearmanCorrelation } from '../utils/spearmanCorrelation';

function FlavorJourney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restaurantName } = useGame();
  const scrollRef = useRef(null);
  const [showFade, setShowFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [winningDish, setWinningDish] = useState(null);
  const [losingDish, setLosingDish] = useState(null);
  const [hotColdDish, setHotColdDish] = useState(null);
  const [bestTasteBuds, setBestTasteBuds] = useState(null); // { player_name, correlation }

  // Helper function to calculate standard deviation
  const calculateStdDev = (values) => {
    if (!values || values.length === 0) return 0;
    if (values.length === 1) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Fetch ranked results to get winning, losing, and hot & cold dishes
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      const routeGameId = searchParams.get('game') || searchParams.get('gameId') || searchParams.get('roomId');
      const storedRoomId = routeGameId || localStorage.getItem('currentRoomId');

      if (!storedRoomId) {
        setError('We could not find your game.');
        setIsLoading(false);
        return;
      }

      if (routeGameId) {
        localStorage.setItem('currentRoomId', routeGameId);
      }

      // Fetch ranked results
      const { data: rankedData, error: rpcError } = await supabase.rpc('get_ranked_results', {
        p_game_table_id: storedRoomId,
      });

      if (rpcError) {
        console.error('Error fetching ranked results:', rpcError);
        setError('There was a problem loading the results.');
        setIsLoading(false);
        return;
      }

      if (rankedData && Array.isArray(rankedData) && rankedData.length > 0) {
        // Sort by rank_order to ensure correct order
        const sorted = [...rankedData].sort((a, b) => (a.rank_order ?? Infinity) - (b.rank_order ?? Infinity));
        
        // Winner is rank_order = 1 (first place)
        const winner = sorted.find(r => r.rank_order === 1);
        // Loser is the highest rank_order (last place)
        const loser = sorted[sorted.length - 1];
        
        setWinningDish(winner || null);
        setLosingDish(loser || null);

        // Fetch ratings to compute standard deviation for Hot & Cold
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('dish_id, rank')
          .eq('game_table_id', storedRoomId);

        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
          // Continue without hot & cold dish if ratings fetch fails
        } else if (ratingsData && ratingsData.length > 0) {
          // Group ratings by dish_id
          const dishRatings = {};
          ratingsData.forEach(rating => {
            if (!dishRatings[rating.dish_id]) {
              dishRatings[rating.dish_id] = [];
            }
            dishRatings[rating.dish_id].push(rating.rank);
          });

          // Calculate stddev for each dish and find the one with highest stddev
          // Tie-breakers: (1) larger range(position), (2) higher polarization (#firsts + #lasts), (3) dish_id (deterministic)
          const totalDishes = sorted.length; // Total number of dishes in the game
          const dishStdDevs = [];
          
          Object.entries(dishRatings).forEach(([dishId, ranks]) => {
            const stdDev = calculateStdDev(ranks);
            const dishInfo = rankedData.find(r => r.dish_id === dishId);
            if (dishInfo) {
              // Calculate range: max(position) - min(position)
              const maxRank = Math.max(...ranks);
              const minRank = Math.min(...ranks);
              const range = maxRank - minRank;
              
              // Calculate polarization: count of first place votes + count of last place votes
              const firstPlaceVotes = ranks.filter(r => r === 1).length;
              const lastPlaceVotes = ranks.filter(r => r === totalDishes).length;
              const polarization = firstPlaceVotes + lastPlaceVotes;
              
              dishStdDevs.push({
                dish_id: dishId,
                stddev: stdDev,
                range: range,
                polarization: polarization,
                dish_info: dishInfo
              });
            }
          });

          // Sort by stddev DESC, then range DESC, then polarization DESC, then dish_id ASC (deterministic)
          dishStdDevs.sort((a, b) => {
            // Primary: highest stddev
            if (Math.abs(a.stddev - b.stddev) > 0.0001) {
              return b.stddev - a.stddev;
            }
            // Tie-breaker 1: larger range
            if (a.range !== b.range) {
              return b.range - a.range;
            }
            // Tie-breaker 2: higher polarization
            if (a.polarization !== b.polarization) {
              return b.polarization - a.polarization;
            }
            // Tie-breaker 3: dish_id (deterministic)
            return a.dish_id.localeCompare(b.dish_id);
          });

          // The first dish after sorting is the Hot & Cold dish
          if (dishStdDevs.length > 0) {
            setHotColdDish(dishStdDevs[0].dish_info);
          }
        }

        // Calculate Best Taste Buds using Spearman correlation
        const currentPlayerId = localStorage.getItem('currentPlayerId');
        if (currentPlayerId) {
          // Fetch all ratings for the game
          const { data: allRatings, error: allRatingsError } = await supabase
            .from('ratings')
            .select('player_id, dish_id, rank')
            .eq('game_table_id', storedRoomId);

          // Fetch all players for the game
          const { data: allPlayers, error: playersError } = await supabase
            .from('players')
            .select('id, name')
            .eq('game_table_id', storedRoomId);

          if (!allRatingsError && !playersError && allRatings && allPlayers) {
            // Get all unique dish IDs in the game (sorted for consistency)
            const allDishIds = [...new Set(allRatings.map(r => r.dish_id))].sort();
            
            if (allDishIds.length > 0) {
              // Build rank array for current user: [rank for dish1, rank for dish2, ...]
              const currentUserRatings = allRatings.filter(r => r.player_id === currentPlayerId);
              const currentUserRankArray = allDishIds.map(dishId => {
                const rating = currentUserRatings.find(r => r.dish_id === dishId);
                return rating ? rating.rank : null;
              });

              // Only proceed if current user has ranked all dishes
              if (currentUserRankArray.every(rank => rank !== null)) {
                let maxCorrelation = -Infinity;
                let bestMatchPlayer = null;

                // Compare with each other player
                allPlayers.forEach(player => {
                  if (player.id === currentPlayerId) return; // Skip self

                  // Build rank array for this player
                  const playerRatings = allRatings.filter(r => r.player_id === player.id);
                  const playerRankArray = allDishIds.map(dishId => {
                    const rating = playerRatings.find(r => r.dish_id === dishId);
                    return rating ? rating.rank : null;
                  });

                  // Only compare if player has ranked all dishes
                  if (playerRankArray.every(rank => rank !== null)) {
                    const correlation = calculateSpearmanCorrelation(
                      currentUserRankArray,
                      playerRankArray
                    );

                    if (correlation > maxCorrelation) {
                      maxCorrelation = correlation;
                      bestMatchPlayer = {
                        name: player.name,
                        correlation: correlation
                      };
                    }
                  }
                });

                if (bestMatchPlayer) {
                  setBestTasteBuds(bestMatchPlayer);
                }
              }
            }
          }
        }
      }

      setIsLoading(false);
    };

    fetchResults();
  }, [searchParams]);

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
    const displayRestaurantName = restaurantName || localStorage.getItem('currentRestaurantName') || '[restaurant name]';
    const mostLoved = winningDish?.dish_name || 'N/A';
    const nachoType = losingDish?.dish_name || 'N/A';
    const hotCold = hotColdDish?.dish_name || 'N/A';
    const bestBuds = bestTasteBuds 
      ? `${bestTasteBuds.name} (${(bestTasteBuds.correlation * 100).toFixed(1)}% match)`
      : 'N/A';
    
    const text = `My Flavor Journey on Playte:\n\n😍 Most Loved: ${mostLoved}\n🤨 Nacho Type: ${nachoType}\n😐 Hot & Cold: ${hotCold}\n😁 Best Taste Buds: ${bestBuds}\n\nCheck out my dining experience at ${displayRestaurantName}!`;
    
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
          <div className="text-[#8C8376] italic">{restaurantName || localStorage.getItem('currentRestaurantName') || '[restaurant name]'}</div>
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
                {isLoading ? (
                  <div className="text-center text-[#8C8376] py-8">Loading flavor journey...</div>
                ) : error ? (
                  <div className="text-center text-[#FF3B30] py-8">{error}</div>
                ) : (
                  <>
                    {/* Most Loved */}
                    <div className="text-center">
                      <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                        most loved 😍
                      </h2>
                      <p className="text-[#8C8376] text-sm mb-4">clean plate club</p>
                      <div className={`rounded-2xl border px-4 py-3 text-[#4C463D] text-lg ${
                        winningDish 
                          ? 'bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-yellow-300 shadow-lg' 
                          : 'bg-[#F8DDA5] border-[#E7C88F]'
                      }`}>
                        {winningDish?.dish_name || 'N/A'}
                      </div>
                    </div>

                    {/* Nacho Type */}
                    <div className="text-center">
                      <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                        nacho type 🤨
                      </h2>
                      <p className="text-[#8C8376] text-sm mb-4">zero out of ten, respectfully</p>
                      <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                        {losingDish?.dish_name || 'N/A'}
                      </div>
                    </div>
                  </>
                )}

                {/* Hot & Cold */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    hot & cold 😐
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">the great playte debate</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D] text-lg">
                    {hotColdDish?.dish_name || 'N/A'}
                  </div>
                </div>

                {/* Best Taste Buds */}
                <div className="text-center">
                  <h2 className="text-[clamp(20px,5vw,28px)] font-extrabold text-[#F44336] mb-2">
                    best (taste) buds 😁
                  </h2>
                  <p className="text-[#8C8376] text-sm mb-4">you should share next time</p>
                  <div className="rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-4 py-3 text-[#4C463D]">
                    <div className="text-lg font-semibold">{bestTasteBuds?.name || 'N/A'}</div>
                    {bestTasteBuds && (
                      <div className="text-xs text-[#8C8376] mt-1">
                        {(bestTasteBuds.correlation * 100).toFixed(1)}% match
                      </div>
                    )}
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


