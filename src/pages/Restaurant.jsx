import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

function Restaurant() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState('');
  const { setRestaurantName, setRestaurantLocation, setDishes } = useGame();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Clear dishes when entering this page (user is starting over)
  useEffect(() => {
    setDishes([]);
  }, [setDishes]);

  // Initialize Google Places Autocomplete (with fallback)
  useEffect(() => {
    const initializeAutocomplete = async () => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      console.log('🔍 Checking Google Maps API key...');
      console.log('API Key exists:', !!apiKey);
      console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        console.log('❌ Google Maps API key not configured, using fallback autocomplete');
        return;
      }

      try {
        console.log('🚀 Loading Google Maps API...');
        
        // Load Google Maps script
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log('✅ Google Maps API loaded successfully!');
            initializeAutocompleteWidget();
          };
          
          script.onerror = () => {
            console.error('❌ Error loading Google Maps script');
          };
          
          document.head.appendChild(script);
        } else {
          initializeAutocompleteWidget();
        }
        
      } catch (error) {
        console.error('❌ Error loading Google Places:', error);
      }
    };

    const initializeAutocompleteWidget = () => {
      if (inputRef.current && window.google) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['restaurant', 'food'],
          fields: ['name', 'formatted_address', 'place_id']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          console.log('📍 Place selected:', place);
          if (place.name) {
            setRestaurant(place.name);
            // Store the formatted address as location
            if (place.formatted_address) {
              setRestaurantLocation(place.formatted_address);
              console.log('📍 Location stored:', place.formatted_address);
            }
          }
        });
        
        console.log('✅ Google Places Autocomplete initialized!');
      }
    };

    initializeAutocomplete();
  }, [setRestaurantLocation]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setRestaurantName(restaurant.trim());
    navigate('/dish');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF5E6]" style={{minHeight: '100dvh'}}>
      <div className="w-full max-w-[420px] mx-auto px-6 py-10">
        <div className="rounded-[36px] bg-[#FEF5E6] px-8 pt-16 pb-12 text-center">
          <h1 className="text-[clamp(20px,6.5vw,36px)] leading-tight font-extrabold text-[#F44336] mb-8 text-center whitespace-nowrap">where are you dining?</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                placeholder="search for a restaurant"
                className="w-full rounded-xl bg-[#F8DDA5] placeholder-[#C9B68F] text-[#7A6F5E] text-lg px-5 py-3 border border-[#E7C88F] focus:outline-none focus:ring-2 focus:ring-[#F7C970] text-center placeholder:text-center"
                autoComplete="off"
              />
              
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#FF3B30] enabled:hover:brightness-95 text-white text-xl font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!restaurant.trim()}
            >
              next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Restaurant;


