# 🏗️ MISSING FEATURES IMPLEMENTATION GUIDE
## Add Critical Features to Complete Maritime EWS App

**PURPOSE**: Your repository is missing 70% of required features. This guide shows exactly what to implement.

---

## 🚨 MISSING CRITICAL FEATURES

### **❌ Feature Gap Analysis**

**Currently Implemented (30%)**:
- ✅ Basic BMKG API integration
- ✅ Simple HomeScreen weather display  
- ✅ Basic ReportsScreen form
- ✅ Firebase authentication setup
- ✅ AsyncStorage caching

**MISSING FEATURES (70%)**:
- ❌ 5-tab Forecasts system (Wind, Currents, Waves, Weather, Tides)
- ❌ Library screen with reports feed and archive
- ❌ Settings screen (Google Play Store style)
- ❌ Weather alerts and notifications system
- ❌ Profile dropdown navigation
- ❌ User role management (Guest vs Fisherman)
- ❌ Material Design 3 styling throughout
- ❌ Proper authentication screens
- ❌ Location search functionality
- ❌ Reports feed display and pagination

---

## 🎯 IMPLEMENTATION ROADMAP

### **1. Create 5-Tab Forecasts System**

**Step A: Create Forecasts Layout**
**File**: `app/(tabs)/forecasts/_layout.tsx`
```typescript
import { MaterialTopTabs } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';

const Tab = MaterialTopTabs.Navigator;

export default function ForecastsLayout() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 2,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none'
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 100 }
      }}
    >
      <Tab.Screen name="index" options={{ 
        title: 'Weather',
        tabBarIcon: ({ color }) => <MaterialIcons name="wb-sunny" size={16} color={color} />
      }} />
      <Tab.Screen name="wind" options={{ 
        title: 'Wind',
        tabBarIcon: ({ color }) => <MaterialIcons name="air" size={16} color={color} />
      }} />
      <Tab.Screen name="waves" options={{ 
        title: 'Waves',
        tabBarIcon: ({ color }) => <MaterialIcons name="waves" size={16} color={color} />
      }} />
      <Tab.Screen name="currents" options={{ 
        title: 'Currents',
        tabBarIcon: ({ color }) => <MaterialIcons name="trending-up" size={16} color={color} />
      }} />
      <Tab.Screen name="tides" options={{ 
        title: 'Tides',
        tabBarIcon: ({ color }) => <MaterialIcons name="timeline" size={16} color={color} />
      }} />
    </Tab.Navigator>
  );
}
```

**Step B: Create Individual Tab Files**
```bash
# Create all 5 forecast tab files
touch app/(tabs)/forecasts/index.tsx      # Weather tab
touch app/(tabs)/forecasts/wind.tsx       # Wind tab
touch app/(tabs)/forecasts/waves.tsx      # Waves tab
touch app/(tabs)/forecasts/currents.tsx   # Currents tab
touch app/(tabs)/forecasts/tides.tsx      # Tides tab
```

**Step C: Implement Weather Tab Example**
**File**: `app/(tabs)/forecasts/index.tsx`
```typescript
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useWeatherData } from '../../../src/hooks/useWeatherData';
import LocationSelector from '../../../src/components/common/LocationSelector';

export default function WeatherForecastTab() {
  const theme = useTheme();
  const { weather, isLoading } = useWeatherData();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Location Selector */}
      <LocationSelector />

      {/* Today's Detailed Weather */}
      <Card style={{ margin: 16, elevation: 2 }}>
        <Card.Title 
          title="Today's Weather Detail"
          subtitle="8 forecasts per day (3-hour intervals)"
          left={(props) => <Avatar.Icon {...props} icon="wb-sunny" />}
        />
        <Card.Content>
          {/* 8 time slots for today */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weather?.forecasts?.slice(0, 8).map((forecast, index) => (
              <HourlyForecastCard key={index} forecast={forecast} />
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* 7-Day Weather Overview */}
      <Card style={{ margin: 16, elevation: 2 }}>
        <Card.Title title="7-Day Weather Forecast" />
        <Card.Content>
          {weather?.forecasts?.map((forecast, index) => (
            <WeeklyForecastRow key={index} forecast={forecast} />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
```

---

### **2. Transform ReportsScreen → Library**

**Current Issue**: ReportsScreen.tsx only has a basic form
**Required**: Complete Library with 3 sections

**File**: `app/(tabs)/library.tsx`
```typescript
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Segmented Button, FAB } from 'react-native-paper';
import { useAuth } from '../../src/contexts/AuthContext';
import ReportsFeedSection from '../../src/components/reports/ReportsFeedSection';
import ReportHistorySection from '../../src/components/reports/ReportHistorySection';
import AlertsArchiveSection from '../../src/components/alerts/AlertsArchiveSection';

export default function LibraryScreen() {
  const [activeSection, setActiveSection] = useState<'reports' | 'history' | 'alerts'>('reports');
  const { user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* Section Selector */}
      <ScrollView 
        horizontal 
        style={{ backgroundColor: '#FFFFFF', elevation: 2 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <SegmentedButtons
          value={activeSection}
          onValueChange={setActiveSection}
          buttons={[
            { value: 'reports', label: '📋 Reports Feed' },
            ...(user?.userType === 'fisherman' ? [{ value: 'history', label: '📊 My Reports' }] : []),
            { value: 'alerts', label: '🚨 Alerts Archive' }
          ]}
        />
      </ScrollView>

      {/* Content Sections */}
      <View style={{ flex: 1 }}>
        {activeSection === 'reports' && <ReportsFeedSection />}
        {activeSection === 'history' && <ReportHistorySection />}
        {activeSection === 'alerts' && <AlertsArchiveSection />}
      </View>

      {/* FAB for Adding Reports (Fishermen Only) */}
      {user?.userType === 'fisherman' && activeSection === 'reports' && (
        <FAB
          icon="plus"
          label="Add Report"
          onPress={openReportForm}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    </View>
  );
}
```

---

### **3. Create Settings Screen**

**File**: `app/settings.tsx`
```typescript
import React from 'react';
import { ScrollView } from 'react-native';
import { List, Surface, Switch, Button, Divider } from 'react-native-paper';
import { useAuth } from '../src/contexts/AuthContext';
import { useSettings } from '../src/hooks/useSettings';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useSettings();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Account Section */}
      <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title={user?.displayName || 'Guest User'}
            description={user?.email || 'Not signed in'}
            left={(props) => <List.Icon {...props} icon="account-circle" />}
          />
          <List.Item
            title="User Type"
            description={user?.userType === 'fisherman' ? '🎣 Fisherman' : '👤 General User'}
            left={(props) => <List.Icon {...props} icon="badge-account" />}
          />
        </List.Section>
      </Surface>

      {/* Preferences */}
      <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }}>
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Dark Theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={settings.darkTheme}
                onValueChange={(value) => updateSetting('darkTheme', value)}
              />
            )}
          />
          <List.Item
            title="Language"
            description="Indonesian / English"
            left={(props) => <List.Icon {...props} icon="translate" />}
            onPress={openLanguageSelector}
          />
        </List.Section>
      </Surface>

      {/* Notifications */}
      <Surface style={{ margin: 16, padding: 16, borderRadius: 12 }}>
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Weather Alerts"
            description="Critical weather warnings"
            left={(props) => <List.Icon {...props} icon="weather-lightning" />}
            right={() => (
              <Switch
                value={settings.weatherAlerts}
                onValueChange={(value) => updateSetting('weatherAlerts', value)}
              />
            )}
          />
          <List.Item
            title="Marine Warnings"
            description="High waves and wind alerts"
            left={(props) => <List.Icon {...props} icon="waves" />}
            right={() => (
              <Switch
                value={settings.marineWarnings}
                onValueChange={(value) => updateSetting('marineWarnings', value)}
              />
            )}
          />
        </List.Section>
      </Surface>

      {/* Account Actions */}
      {user && (
        <Surface style={{ margin: 16, borderRadius: 12 }}>
          <List.Item
            title="Sign Out"
            titleStyle={{ color: '#F44336' }}
            left={(props) => <List.Icon {...props} icon="logout" color="#F44336" />}
            onPress={logout}
          />
        </Surface>
      )}
    </ScrollView>
  );
}
```

---

### **4. Implement Weather Alerts System**

**File**: `src/services/alerts/alertsService.ts`
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../notifications/pushNotifications';

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  validFrom: Date;
  validTo: Date;
  alertType: 'weather' | 'marine';
}

class AlertsService {
  private alertsKey = '@weather_alerts';

  async checkForAlerts(weatherData: any, location: string): Promise<WeatherAlert[]> {
    const alerts: WeatherAlert[] = [];

    // Check wave height alerts
    if (weatherData.marine?.waveHeight > 4.0) {
      alerts.push({
        id: `wave_${Date.now()}`,
        title: '🌊 CRITICAL: Extreme Wave Height',
        description: `Wave height ${weatherData.marine.waveHeight}m exceeds safe limits. Avoid sea activities.`,
        severity: 'critical',
        location,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
        alertType: 'marine'
      });
    }

    // Check wind speed alerts
    if (weatherData.forecasts?.[0]?.windSpeed > 40) {
      alerts.push({
        id: `wind_${Date.now()}`,
        title: '💨 WARNING: Strong Wind',
        description: `Wind speed ${weatherData.forecasts[0].windSpeed} km/h. Exercise caution at sea.`,
        severity: 'high',
        location,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
        alertType: 'marine'
      });
    }

    // Send notifications for new alerts
    for (const alert of alerts) {
      await notificationService.scheduleWeatherAlert({
        title: alert.title,
        body: alert.description,
        data: { alertId: alert.id, severity: alert.severity }
      });
    }

    // Cache alerts
    await this.saveAlerts(alerts);

    return alerts;
  }

  async getActiveAlerts(): Promise<WeatherAlert[]> {
    try {
      const alertsJson = await AsyncStorage.getItem(this.alertsKey);
      if (!alertsJson) return [];

      const alerts: WeatherAlert[] = JSON.parse(alertsJson);
      const now = new Date();

      // Filter only active alerts
      return alerts.filter(alert => new Date(alert.validTo) > now);
    } catch (error) {
      console.error('Error loading alerts:', error);
      return [];
    }
  }

  private async saveAlerts(alerts: WeatherAlert[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  }
}

export default new AlertsService();
```

---

### **5. Fix HomeScreen Implementation**

**Current HomeScreen.tsx is TOO BASIC**. Replace with full implementation:

**File**: `app/(tabs)/index.tsx` (migrated from HomeScreen)
```typescript
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useWeatherData } from '../../src/hooks/useWeatherData';
import { useLocation } from '../../src/hooks/useLocation';
import LocationHeaderCard from '../../src/components/common/LocationHeaderCard';
import CurrentWeatherHeroCard from '../../src/components/weather/CurrentWeatherHeroCard';
import AlertsSection from '../../src/components/alerts/AlertsSection';
import ForecastCarousel from '../../src/components/weather/ForecastCarousel';
import ReportsFeedPreview from '../../src/components/reports/ReportsFeedPreview';

export default function HomeScreen() {
  const theme = useTheme();
  const { currentLocation } = useLocation();
  const { data: weather, isLoading, refetch } = useWeatherData(currentLocation?.code);

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[theme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Location Header */}
      <LocationHeaderCard location={currentLocation} />

      {/* Current Weather Hero Card */}
      <CurrentWeatherHeroCard weatherData={weather} />

      {/* Weather Alerts Section */}
      <AlertsSection location={currentLocation?.name} />

      {/* 7-Day Forecast Carousel */}
      <ForecastCarousel forecasts={weather?.forecasts} />

      {/* Recent Fisherman Reports Preview */}
      <ReportsFeedPreview />
    </ScrollView>
  );
}
```

---

### **6. Add User Role Management**

**File**: `src/contexts/AuthContext.tsx` (ENHANCE EXISTING)
```typescript
// Add to existing AuthContext
interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: 'fisherman' | 'general'; // ADD THIS
  location?: {
    latitude: number;
    longitude: number;
    locationCode: string;
    locationName: string;
  };
}

// Add to AuthContext
const checkUserRole = async (uid: string): Promise<'fisherman' | 'general'> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().userType || 'general';
    }
    return 'general';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'general';
  }
};
```

---

### **7. Create Header with Profile Dropdown**

**File**: `src/components/common/Header.tsx`
```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Searchbar, Menu, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

const Header = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Appbar.Header>
      <Appbar.Content title="🌊 Marine Alert" />

      <Searchbar
        placeholder="Search location..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ flex: 1, marginHorizontal: 16, height: 48 }}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon={() => 
              user ? (
                <Avatar.Text size={32} label={user.displayName?.[0] || 'U'} />
              ) : (
                <Avatar.Icon size={32} icon="account" />
              )
            }
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        {user ? (
          <>
            <Menu.Item onPress={() => router.push('/profile')} title="Profile" />
            <Menu.Item onPress={() => router.push('/settings')} title="Settings" />
            <Menu.Item onPress={logout} title="Sign Out" />
          </>
        ) : (
          <Menu.Item onPress={() => router.push('/(auth)/login')} title="Sign In" />
        )}
      </Menu>
    </Appbar.Header>
  );
};

export default Header;
```

---

## 📋 IMPLEMENTATION CHECKLIST

### **🚨 Critical Fixes (Week 1)**
- [ ] Remove React Navigation dependencies
- [ ] Create /app directory structure with Expo Router
- [ ] Migrate existing screens to correct locations
- [ ] Fix App.tsx entry point
- [ ] Create _layout.tsx files for proper routing

### **⚠️ Missing Features (Week 2)**
- [ ] Implement 5-tab forecasts system
- [ ] Transform ReportsScreen → Library with 3 sections
- [ ] Create Settings screen (Google Play Store style)
- [ ] Add Header component with profile dropdown
- [ ] Implement weather alerts system

### **🎨 UI/UX Improvements (Week 3)**
- [ ] Apply Material Design 3 styling throughout
- [ ] Add proper loading states and error boundaries
- [ ] Implement Google Play Store card layouts
- [ ] Add empty states for all sections
- [ ] Polish typography and spacing

### **📱 Feature Completion (Week 4)**
- [ ] Add user role management and permissions
- [ ] Implement location search functionality
- [ ] Add report creation forms and validation
- [ ] Test offline functionality thoroughly
- [ ] Polish navigation and interactions

---

**CRITICAL**: Your repository needs major feature additions to match the original specifications. Focus on completing these missing features before any optimization or polish work.