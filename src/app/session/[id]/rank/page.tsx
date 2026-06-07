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

function SortableItem({ dish, onRemove, onSkip }: { dish: Dish; onRemove?: () => void; onSkip?: () => void }) {
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
      {/* Drag handle only — larger hit area, touch-none scoped here so scroll still works */}
      <span
        {...attributes}
        {...listeners}
        className="text-[#979797] mr-3 flex-shrink-0 touch-none cursor-grab active:cursor-grabbing p-2 -m-2"
        aria-label="drag to reorder"
      >
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
          <rect y="0" width="24" height="3" rx="1.5" fill="currentColor" />
          <rect y="7.5" width="24" height="3" rx="1.5" fill="currentColor" />
          <rect y="15" width="24" height="3" rx="1.5" fill="currentColor" />
        </svg>
      </span>
      <span className="flex-1 text-[#646464] text-base font-medium">{dish.name}</span>
      {onSkip && (
        <button
          onClick={onSkip}
          className="text-[#9CA3AF] hover:text-[#6B7280] ml-3 text-xl leading-none flex-shrink-0 font-bold"
          aria-label={`Didn't try ${dish.name}`}
        >
          −
        </button>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#FE392D]/50 hover:text-[#FE392D] ml-2 text-xl leading-none flex-shrink-0"
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
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [isHost, setIsHost] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [addingDish, setAddingDish] = useState(false);
  const [newDish, setNewDish] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);
  const confirmingRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  );

  useEffect(() => {
    const playerId = sessionStorage.getItem("playerId");
    fetch(`/api/session/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDishes(data.dishes ?? []);
        const host = !!playerId && data.hostPlayerId === playerId;
        setIsHost(host);
        if (host) setJoinCode(sessionStorage.getItem("joinCode"));
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

  const rankedDishes = dishes.filter((d) => !skipped.has(d.id));
  const skippedDishes = dishes.filter((d) => skipped.has(d.id));

  async function handleSubmit() {
    if (submitting || dishes.length === 0) return;
    setSubmitting(true);

    const playerId = sessionStorage.getItem("playerId");
    const guestToken = sessionStorage.getItem("guestToken");

    const rankings = rankedDishes.map((d, i) => ({ dishId: d.id, rankPosition: i + 1 }));

    const res = await fetch(`/api/session/${id}/rank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, guestToken, rankings, skipped: [...skipped] }),
    });

    if (res.ok) {
      router.replace(`/session/${id}/loading`);
    } else {
      setSubmitting(false);
    }
  }

  return (
    <main className="h-dvh bg-[#FFF8E8] flex flex-col items-center px-6 pt-4">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <Image src="/logo.png" alt="playte" width={32} height={32} priority />
        <h1 className="text-[#FE392D] text-xl font-bold">rank your dishes</h1>
      </div>

      <div className="w-full max-w-sm mb-2 text-center flex-shrink-0">
        <p className="text-[#9CA3AF] italic text-xs">
          drag to reorder (favorite at the top)
        </p>
        <div className="flex items-center justify-center gap-4 mt-1">
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <span className="text-[#9CA3AF] font-bold text-base leading-none">−</span> didn't try
          </span>
          {isHost && (
            <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <span className="text-[#FE392D]/50 text-base leading-none">×</span> remove dish
            </span>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rankedDishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            {rankedDishes.map((dish, i) => (
              <div key={dish.id} className="flex items-center gap-3">
                <span className="text-[#979797] text-sm font-semibold w-5 flex-shrink-0 text-right">
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <SortableItem
                    dish={dish}
                    onSkip={() => setSkipped((prev) => { const s = new Set(prev); s.add(dish.id); return s; })}
                    onRemove={isHost ? () => removeDish(dish.id) : undefined}
                  />
                </div>
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {skippedDishes.length > 0 && (
          <div className="mt-1">
            <p className="text-[#9CA3AF] text-xs italic text-center mb-2">didn't try</p>
            {skippedDishes.map((dish) => (
              <button
                key={dish.id}
                onClick={() => setSkipped((prev) => { const s = new Set(prev); s.delete(dish.id); return s; })}
                className="w-full bg-[#F3F4F6] border-2 border-[#E5E7EB] rounded-2xl px-4 py-3 text-[#9CA3AF] text-base text-left mb-2 flex items-center justify-between"
              >
                <span>{dish.name}</span>
                <span className="text-base ml-2">↩</span>
              </button>
            ))}
          </div>
        )}

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

      <div className="w-full max-w-sm py-6 flex-shrink-0 flex flex-col gap-3">
        {isHost && joinCode && (
          <button
            onClick={() => {
              const url = `${window.location.origin}/join/code?code=${joinCode}`;
              const text = `join my playte game! use code ${joinCode} or tap the link: ${url}`;
              if (navigator.share) navigator.share({ text });
              else navigator.clipboard.writeText(text);
            }}
            className="text-[#9CA3AF] italic text-sm text-center w-full"
          >
            invite via text
          </button>
        )}
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
