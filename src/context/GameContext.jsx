import React, { createContext, useContext, useMemo, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [dishes, setDishes] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');

  const value = useMemo(
    () => ({ 
      dishes, 
      setDishes, 
      restaurantName, 
      setRestaurantName,
      restaurantLocation,
      setRestaurantLocation
    }),
    [dishes, restaurantName, restaurantLocation]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}


