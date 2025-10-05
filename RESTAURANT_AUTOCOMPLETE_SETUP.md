# Restaurant Autocomplete Setup

The Restaurant page now includes Google Places autocomplete for better restaurant discovery. Here's how to set it up:

## Google Maps API Setup

### 1. Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** and **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Add API Key to Environment Variables
Create a `.env` file in the root directory:

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Features
- **Restaurant autocomplete** - Suggests real restaurants as you type
- **Location-aware** - Shows restaurants based on user's location
- **Fallback support** - Works without API key (manual entry)
- **Mobile optimized** - Great experience on phones

### 4. Fallback Behavior
If no API key is configured, the input field will work as a regular text input, allowing users to manually enter restaurant names.

## Usage
1. Start typing a restaurant name
2. Select from the autocomplete suggestions
3. Or manually type the restaurant name
4. Click "Next" to continue

## Cost
Google Places API has a free tier with generous limits for small applications. Check [Google's pricing](https://developers.google.com/maps/billing-and-pricing) for details.
