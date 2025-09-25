# Architecture Instructions for inspirasi-app

## 📱 Indonesian Marine Weather Early Warning System

### **MVP Feature Set (Phase 1)**
Focus on core functionality first:

1. **Weather Display** (no auth required)
   - Current conditions card
   - 7-day forecast carousel
   - Marine conditions (waves, wind, tides)

2. **Location Services**
   - GPS-based weather detection
   - Manual location search with BMKG codes

3. **Alerts System**
   - Critical weather warnings
   - Marine safety alerts
   - Push notifications

4. **Basic Navigation**
   - Bottom tabs: Home, Forecasts, Library
   - Profile dropdown in header
   - Expo Router file-based routing

---

## 🏗️ Project Structure (Expo Router)

```
/app
  /_layout.tsx              # Root layout with auth provider
  /(tabs)
    /_layout.tsx            # Bottom tabs layout
    /index.tsx              # Home screen
    /forecasts
      /_layout.tsx          # 5-tab layout (Wind, Currents, Waves, Weather, Tides)
      /index.tsx            # Default forecast tab
      /wind.tsx
      /currents.tsx
      /waves.tsx
      /weather.tsx
      /tides.tsx
    /library.tsx            # Reports and alerts archive
  /(auth)
    /_layout.tsx            # Auth layout
    /login.tsx
    /register.tsx
  /settings.tsx             # Full page settings (not in tabs)

/src
  /components
    /common
      Header.tsx            # Scrollable header with search + profile dropdown
      WeatherCard.tsx       # Material Design 3 cards
      AlertCard.tsx         # Expandable alert cards
      LoadingSpinner.tsx
    /weather
      CurrentConditions.tsx
      ForecastCarousel.tsx
      MarineConditions.tsx
    /reports
      ReportCard.tsx        # Fisherman observation cards
      ReportForm.tsx        # FAB form for adding reports
  /services
    /api
      bmkgService.ts        # BMKG weather API
      weatherCache.ts       # Offline caching
    /firebase
      config.ts
      auth.ts
    /location
      locationService.ts    # GPS + location codes
  /hooks
    useWeatherData.ts       # React Query weather data
    useLocation.ts          # Location management
    useAuth.ts              # Authentication state
  /constants
    locationCodes.ts        # Indonesian city codes
    colors.ts               # Blue Material Design 3 theme
```

---

## 🎨 Design System (Google Play Store Style)

### **Material Design 3 with Blue Theme**
- Primary: #1976D2 (light) / #1565C0 (dark)
- Card-based layouts with 8dp elevation
- 16dp screen margins, 8dp card padding
- Google Play Store sectioning style

### **Navigation Pattern**
- **Header**: Non-sticky, scrolls with content
  - Left: App logo
  - Center: Search bar (location search)
  - Right: Profile icon with dropdown
- **Bottom Tabs**: Home, Forecasts, Library
- **Profile Dropdown**: Profile, Settings, Notifications, Auth/Logout

---

## 👥 User Roles Architecture

### **Guest Users** (no auth required)
- Can view all weather data
- Can browse fisherman reports
- Cannot create reports
- Redirected to login when trying to add reports

### **Fishermen** (authenticated)
- All guest permissions
- Can create observation reports
- Access to report history
- Targeted marine alerts

---

## 📱 Screen Specifications

### **Home Screen (/app/(tabs)/index.tsx)**
- Location header with GPS icon
- Current conditions card
- 7-day forecast carousel (horizontal scroll)
- Alerts section (expandable cards)
- Fisherman reports feed (vertical cards)

### **Forecasts Screen (/app/(tabs)/forecasts/_layout.tsx)**
- 5 horizontal sub-tabs: Wind, Currents, Waves, Weather, Tides
- Each tab shows 7-day overview + today details
- Location selector at top
- Charts/visualizations for each type

### **Library Screen (/app/(tabs)/library.tsx)**
- Default: Observation reports feed
- Sort controls (newest/oldest)
- FAB for adding reports (fishermen only)
- Tabs: Reports Feed | Report History | Alerts Archive

### **Settings Screen (/app/settings.tsx)**
- Full page, Google Play Store style
- Account section, Preferences, Notifications, Data & Privacy

---

## 🔄 Data Flow Architecture

### **State Management**
- React Context for authentication
- React Query for server state
- AsyncStorage for offline persistence
- Local component state with useState

### **Offline-First Approach**
- Cache weather data for 3 hours
- Marine data for 6 hours
- Reports for 24 hours
- Auto-sync when connection restored

---

## 🚀 Critical Success Factors

### **Phase 1 Must-Haves**
1. Expo Router navigation working
2. BMKG API integration with caching
3. Material Design 3 blue theme
4. Basic push notifications
5. GPS location detection
6. Offline functionality

### **Performance Targets**
- App load: <3 seconds
- Screen transitions: <500ms
- API responses: <2 seconds with loading states
- Smooth scroll on all feeds

---

## 📋 Attribution Requirements

**MANDATORY**: Display "Data cuaca dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)" in app footer and about section.
