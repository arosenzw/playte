"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Dish = { id: string; name: string };

function SortableItem({ dish, onRemove }: { dish: Dish; onRemove?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: dish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-2xl px-4 py-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-[#979797] mr-3 touch-none cursor-grab active:cursor-grabbing flex-shrink-0"
        aria-label="drag to reorder"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <rect y="0" width="20" height="2.5" rx="1.25" fill="currentColor" />
          <rect y="5.75" width="20" height="2.5" rx="1.25" fill="currentColor" />
          <rect y="11.5" width="20" height="2.5" rx="1.25" fill="currentColor" />
        </svg>
      </button>
      <span className="flex-1 text-[#646464] text-base font-medium">{dish.name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#979797] hover:text-[#646464] ml-3 text-xl leading-none flex-shrink-0"
          aria-label={`Remove ${dish.name}`}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function RankPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [addingDish, setAddingDish] = useState(false);
  const [newDish, setNewDish] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);
  const confirmingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    const playerId = sessionStorage.getItem("playerId");
    fetch(`/api/session/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDishes(data.dishes ?? []);
setIsHost(!!playerId && data.hostPlayerId === playerId);
      });
  }, [id]);

  useEffect(() => {
    if (addingDish) addInputRef.current?.focus();
  }, [addingDish]);

  // Realtime: new dish added by host
  useEffect(() => {
    const supabase = createClient();
    const playerId = sessionStorage.getItem("playerId");

    const channel = supabase
      .channel(`rank-dishes:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dishes", filter: `session_id=eq.${id}` },
        (payload) => {
          const newDish = { id: payload.new.id as string, name: payload.new.name as string };
          setDishes((prev) => prev.some((d) => d.id === newDish.id) ? prev : [...prev, newDish]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "dishes", filter: `session_id=eq.${id}` },
        (payload) => {
          if (payload.new.deleted_at) {
            setDishes((prev) => prev.filter((d) => d.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDishes((prev) => {
        const oldIndex = prev.findIndex((d) => d.id === active.id);
        const newIndex = prev.findIndex((d) => d.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  async function removeDish(dishId: string) {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    const playerId = sessionStorage.getItem("playerId");
    const guestToken = sessionStorage.getItem("guestToken");
    await fetch(`/api/session/${id}/dishes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishId, playerId, guestToken }),
    });
  }

  async function confirmAddDish() {
    if (confirmingRef.current) return;
    const name = newDish.trim();
    if (!name) { setAddingDish(false); return; }

    confirmingRef.current = true;
    const playerId = sessionStorage.getItem("playerId");
    const guestToken = sessionStorage.getItem("guestToken");

    const res = await fetch(`/api/session/${id}/dishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, playerId, guestToken }),
    });

    if (res.ok) {
      const dish = await res.json();
      setDishes((prev) => prev.some((d) => d.id === dish.id) ? prev : [...prev, dish]);
    }

    setNewDish("");
    setAddingDish(false);
    confirmingRef.current = false;
  }

  async function handleSubmit() {
    if (submitting || dishes.length === 0) return;
    setSubmitting(true);

    const playerId = sessionStorage.getItem("playerId");
    const guestToken = sessionStorage.getItem("guestToken");

    const rankings = dishes.map((d, i) => ({ dishId: d.id, rankPosition: i + 1 }));

    const res = await fetch(`/api/session/${id}/rank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, guestToken, rankings }),
    });

    if (res.ok) {
      router.replace(`/session/${id}/loading`);
    } else {
      setSubmitting(false);
    }
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-12">
      <Image src="/logo.png" alt="playte" width={70} height={70} priority />

      <div className="w-full max-w-sm mt-6 mb-4 text-center flex-shrink-0">
        <h1 className="text-[#FE392D] text-3xl font-bold">rank your dishes</h1>
        <p className="text-[#9CA3AF] italic text-sm mt-1">
          drag to reorder (favorite at the top)
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            {dishes.map((dish, i) => (
              <div key={dish.id} className="flex items-center gap-3">
                <span className="text-[#979797] text-sm font-semibold w-5 flex-shrink-0 text-right">
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <SortableItem dish={dish} onRemove={isHost ? () => removeDish(dish.id) : undefined} />
                </div>
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {isHost && (
          addingDish ? (
            <div className="relative">
              <input
                ref={addInputRef}
                type="text"
                value={newDish}
                onChange={(e) => setNewDish(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmAddDish(); if (e.key === "Escape") setAddingDish(false); }}
                onBlur={confirmAddDish}
                placeholder="dish name"
                maxLength={150}
                className="w-full bg-[#FFF8E8] border-2 border-[#FCCC75] rounded-2xl px-4 pr-14 py-4 text-[#4B4B4B] text-base font-medium outline-none"
              />
              <button
                onMouseDown={(e) => { e.preventDefault(); confirmAddDish(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FCCC75]/50 text-[#6B7280] text-2xl font-bold flex items-center justify-center"
                aria-label="Add dish"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingDish(true)}
              className="text-[#9CA3AF] italic text-base text-center py-2"
            >
              add dish
            </button>
          )
        )}
      </div>

      <div className="w-full max-w-sm py-6 flex-shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitting || dishes.length === 0}
          className={`w-full text-white text-2xl font-semibold py-5 rounded-full transition-colors ${
            dishes.length > 0 ? "bg-[#FE392D]" : "bg-[#F88888]"
          }`}
        >
          {submitting ? "submitting..." : "submit"}
        </button>
      </div>
    </main>
  );
}
