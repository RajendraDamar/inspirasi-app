```markdown
# Copilot Main Instructions for inspirasi-app

## Indonesian Marine Weather Early Warning System

This is the main routing document for the Copilot AI assistant to understand the complete system architecture and implementation for the inspirasi-app project.

## 📋 Instruction Files Structure

The project documentation is organized into the following specialized instruction files:

### 🏗️ Core System Files
- **`architecture.instruction.md`** - System architecture, project structure, and critical success factors
- **`configuration.instruction.md`** - Firebase setup, environment variables, dependencies, and app configuration
- **`services.instruction.md`** - API services, push notifications, location services, data sync, and performance monitoring
- **`components.instruction.md`** - React components, hooks, main app structure, and error handling
- **`deployment.instruction.md`** - Implementation steps and launch checklist

## 🎯 Project Overview

**inspirasi-app** is an Indonesian Marine Weather Early Warning System built with:
- **React Native + Expo** for cross-platform mobile development
- **Firebase** for backend services, authentication, and push notifications
- **BMKG API** for Indonesian weather and marine data
- **Offline-first architecture** with comprehensive caching
- **Role-based access control** (fishermen, guests, non-fishermen)

## 🚀 Quick Reference

### Primary Features
1. Weather display (current conditions, 7-day forecast, marine conditions)
2. Location services (GPS-based weather, manual location search)  
3. Alerts system (critical weather warnings, push notifications)
4. Offline mode (cache data, work without connection)
5. Fisherman reporting system (incident reports with role-based access)

### Technology Stack
- Frontend: React Native, Expo, React Native Paper
- Backend: Firebase (Auth, Firestore, Storage)
- APIs: BMKG (weather), Firebase (notifications)
- State Management: React Query, Context API
- Offline Support: AsyncStorage, React Query caching

## 🔄 How to Use These Instructions

1. **Start with `architecture.instruction.md`** to understand the overall system design
2. **Review `configuration.instruction.md`** for environment setup and dependencies
3. **Implement services from `services.instruction.md`** for core functionality
4. **Build UI components using `components.instruction.md`**
5. **Follow `deployment.instruction.md`** for implementation steps and launch

## ⚠️ Important Notes

- **Blue is the primary UI color** for both dark and light themes
- **Offline-first design** - always cache data and show stale data when offline
- **Firebase configuration is already provided** - use the exact keys specified
- **Role-based access**: fishermen can report incidents; guests can only view
- **Security is critical** - follow the security rules and environment variable guidelines

## 📱 Target Platforms

- **Primary**: Android (Google Play Store)
- **Secondary**: Web (PWA support)
- **Future**: iOS (with minimal code changes)

Read the specific instruction files for detailed implementation guidance and complete code examples.
```
