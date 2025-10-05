import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function JoinGame() {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    
    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }

    if (gameCode.length !== 5) {
      setError('Game code must be 5 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if game code exists in Supabase
      const { data: roomData, error: roomError } = await supabase
        .from('game_tables')
        .select('id, code, restaurant_name, is_active')
        .eq('code', gameCode)
        .eq('is_active', true)
        .single();

      if (roomError || !roomData) {
        setError('Invalid game code');
        setIsLoading(false);
        return;
      }

      // Store room data in localStorage
      localStorage.setItem('currentRoomId', roomData.id);
      localStorage.setItem('currentGameCode', gameCode);
      localStorage.setItem('currentRestaurantName', roomData.restaurant_name);

      // Get player name from localStorage
      const playerName = localStorage.getItem('playerName') || 'Player';
      
      // Insert player into players table
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          game_table_id: roomData.id,
          name: playerName,
          is_host: false,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (playerError) {
        console.error('Error joining game:', playerError);
        setError('Failed to join game. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store player ID in localStorage
      localStorage.setItem('currentPlayerId', playerData.id);
      
      // Navigate to waiting room instead of ranking
      navigate('/waitingRoom');
      
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Failed to join game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[clamp(22px,6vw,36px)] font-extrabold text-[#F44336] mb-8">join a game</h1>

          <form onSubmit={handleJoin} className="space-y-8">
            <div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={gameCode}
                onChange={(e) => {
                  // Only allow digits and limit to 5 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setGameCode(value);
                  setError('');
                }}
                placeholder="enter pin"
                className="w-full rounded-xl bg-[#F8DDA5] placeholder-[#C9B68F] text-[#7A6F5E] text-lg px-5 py-3 border border-[#E7C88F] focus:outline-none focus:ring-2 focus:ring-[#F7C970] text-center placeholder:text-center text-2xl tracking-widest"
                maxLength={5}
              />
              
              {error && (
                <div className="mt-3 text-[#FF3B30] text-sm">{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || gameCode.length !== 5}
              className="w-full rounded-full bg-[#FF3B30] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'joining...' : 'join'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinGame;
