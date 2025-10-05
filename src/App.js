import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NameEntry from './pages/NameEntry';
import JoinGame from './pages/JoinGame';
import WaitingRoom from './pages/WaitingRoom';
import Restaurant from './pages/Restaurant';
import DishEntry from './pages/DishEntry';
import GatherAround from './pages/GatherAround';
import Ranking from './pages/Ranking';
import Mixing from './pages/Mixing';
import Results from './pages/Results';
import FlavorJourney from './pages/FlavorJourney';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/name" element={<NameEntry />} />
      <Route path="/joinGame" element={<JoinGame />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/dish" element={<DishEntry />} />
      <Route path="/gatherAround" element={<GatherAround />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mixing" element={<Mixing />} />
      <Route path="/results" element={<Results />} />
      <Route path="/flavorJourney" element={<FlavorJourney />} />
    </Routes>
  );
}

export default App;
