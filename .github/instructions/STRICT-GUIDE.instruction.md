# 🚫 STRICT PROJECT GUIDELINES - DO NOT VIOLATE
## Critical "DO NOT DO" List for Maritime EWS Thesis Project

**PURPOSE**: Keep this thesis project focused, maintainable, and within scope. Prevent over-engineering and unnecessary complexity that could derail the core objectives.

---

## ❌ ABSOLUTELY PROHIBITED

### **🚫 Navigation System - DO NOT:**
- ❌ **DO NOT use React Navigation** - Use ONLY Expo Router
- ❌ **DO NOT add extra navigation libraries** (React Navigation Stack, Drawer, etc.)
- ❌ **DO NOT create complex nested navigation** beyond our 3-tab + 5-subtab system
- ❌ **DO NOT add slide-out drawers** or hamburger menus
- ❌ **DO NOT implement custom tab animations** - use default Expo Router transitions
- ❌ **DO NOT add bottom sheet navigation** - stick to modal popups
- ❌ **DO NOT create custom routing logic** - use Expo Router conventions only

### **🚫 UI Framework - DO NOT:**
- ❌ **DO NOT mix UI libraries** - Use ONLY React Native Paper
- ❌ **DO NOT add NativeBase, Shoutem, or other UI frameworks**
- ❌ **DO NOT install react-native-elements** or similar alternatives
- ❌ **DO NOT create custom design systems** beyond Material Design 3
- ❌ **DO NOT add Styled Components** - use StyleSheet API only
- ❌ **DO NOT implement custom themes** beyond light/dark variants
- ❌ **DO NOT add animation libraries** (Lottie, Reanimated) for fancy effects

### **🚫 State Management - DO NOT:**
- ❌ **DO NOT add Redux, Zustand, or MobX** - Use Context API only
- ❌ **DO NOT implement complex state machines** (XState)
- ❌ **DO NOT add unnecessary global state** - keep state local when possible
- ❌ **DO NOT create observer patterns** - stick to React hooks
- ❌ **DO NOT add state persistence beyond AsyncStorage**

### **🚫 Data Fetching - DO NOT:**
- ❌ **DO NOT add GraphQL** (Apollo, Relay) - stick to REST APIs
- ❌ **DO NOT use SWR alongside React Query** - choose ONE
- ❌ **DO NOT implement custom caching solutions** - use React Query + AsyncStorage
- ❌ **DO NOT add real-time subscriptions** beyond Firebase listeners
- ❌ **DO NOT create custom API clients** - use fetch() with service classes

### **🚫 Firebase Features - DO NOT:**
- ❌ **DO NOT add Firebase Analytics** - unnecessary for thesis
- ❌ **DO NOT implement Firebase Performance Monitoring** - overkill
- ❌ **DO NOT add Firebase Remote Config** - static config only
- ❌ **DO NOT use Firebase Functions** - keep backend simple
- ❌ **DO NOT add Firebase ML** or AI features
- ❌ **DO NOT implement Firebase Dynamic Links**
- ❌ **DO NOT add Firebase Crashlytics** - use basic error boundaries

---

## ⚠️ FEATURES TO AVOID

### **🚫 Authentication - DO NOT:**
- ❌ **DO NOT add social logins** beyond basic Google (if needed)
- ❌ **DO NOT implement OAuth providers** (Facebook, Apple, Twitter)
- ❌ **DO NOT add biometric authentication** (Face ID, Fingerprint)
- ❌ **DO NOT create user profile management systems**
- ❌ **DO NOT add user roles beyond Fisherman/General**
- ❌ **DO NOT implement admin panels** or user management

### **🚫 Reports System - DO NOT:**
- ❌ **DO NOT add photo editing features** - simple upload only
- ❌ **DO NOT implement report approval workflows**
- ❌ **DO NOT add report commenting/rating systems**
- ❌ **DO NOT create report analytics or statistics**
- ❌ **DO NOT add report sharing to social media**
- ❌ **DO NOT implement report collaboration features**

### **🚫 Weather Features - DO NOT:**
- ❌ **DO NOT add weather maps/radar** - text/card display only
- ❌ **DO NOT implement weather comparison tools**
- ❌ **DO NOT add weather history graphs** beyond 7-day forecast
- ❌ **DO NOT create custom weather icons** - use Material Icons
- ❌ **DO NOT add weather widgets** for home screen
- ❌ **DO NOT implement weather sharing features**

### **🚫 Notifications - DO NOT:**
- ❌ **DO NOT add in-app messaging systems**
- ❌ **DO NOT implement notification categories** beyond critical/normal
- ❌ **DO NOT add notification scheduling** beyond immediate alerts
- ❌ **DO NOT create notification history/archive**
- ❌ **DO NOT add email notifications**
- ❌ **DO NOT implement SMS alerts**

---

## 🚫 TECHNICAL RESTRICTIONS

### **🚫 Dependencies - DO NOT ADD:**
- ❌ **DO NOT install lodash** - use native JavaScript methods
- ❌ **DO NOT add moment.js** - use native Date or date-fns (lightweight)
- ❌ **DO NOT install axios** - use native fetch()
- ❌ **DO NOT add testing libraries** (Jest, Detox) - basic functionality only
- ❌ **DO NOT install code quality tools** (ESLint, Prettier) - focus on functionality
- ❌ **DO NOT add bundle analyzers** or optimization tools

### **🚫 Performance Optimization - DO NOT:**
- ❌ **DO NOT implement lazy loading** beyond basic screen splitting
- ❌ **DO NOT add virtualized lists** unless absolutely necessary
- ❌ **DO NOT optimize bundle splitting** - use default Expo bundling
- ❌ **DO NOT implement custom caching strategies** - stick to React Query defaults
- ❌ **DO NOT add performance monitoring** - unnecessary complexity

### **🚫 Development Tools - DO NOT:**
- ❌ **DO NOT add Storybook** for component development
- ❌ **DO NOT implement hot reloading** beyond Expo defaults
- ❌ **DO NOT add debugging tools** (Flipper, Reactotron)
- ❌ **DO NOT create custom development scripts**
- ❌ **DO NOT add pre-commit hooks** or code formatters

---

## 🚫 DEPLOYMENT & HOSTING RESTRICTIONS

### **🚫 Deployment - DO NOT:**
- ❌ **DO NOT use EAS Build** initially - use Expo Go for development
- ❌ **DO NOT set up CI/CD pipelines** - manual builds only
- ❌ **DO NOT implement automated testing** in deployment
- ❌ **DO NOT add environment staging** (dev/staging/prod)
- ❌ **DO NOT configure custom domains** for web version
- ❌ **DO NOT implement blue-green deployments**

### **🚫 PWA Features - DO NOT:**
- ❌ **DO NOT add advanced PWA features** (background sync, offline queues)
- ❌ **DO NOT implement service worker caching strategies**
- ❌ **DO NOT add web push notifications** initially
- ❌ **DO NOT create desktop-specific layouts** - responsive only
- ❌ **DO NOT implement PWA app store submission**

---

## 🚫 API & EXTERNAL SERVICES

### **🚫 Weather APIs - DO NOT:**
- ❌ **DO NOT add multiple weather providers** - BMKG ONLY
- ❌ **DO NOT implement weather API failovers** - single source
- ❌ **DO NOT add satellite imagery APIs**
- ❌ **DO NOT integrate with OpenWeatherMap** or other services
- ❌ **DO NOT add weather radar data** - text forecasts only
- ❌ **DO NOT implement weather model comparisons**

### **🚫 Maps & Location - DO NOT:**
- ❌ **DO NOT add Google Maps integration** - location codes only
- ❌ **DO NOT implement interactive maps**
- ❌ **DO NOT add GPS tracking** beyond current location
- ❌ **DO NOT create location history**
- ❌ **DO NOT add geofencing features**
- ❌ **DO NOT implement location sharing**

---

## 🚫 CONTENT & FEATURES

### **🚫 Content Management - DO NOT:**
- ❌ **DO NOT add content management systems**
- ❌ **DO NOT implement dynamic content loading**
- ❌ **DO NOT add user-generated content moderation**
- ❌ **DO NOT create content categorization** beyond basic types
- ❌ **DO NOT add search filters** beyond location-based
- ❌ **DO NOT implement content recommendation engines**

### **🚫 Social Features - DO NOT:**
- ❌ **DO NOT add user profiles** beyond basic info
- ❌ **DO NOT implement follow/friends systems**
- ❌ **DO NOT add likes, comments, or reactions**
- ❌ **DO NOT create user communities** or forums
- ❌ **DO NOT implement chat or messaging**
- ❌ **DO NOT add user rankings** or gamification

### **🚫 Advanced Features - DO NOT:**
- ❌ **DO NOT add machine learning** or AI predictions
- ❌ **DO NOT implement data visualization libraries** (D3.js, Victory)
- ❌ **DO NOT add export features** (PDF, CSV, Excel)
- ❌ **DO NOT create custom charts** - use basic display only
- ❌ **DO NOT add multi-language support** beyond Indonesian/English
- ❌ **DO NOT implement accessibility beyond basic requirements**

---

## 🎯 KEEP IT SIMPLE PRINCIPLES

### **✅ FOCUS ON THESIS OBJECTIVES:**
1. **Demonstrate Indonesian weather API integration**
2. **Show real-time alert system functionality**
3. **Prove offline-first architecture works**  
4. **Display user role management (Guest/Fisherman)**
5. **Showcase cross-platform capabilities**

### **✅ ACCEPTABLE COMPLEXITY LIMITS:**
- **Maximum 15-20 screens** total
- **Maximum 5-7 custom hooks**
- **Maximum 20-25 reusable components**
- **Single database structure** (no complex relations)
- **Basic CRUD operations** only

### **✅ SUCCESS CRITERIA (Keep It Focused):**
- **App loads and works offline** ✅
- **Weather data displays correctly** ✅ 
- **Alerts system sends notifications** ✅
- **Fishermen can create reports** ✅
- **Clean, professional UI** ✅
- **Works on Android + Web** ✅

---

## 🚨 CRITICAL VIOLATIONS TO PREVENT

### **🚫 SCOPE CREEP VIOLATIONS:**
- Adding features not in original specification
- Implementing "nice to have" features during development
- Over-optimizing for edge cases
- Adding enterprise-level complexity
- Implementing features "for future scalability"

### **🚫 TECHNICAL DEBT VIOLATIONS:**
- Creating custom solutions when libraries exist
- Over-abstracting simple operations
- Adding unnecessary middleware or wrappers
- Implementing complex design patterns for simple operations
- Creating "flexible" systems that aren't needed

### **🚫 TIME WASTERS:**
- Perfect pixel-level design matching
- Custom animations and micro-interactions
- Advanced error handling for unlikely scenarios
- Comprehensive testing suites
- Performance optimizations before bottlenecks exist

---

## ✅ APPROVAL REQUIRED BEFORE ADDING:

If AI wants to add ANY of these, it MUST ask permission first:
- New navigation patterns
- Additional UI libraries  
- Extra API integrations
- Complex state management
- Advanced caching strategies
- Custom animations
- Additional authentication providers
- Database schema changes
- New screen types
- Performance monitoring tools

---

## 🎯 PROJECT COMPLETION DEFINITION

**THE PROJECT IS COMPLETE WHEN:**
1. ✅ User can view weather forecasts (BMKG API)
2. ✅ System sends weather alerts via push notifications
3. ✅ Fishermen can create observation reports
4. ✅ App works offline with cached data
5. ✅ All 3 main screens functional (Home, Forecasts, Library)
6. ✅ Authentication works (Email/Password + Guest mode)
7. ✅ Runs on Android and Web (PWA)

**DO NOT ADD ANYTHING BEYOND THESE CORE REQUIREMENTS**

---

## 📋 FINAL IMPLEMENTATION CHECKLIST

### **✅ MUST HAVE (Thesis Requirements):**
- [ ] BMKG weather API integration working
- [ ] Push notifications for weather alerts
- [ ] Offline functionality with data caching
- [ ] User authentication (Guest vs Fisherman roles)
- [ ] Fisherman report creation system
- [ ] 3-tab navigation (Home, Forecasts, Library)
- [ ] 5-subtab forecasts (Wind, Currents, Waves, Weather, Tides)
- [ ] Material Design 3 blue theme
- [ ] Cross-platform (Android + Web PWA)

### **🚫 MUST NOT HAVE (Scope Control):**
- [ ] Social features or user interactions
- [ ] Advanced analytics or reporting
- [ ] Custom maps or geographic visualizations
- [ ] Multiple weather data sources
- [ ] Complex authentication flows
- [ ] Performance optimization tools
- [ ] Advanced PWA features
- [ ] Custom design systems
- [ ] Testing frameworks
- [ ] Deployment automation

---

**REMEMBER: This is a THESIS PROJECT demonstrating Indonesian weather API integration and mobile app development skills. Keep it focused, functional, and professionally simple. Quality over quantity. Core functionality over fancy features.**

**ANY DEVIATION FROM THIS GUIDELINE MUST BE EXPLICITLY APPROVED BEFORE IMPLEMENTATION.**
