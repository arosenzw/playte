import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { supabase } from '../lib/supabase';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function Ranking() {
  const navigate = useNavigate();
  const { dishes, setDishes } = useGame();

  // Simple state - just the dish names
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is joining an existing game
  const isJoining = localStorage.getItem('isJoining') === 'true';
  const roomId = localStorage.getItem('currentRoomId');

  useEffect(() => {
    const loadDishes = async () => {
      if (isJoining && roomId) {
        // Check if host has started the game
        const { data: hostData, error: hostError } = await supabase
          .from('players')
          .select('id')
          .eq('game_table_id', roomId)
          .eq('is_host', true)
          .single();

        if (hostError && hostError.code !== 'PGRST116') {
          console.error('Error checking host status:', hostError);
        } else if (!hostData) {
          // Host hasn't started the game yet, redirect to waiting room
          navigate('/waitingRoom');
          return;
        }

        // Fetch dishes from existing room
        try {
          const { data: dishesData, error: dishesError } = await supabase
            .from('dishes')
            .select('name')
            .eq('game_table_id', roomId);

          if (dishesError) {
            console.error('Error fetching room dishes:', dishesError);
            // Fallback to context dishes
            setItems(dishes);
          } else {
            // Extract dish names from the room's dishes
            const roomDishes = dishesData?.map(dish => dish.name) || [];
            console.log('Loaded dishes from room:', roomDishes);
            setItems(roomDishes);
            setDishes(roomDishes); // Also update context
          }
        } catch (error) {
          console.error('Error loading room dishes:', error);
          // Fallback to context dishes
          setItems(dishes);
        }
      } else {
        // Use dishes from context (Start a game flow)
        console.log('Using dishes from context:', dishes);
        setItems(dishes);
      }
      setIsLoading(false);
    };

    loadDishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoining, roomId, navigate]); // Intentionally excluding dishes and setDishes to prevent re-runs

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex items-center justify-between rounded-2xl bg-[#F8DDA5] border border-[#E7C88F] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(231,200,143,0.4)]"
      >
        <span className="text-left text-[#4C463D] text-lg flex-1">{children}</span>
        <span
          ref={setActivatorNodeRef}
          {...listeners}
          className="text-[#8C8376] text-2xl md:text-3xl pl-2 cursor-grab touch-none select-none"
        >
          ≡
        </span>
      </li>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setItems((currentItems) => {
      const oldIndex = currentItems.findIndex((item) => item === active.id);
      const newIndex = currentItems.findIndex((item) => item === over.id);
      
      console.log('Drag:', { activeId: active.id, overId: over.id, oldIndex, newIndex });
      
      return arrayMove(currentItems, oldIndex, newIndex);
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    
    const roomId = localStorage.getItem('currentRoomId');
    const playerId = localStorage.getItem('currentPlayerId');
    
    if (!roomId || !playerId) {
      console.error('Missing room or player ID');
      navigate('/mixing');
      return;
    }

    try {
      // Get dish IDs for this room
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('id, name')
        .eq('game_table_id', roomId);

      if (dishesError) {
        console.error('Error fetching dishes:', dishesError);
        navigate('/mixing');
        return;
      }

      // Create mapping of dish names to IDs
      const dishNameToId = {};
      dishesData.forEach(dish => {
        dishNameToId[dish.name] = dish.id;
      });

      // Prepare ratings data
      const ratingsData = items.map((dishName, index) => ({
        game_table_id: roomId,
        player_id: playerId,
        dish_id: dishNameToId[dishName],
        rank: index + 1, // 1 = best, 2 = second best, etc.
        total_dishes: items.length
      }));

      // Delete any existing ratings for this player to avoid conflicts
      await supabase
        .from('ratings')
        .delete()
        .eq('player_id', playerId)
        .eq('game_table_id', roomId);

      // Insert new ratings
      const { error: ratingsError } = await supabase
        .from('ratings')
        .insert(ratingsData);

      if (ratingsError) {
        console.error('Error inserting ratings:', ratingsError);
        navigate('/mixing');
        return;
      }
      
      // Update context and navigate
      setDishes(items);
      navigate('/mixing');
      
    } catch (error) {
      console.error('Error submitting rankings:', error);
      navigate('/mixing');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF5E6] flex flex-col" style={{minHeight: '100dvh'}}>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[540px]">
          <div className="rounded-[36px] bg-[#FEF5E6] px-6 md:px-8 pt-12 pb-6 text-center">
            <h1 className="text-[clamp(22px,6vw,36px)] font-extrabold text-[#F44336]">rank your playtes</h1>
            <p className="text-[#8C8376] mt-2 mb-8">favorite to least favorite</p>

            {isLoading ? (
              <div className="text-[#8C8376] text-lg py-8">Loading dishes...</div>
            ) : (
              <>
                <div className="text-right text-[#8C8376] text-sm mb-3 pr-1">drag to rearrange</div>

                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <ul className="space-y-4">
                        {items.map((item) => (
                          <SortableItem key={item} id={item}>
                            {item}
                          </SortableItem>
                        ))}
                      </ul>
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="max-w-[540px] mx-auto">
          <form onSubmit={submit}>
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full rounded-full bg-[#F27E7E] hover:brightness-95 text-white text-2xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Ranking;


