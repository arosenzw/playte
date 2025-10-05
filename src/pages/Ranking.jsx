import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
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
  const [items, setItems] = useState(dishes);

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
    
    setItems((items) => {
      const oldIndex = items.findIndex((item) => item === active.id);
      const newIndex = items.findIndex((item) => item === over.id);
      
      // Debug logging to see what's happening
      console.log('Drag:', { activeId: active.id, overId: over.id, oldIndex, newIndex });
      
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setDishes(items);
    navigate('/mixing');
  };

  return (
    <div className="min-h-screen bg-[#FEF5E6] flex flex-col" style={{minHeight: '100dvh'}}>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[540px]">
          <div className="rounded-[36px] bg-[#FEF5E6] px-6 md:px-8 pt-12 pb-6 text-center">
            <h1 className="text-[clamp(22px,6vw,36px)] font-extrabold text-[#F44336]">rank your playtes</h1>
            <p className="text-[#8C8376] mt-2 mb-8">favorite to least favorite</p>

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
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="max-w-[540px] mx-auto">
          <form onSubmit={submit}>
            <button
              type="submit"
              className="w-full rounded-full bg-[#F27E7E] hover:brightness-95 text-white text-2xl font-semibold py-4"
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


