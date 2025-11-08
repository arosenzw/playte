import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Mixing() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigationTriggeredRef = useRef(false);

  useEffect(() => {
    const roomId = localStorage.getItem('currentRoomId');

    if (!roomId) {
      setError('We could not find your game. Please return to the home screen.');
      setIsChecking(false);
      return;
    }

    let isActive = true;

    const evaluateCompletion = async () => {
      try {
        setError(null);

        const [{ data: playersData, error: playersError }, { data: ratingsData, error: ratingsError }] =
          await Promise.all([
            supabase.from('players').select('id').eq('game_table_id', roomId),
            supabase.from('ratings').select('player_id, total_dishes').eq('game_table_id', roomId),
          ]);

        if (!isActive) {
          return;
        }

        if (playersError) {
          console.error('Error loading players for completion check:', playersError);
          setError('Unable to load player information. Retrying…');
          return;
        }

        if (ratingsError) {
          console.error('Error loading ratings for completion check:', ratingsError);
          setError('Unable to load rating information. Retrying…');
          return;
        }

        const totalPlayers = playersData?.length || 0;
        const submissionMap = new Map();

        ratingsData?.forEach((rating) => {
          const current = submissionMap.get(rating.player_id) || { count: 0, expected: rating.total_dishes || 0 };
          submissionMap.set(rating.player_id, {
            count: current.count + 1,
            expected: rating.total_dishes || current.expected,
          });
        });

        const completedPlayers = playersData?.filter((player) => {
          const info = submissionMap.get(player.id);
          if (!info) return false;
          if (info.expected > 0) {
            return info.count >= info.expected;
          }
          return info.count > 0;
        }).length || 0;

        setPlayerCount(totalPlayers);
        setSubmittedCount(completedPlayers);
        setLastUpdated(new Date());
        setIsChecking(false);

        if (
          totalPlayers > 0 &&
          completedPlayers >= totalPlayers &&
          !navigationTriggeredRef.current
        ) {
          navigationTriggeredRef.current = true;
          navigate('/results');
        }
      } catch (evaluationError) {
        if (!isActive) return;
        console.error('Unexpected error while evaluating completion:', evaluationError);
        setError('Something went wrong while checking progress. Retrying…');
      }
    };

    evaluateCompletion();

    const pollInterval = setInterval(() => {
      evaluateCompletion();
    }, 3000);

    const channel = supabase
      .channel(`ratings-status-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ratings', filter: `game_table_id=eq.${roomId}` },
        () => {
          evaluateCompletion();
        }
      )
      .subscribe();

    return () => {
      isActive = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF3B30]">
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FF3B30] px-8 pt-48 pb-40 text-center text-white">
          <h1 className="text-[clamp(24px,6.5vw,40px)] font-semibold leading-snug">mixing up<br/>your flavors…</h1>

          <style>{`
            @keyframes gentle-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .gentle-bounce { animation: gentle-bounce 1.6s ease-in-out infinite; }
          `}</style>

          <div className="mt-14 flex justify-center">
            <img src="/mixing.png" alt="mixing bowl and whisk" className="gentle-bounce w-[140px] h-auto" />
          </div>

          <div className="mt-10 text-sm text-white/80">
            {error ? (
              <div>{error}</div>
            ) : (
              <>
                <div>
                  Waiting for everyone to finish…{' '}
                  {playerCount > 0 ? `${submittedCount} of ${playerCount} players ready` : ''}
                </div>
                {lastUpdated && (
                  <div className="text-xs text-white/60 mt-2">
                    Last checked {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                )}
                {isChecking && !error && (
                  <div className="text-xs text-white/60 mt-2">Updating status…</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mixing;


