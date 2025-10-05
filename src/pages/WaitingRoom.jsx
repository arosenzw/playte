import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function WaitingRoom() {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkGameStatus = async () => {
      const roomId = localStorage.getItem('currentRoomId');
      const code = localStorage.getItem('currentGameCode');
      
      if (!roomId || !code) {
        console.error('No room data found');
        navigate('/');
        return;
      }

      try {
        // Get room info
        const { data: roomData, error: roomError } = await supabase
          .from('game_tables')
          .select('restaurant_name, is_active')
          .eq('id', roomId)
          .single();

        if (roomError) {
          console.error('Error fetching room:', roomError);
          navigate('/');
          return;
        }

        setRestaurantName(roomData.restaurant_name);

        // Check if host has started the game (if there are any players with is_host = true)
        const { data: hostData, error: hostError } = await supabase
          .from('players')
          .select('id')
          .eq('game_table_id', roomId)
          .eq('is_host', true)
          .single();

        if (hostError && hostError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is expected if host hasn't started
          console.error('Error checking host status:', hostError);
        } else if (hostData) {
          // Host has started the game, navigate to ranking
          navigate('/ranking');
          return;
        }

        setIsChecking(false);
        setGameCode(code); // Only set game code after checking is complete

        // Set up polling as backup to check for host starting the game
        const pollInterval = setInterval(async () => {
          const { data: hostData } = await supabase
            .from('players')
            .select('id')
            .eq('game_table_id', roomId)
            .eq('is_host', true)
            .single();

          if (hostData) {
            console.log('Host started the game (via polling), navigating to ranking');
            clearInterval(pollInterval);
            navigate('/ranking');
          }
        }, 2000); // Check every 2 seconds

        // Set up real-time subscription to listen for host starting the game
        const subscription = supabase
          .channel('game_start')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'players',
            filter: `game_table_id=eq.${roomId}`
          }, (payload) => {
            console.log('Player inserted:', payload.new);
            // Check if the new player is a host
            if (payload.new.is_host) {
              console.log('Host started the game, navigating to ranking');
              clearInterval(pollInterval);
              navigate('/ranking');
            }
          })
          .subscribe();

        // Cleanup subscription and interval on unmount
        return () => {
          subscription.unsubscribe();
          clearInterval(pollInterval);
        };

      } catch (error) {
        console.error('Error in waiting room:', error);
        navigate('/');
      }
    };

    checkGameStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          {isChecking ? (
            <div className="text-[#8C8376] text-lg">Checking game status...</div>
          ) : (
            <>
              <h1 className="text-[clamp(24px,6.5vw,40px)] font-extrabold text-[#F44336] leading-tight">
                your table is<br/>almost ready...
              </h1>
              
              <div className="mt-8 text-[#8C8376] text-lg">
                Game Code: <span className="font-semibold text-[#F44336]">{gameCode}</span>
              </div>
              
              {restaurantName && (
                <div className="mt-2 text-[#8C8376] text-sm">
                  {restaurantName}
                </div>
              )}
              
              <div className="mt-12 text-[#8C8376] text-sm">
                Waiting for host to start the game...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
