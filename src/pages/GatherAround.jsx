import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { supabase } from '../lib/supabase';

function GatherAround() {
  const navigate = useNavigate();
  const { restaurantName, restaurantLocation, dishes } = useGame();
  const [gameCode, setGameCode] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const roomCreatedRef = useRef(false);
  const playerCountRef = useRef(0);

  // Keep ref in sync with state
  useEffect(() => {
    playerCountRef.current = playerCount;
  }, [playerCount]);

  // Generate a random 5-digit code
  const generateGameCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Create a new room when component mounts
  useEffect(() => {
    const createRoom = async () => {
      // Check if room already exists to prevent duplicate creation
      if (roomCreatedRef.current) {
        console.log('Room already created, skipping creation');
        return;
      }

      roomCreatedRef.current = true;
      setIsCreating(true);
      
      try {
        // Generate a unique 5-digit code
        let code = generateGameCode();
        let isUnique = false;
        
        // Keep generating until we get a unique code
        while (!isUnique) {
          const { data: existingRoom } = await supabase
            .from('game_tables')
            .select('code')
            .eq('code', code)
            .single();
          
          if (!existingRoom) {
            isUnique = true;
          } else {
            code = generateGameCode();
          }
        }

        // First, insert or get the restaurant
        let restaurantId = null;
        if (restaurantName && restaurantName.trim()) {
          // Try to find existing restaurant first (case-insensitive)
          const { data: existingRestaurant } = await supabase
            .from('restaurants')
            .select('id, location')
            .ilike('name', restaurantName.trim())
            .single();

          if (existingRestaurant) {
            restaurantId = existingRestaurant.id;
            console.log('✅ Found existing restaurant:', existingRestaurant);
          } else {
            // Insert new restaurant with location
            const { data: newRestaurant, error: restaurantError } = await supabase
              .from('restaurants')
              .insert({
                name: restaurantName.trim(),
                location: restaurantLocation || null
              })
              .select()
              .single();

            if (restaurantError) {
              console.error('Error creating restaurant:', restaurantError);
            } else {
              restaurantId = newRestaurant.id;
              console.log('✅ Created new restaurant:', newRestaurant);
            }
          }
        }

        // Insert new room into game_tables
        const { data: roomData, error: roomError } = await supabase
          .from('game_tables')
          .insert({
            code: code,
            restaurant_id: restaurantId,
            restaurant_name: restaurantName || 'Unknown Restaurant',
            is_active: true
          })
          .select()
          .single();

        if (roomError) {
          console.error('Error creating room:', roomError);
          return;
        }

        // Store room data
        setGameCode(code);
        setRoomId(roomData.id);
        
        // Store room_id in localStorage
        localStorage.setItem('currentRoomId', roomData.id);
        localStorage.setItem('currentGameCode', code);
        
        // Create dishes for this room (with global dish linking)
        if (dishes && dishes.length > 0) {
          const dishInserts = [];
          
          for (const dishName of dishes) {
            // Check if global dish already exists for this restaurant (case-insensitive)
            const { data: existingGlobalDish } = await supabase
              .from('global_dishes')
              .select('id, name, avg_rank, total_ratings')
              .eq('restaurant_id', restaurantId)
              .ilike('name', dishName.trim())
              .single();
            
            let globalDishId = null;
            
            if (existingGlobalDish) {
              // Global dish exists - use it
              globalDishId = existingGlobalDish.id;
              console.log(`✅ Found existing global dish: ${existingGlobalDish.name} (ID: ${globalDishId})`);
            } else {
              // Create new global dish
              const { data: newGlobalDish, error: globalDishError } = await supabase
                .from('global_dishes')
                .insert({
                  restaurant_id: restaurantId,
                  name: dishName.trim()
                })
                .select()
                .single();
              
              if (globalDishError) {
                console.error('Error creating global dish:', globalDishError);
              } else {
                globalDishId = newGlobalDish.id;
                console.log(`🆕 Created new global dish: ${dishName.trim()} (ID: ${globalDishId})`);
              }
            }
            
            // Create game-specific dish entry linked to global dish
            dishInserts.push({
              game_table_id: roomData.id,
              restaurant_id: restaurantId,
              global_dish_id: globalDishId,
              name: dishName.trim()
            });
          }
          
          // Insert game-specific dishes
          const { error: dishesError } = await supabase
            .from('dishes')
            .insert(dishInserts);
          
          if (dishesError) {
            console.error('Error creating dishes:', dishesError);
          } else {
            console.log('Dishes created successfully');
          }
        }
        
        console.log('Room created successfully:', roomData);
        
      } catch (error) {
        console.error('Error creating room:', error);
      } finally {
        setIsCreating(false);
      }
    };

    createRoom();
  }, [restaurantName, restaurantLocation, dishes]); // Include dependencies but use ref to prevent duplicate creation

  // Set up real-time subscription for player count when room is created
  useEffect(() => {
    if (!roomId) return;

    const setupPlayerCountSubscription = async () => {
      // Get initial player count
      const { count, error: countError } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('game_table_id', roomId);

      if (!countError && count !== null) {
        console.log('Initial player count:', count);
        setPlayerCount(count);
        playerCountRef.current = count;
      }

      // Set up polling as backup to ensure count updates
      const pollInterval = setInterval(async () => {
        const { count: currentCount, error: pollError } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true })
          .eq('game_table_id', roomId);

        if (!pollError && currentCount !== null && currentCount !== playerCountRef.current) {
          console.log('Player count updated via polling:', currentCount);
          setPlayerCount(currentCount);
          playerCountRef.current = currentCount;
        }
      }, 3000); // Check every 3 seconds

      // Set up real-time subscription for new players
      const subscription = supabase
        .channel('player_count')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `game_table_id=eq.${roomId}`
        }, (payload) => {
          console.log('New player joined via real-time:', payload.new);
          setPlayerCount(prev => {
            console.log('Updating count from', prev, 'to', prev + 1);
            playerCountRef.current = prev + 1;
            return prev + 1;
          });
        })
        .subscribe();

      // Cleanup subscription and interval on unmount
      return () => {
        subscription.unsubscribe();
        clearInterval(pollInterval);
      };
    };

    setupPlayerCountSubscription();
  }, [roomId]);

  const handleStartGame = async () => {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    try {
      // Get player name from localStorage (this should be the host's original name)
      // We'll use a different key to avoid conflicts with joined players
      const hostName = localStorage.getItem('hostPlayerName') || localStorage.getItem('playerName') || 'Host';
      
      // Insert player into players table
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          game_table_id: roomId,
          name: hostName,
          is_host: true,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (playerError) {
        console.error('Error creating player:', playerError);
        return;
      }

      // Store player ID in localStorage
      localStorage.setItem('currentPlayerId', playerData.id);
      
      // Navigate to ranking page
      navigate('/ranking');
      
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[clamp(22px,6vw,36px)] font-extrabold text-[#F44336]">gather around</h1>
          <p className="text-[#8C8376] mt-3">share the game pin with your table to get everyone playing</p>

          <div className="my-16">
            {isCreating || !gameCode ? (
              <div className="text-[#8C8376] text-lg">Creating room...</div>
            ) : (
              <div className="text-[#F44336] font-semibold" style={{fontSize: 'clamp(48px, 18vw, 120px)'}}>
                {gameCode}
              </div>
            )}
          </div>

          <div className="text-[#8C8376] mb-4">
            {playerCount} {playerCount === 1 ? 'person' : 'people'} joined your playte
          </div>

          <button
            onClick={handleStartGame}
            disabled={isCreating || !roomId}
            className="w-full rounded-full bg-[#F27E7E] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'start game'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GatherAround;


