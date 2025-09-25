# 🌊 Maritime EWS UI/UX Implementation Guide 2025
## Complete Interface Design & Navigation System

Based on Google Play Store design patterns, Material Design 3, and Maritime Early Warning System requirements.

---

## 🎯 Design Philosophy

### **Google Play Store Inspired Interface**
- **Clean card-based layouts** with consistent spacing
- **Hero sections** for featured content (weather alerts)
- **Sectioned content** with clear visual hierarchy
- **Action-oriented design** for emergency situations
- **Consistent typography** and iconography throughout

### **Maritime Context Considerations**
- **High contrast** for outdoor visibility
- **Large touch targets** for use with wet hands
- **Critical information priority** (safety alerts first)
- **Intuitive iconography** for maritime conditions
- **Offline-first approach** for sea conditions

---

## 🧭 Navigation System Architecture

### **Header System (Google Play Store Pattern)**
```typescript
// app/(tabs)/_layout.tsx - Header Implementation
import { View } from 'react-native';
import { Appbar, Searchbar, Menu, Avatar } from 'react-native-paper';

const HeaderLayout = () => {
  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: 'transparent' }}>
      {/* Left: App Logo */}
      <Appbar.Content 
        title="🌊 Marine Alert" 
        titleStyle={{ fontSize: 18, fontWeight: '600' }}
      />

      {/* Center: Location-based Search */}
      <Searchbar
        placeholder="Search location..."
        style={{
          flex: 1,
          marginHorizontal: 16,
          height: 48,
          elevation: 2
        }}
        inputStyle={{ fontSize: 14 }}
        onChangeText={handleLocationSearch}
      />

      {/* Right: Profile Dropdown */}
      <ProfileDropdownMenu />
    </Appbar.Header>
  );
};
```

### **Bottom Navigation (3-Tab System)**
```typescript
// Expo Router Tabs Configuration
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#1976D2',
    tabBarInactiveTintColor: '#666666',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium'
    },
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E0E0E0',
      borderTopWidth: 1,
      height: 64,
      paddingBottom: 8,
      paddingTop: 8,
      elevation: 8, // Android shadow
      shadowOffset: { width: 0, height: -2 }, // iOS shadow
      shadowOpacity: 0.1,
      shadowRadius: 8
    },
    tabBarItemStyle: {
      paddingVertical: 4
    }
  }}
>
  <Tabs.Screen 
    name="index" 
    options={{
      title: 'Home',
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="home" size={24} color={color} />
      )
    }} 
  />
  <Tabs.Screen 
    name="forecasts" 
    options={{
      title: 'Forecasts',
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="cloud-queue" size={24} color={color} />
      )
    }} 
  />
  <Tabs.Screen 
    name="library" 
    options={{
      title: 'Library',
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="assignment" size={24} color={color} />
      )
    }} 
  />
</Tabs>
```

---

## 🏠 Home Screen Implementation

### **Layout Structure (Google Play Store Cards)**
```typescript
// app/(tabs)/index.tsx - Home Screen
import { ScrollView, RefreshControl } from 'react-native';
import { Surface, Card, Text, Chip } from 'react-native-paper';

const HomeScreen = () => {
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Location Header Card */}
      <LocationHeaderCard />

      {/* Current Conditions Hero Card */}
      <CurrentWeatherHeroCard />

      {/* Critical Alerts Section */}
      <AlertsSection />

      {/* 7-Day Forecast Carousel */}
      <ForecastCarouselSection />

      {/* Fisherman Reports Feed */}
      <ReportsFeedSection />
    </ScrollView>
  );
};
```

### **Current Weather Hero Card (Material Design 3)**
```typescript
// src/components/weather/CurrentWeatherHeroCard.tsx
const CurrentWeatherHeroCard = ({ weatherData }: Props) => {
  const theme = useTheme();

  return (
    <Card 
      style={{
        margin: 16,
        marginTop: 8,
        elevation: 3,
        backgroundColor: theme.colors.primaryContainer,
      }}
      contentStyle={{ padding: 24 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Temperature & Condition */}
        <View>
          <Text 
            variant="displayLarge" 
            style={{ 
              color: theme.colors.onPrimaryContainer,
              fontSize: 64,
              fontWeight: '300'
            }}
          >
            {Math.round(weatherData.temperature)}°
          </Text>
          <Text 
            variant="titleMedium" 
            style={{ 
              color: theme.colors.onPrimaryContainer,
              marginTop: -8
            }}
          >
            {weatherData.condition}
          </Text>
          <Text 
            variant="bodyMedium" 
            style={{ 
              color: theme.colors.onPrimaryContainer,
              opacity: 0.7,
              marginTop: 4
            }}
          >
            Feels like {Math.round(weatherData.feelsLike)}°
          </Text>
        </View>

        {/* Weather Icon */}
        <View style={{ alignItems: 'center' }}>
          <MaterialIcons 
            name={getWeatherIcon(weatherData.condition)} 
            size={80} 
            color={theme.colors.onPrimaryContainer} 
          />

          {/* Marine Condition Chip */}
          <Chip 
            style={{ 
              marginTop: 12,
              backgroundColor: getMarineColorSeverity(weatherData.marine?.waveCategory)
            }}
            textStyle={{ color: '#FFFFFF', fontSize: 12 }}
            compact
          >
            Waves: {weatherData.marine?.waveCategory || 'N/A'}
          </Chip>
        </View>
      </View>

      {/* Weather Details Grid */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
        opacity: 0.6
      }}>
        <WeatherDetail icon="water-drop" label="Humidity" value={`${weatherData.humidity}%`} />
        <WeatherDetail icon="air" label="Wind" value={`${weatherData.windSpeed} km/h`} />
        <WeatherDetail icon="visibility" label="Visibility" value={weatherData.visibility} />
        <WeatherDetail icon="compress" label="Pressure" value={`${weatherData.pressure} mb`} />
      </View>
    </Card>
  );
};
```

### **Critical Alerts Section (Emergency-First Design)**
```typescript
// src/components/alerts/AlertsSection.tsx
const AlertsSection = ({ alerts }: Props) => {
  if (!alerts.length) return null;

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <Text variant="titleMedium" style={{ 
        marginBottom: 12, 
        fontWeight: '600',
        color: '#1976D2'
      }}>
        ⚠️ Active Alerts
      </Text>

      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          style={{
            marginBottom: 8,
            elevation: 2,
            backgroundColor: getAlertBackgroundColor(alert.severity)
          }}
        >
          <Card.Content style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons 
                name={getAlertIcon(alert.severity)} 
                size={24} 
                color={getAlertIconColor(alert.severity)} 
              />
              <Text variant="titleSmall" style={{ 
                marginLeft: 8, 
                fontWeight: '600',
                color: getAlertTextColor(alert.severity)
              }}>
                {alert.title}
              </Text>
            </View>

            <Text variant="bodyMedium" style={{ 
              color: getAlertTextColor(alert.severity),
              marginBottom: 12
            }}>
              {alert.description}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                Valid until: {formatDateTime(alert.validTo)}
              </Text>

              <Button 
                mode="outlined"
                compact
                onPress={() => openAlertModal(alert)}
                style={{ borderColor: getAlertIconColor(alert.severity) }}
                labelStyle={{ color: getAlertIconColor(alert.severity) }}
              >
                Details
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};
```

---

## 📊 Forecasts Screen (5-Tab System)

### **Material Top Tabs Navigation**
```typescript
// app/(tabs)/forecasts/_layout.tsx - 5-Tab Implementation
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
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
          borderRadius: 1.5
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          fontFamily: 'Roboto-Medium',
          textTransform: 'none'
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { 
          width: 110,
          paddingHorizontal: 8
        },
        tabBarPressColor: theme.colors.primary + '20', // 20% opacity
      }}
    >
      <Tab.Screen 
        name="index" 
        options={{ 
          title: 'Weather',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="wb-sunny" size={16} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="wind" 
        options={{ 
          title: 'Wind',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="air" size={16} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="waves" 
        options={{ 
          title: 'Waves',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="waves" size={16} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="currents" 
        options={{ 
          title: 'Currents',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="trending-up" size={16} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="tides" 
        options={{ 
          title: 'Tides',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="timeline" size={16} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}
```

### **Forecast Tab Content Structure**
```typescript
// app/(tabs)/forecasts/waves.tsx - Example Wave Forecast Tab
const WaveForecastScreen = () => {
  const { data: waveData, isLoading } = useWaveData();

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Location Selector */}
      <LocationSelectorCard />

      {/* Today's Detailed Wave Conditions */}
      <Card style={{ margin: 16, elevation: 2 }}>
        <Card.Title 
          title="Today's Wave Conditions"
          subtitle={`Last updated: ${formatTime(waveData?.lastUpdate)}`}
          left={(props) => <Avatar.Icon {...props} icon="waves" />}
        />
        <Card.Content>
          {/* Current Wave Height */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingVertical: 24,
            backgroundColor: getWaveColorByHeight(waveData?.currentHeight)
          }}>
            <Text variant="displayMedium" style={{ color: '#FFFFFF', fontWeight: '300' }}>
              {waveData?.currentHeight || 0}m
            </Text>
            <View style={{ marginLeft: 16, alignItems: 'flex-start' }}>
              <Text variant="titleMedium" style={{ color: '#FFFFFF' }}>
                {getWaveCategory(waveData?.currentHeight)}
              </Text>
              <Text variant="bodySmall" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                {getWaveSafetyAdvice(waveData?.currentHeight)}
              </Text>
            </View>
          </View>

          {/* Hourly Wave Chart */}
          <WaveHeightChart data={waveData?.hourlyData} />
        </Card.Content>
      </Card>

      {/* 7-Day Wave Forecast */}
      <WeeklyWaveForecast data={waveData?.weeklyData} />

      {/* Marine Safety Advisory */}
      <MarineSafetyCard waveData={waveData} />
    </ScrollView>
  );
};
```

---

## 📚 Library Screen Implementation

### **Multi-Section Layout (Google Play Store Style)**
```typescript
// app/(tabs)/library.tsx - Library Screen
const LibraryScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'reports' | 'alerts' | 'history'>('reports');
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Section Selector (Chip Navigation) */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingVertical: 12,
          backgroundColor: '#FFFFFF',
          elevation: 2
        }}
      >
        <Chip
          selected={selectedTab === 'reports'}
          onPress={() => setSelectedTab('reports')}
          style={{ marginRight: 8 }}
          showSelectedOverlay
        >
          📋 Reports Feed
        </Chip>

        {user?.userType === 'fisherman' && (
          <Chip
            selected={selectedTab === 'history'}
            onPress={() => setSelectedTab('history')}
            style={{ marginRight: 8 }}
            showSelectedOverlay
          >
            📊 My Reports
          </Chip>
        )}

        <Chip
          selected={selectedTab === 'alerts'}
          onPress={() => setSelectedTab('alerts')}
          showSelectedOverlay
        >
          🚨 Alert Archive
        </Chip>
      </ScrollView>

      {/* Content Sections */}
      <View style={{ flex: 1 }}>
        {selectedTab === 'reports' && <ReportsFeedSection />}
        {selectedTab === 'history' && <ReportHistorySection />}
        {selectedTab === 'alerts' && <AlertsArchiveSection />}
      </View>

      {/* Floating Action Button (Fishermen Only) */}
      {user?.userType === 'fisherman' && selectedTab === 'reports' && (
        <FAB
          icon="plus"
          label="Add Report"
          onPress={openReportForm}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary
          }}
        />
      )}
    </View>
  );
};
```

### **Reports Feed Component (Card-Based)**
```typescript
// src/components/reports/ReportsFeedSection.tsx
const ReportsFeedSection = () => {
  const { data: reports, isLoading } = useReportsData();

  return (
    <View style={{ flex: 1 }}>
      {/* Sort Controls */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
      }}>
        <Text variant="titleSmall" style={{ fontWeight: '600' }}>
          Recent Observations
        </Text>
        <SegmentedButtons
          value={sortOrder}
          onValueChange={setSortOrder}
          buttons={[
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' }
          ]}
          density="small"
        />
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
        renderItem={({ item }) => <ReportCard report={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<EmptyStateCard type="reports" />}
        onEndReached={loadMoreReports}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};
```

### **Individual Report Card (Google Play Style)**
```typescript
// src/components/reports/ReportCard.tsx
const ReportCard = ({ report }: { report: Report }) => {
  const theme = useTheme();

  return (
    <Card style={{ elevation: 2, backgroundColor: theme.colors.surface }}>
      <Card.Content style={{ padding: 16 }}>
        {/* Header: Author + Location + Time */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 12 
        }}>
          <Avatar.Text 
            size={40} 
            label={report.authorName.charAt(0)} 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text variant="titleSmall" style={{ fontWeight: '600' }}>
              {report.authorName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <MaterialIcons name="location-on" size={14} color={theme.colors.primary} />
              <Text variant="bodySmall" style={{ 
                marginLeft: 4, 
                color: theme.colors.onSurfaceVariant 
              }}>
                {report.location.name} • {formatRelativeTime(report.timestamp)}
              </Text>
            </View>
          </View>

          {/* Verification Badge */}
          {report.verified && (
            <Chip 
              icon="verified" 
              compact 
              style={{ backgroundColor: '#4CAF50' }}
              textStyle={{ color: '#FFFFFF', fontSize: 11 }}
            >
              Verified
            </Chip>
          )}
        </View>

        {/* Marine Conditions Summary */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.surfaceVariant,
          padding: 12,
          borderRadius: 8,
          marginBottom: 12
        }}>
          <ConditionItem 
            icon="waves" 
            label="Waves" 
            value={`${report.conditions.waveHeight}m`}
            color={getWaveColor(report.conditions.waveHeight)}
          />
          <ConditionItem 
            icon="air" 
            label="Wind" 
            value={`${report.conditions.windSpeed} km/h`}
            color={getWindColor(report.conditions.windSpeed)}
          />
          <ConditionItem 
            icon="water" 
            label="Sea" 
            value={report.conditions.seaCondition}
            color={getSeaConditionColor(report.conditions.seaCondition)}
          />
        </View>

        {/* Observations Text */}
        <Text 
          variant="bodyMedium" 
          numberOfLines={3}
          style={{ 
            lineHeight: 20,
            marginBottom: 12
          }}
        >
          {report.observations}
        </Text>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button 
            mode="text" 
            compact
            onPress={() => shareReport(report)}
            style={{ marginRight: 8 }}
          >
            Share
          </Button>
          <Button 
            mode="contained-tonal" 
            compact
            onPress={() => openReportModal(report)}
          >
            Read Full Report
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};
```

---

## ⚙️ Settings Screen (Google Play Store Layout)

### **Full-Page Settings Implementation**
```typescript
// app/settings.tsx - Google Play Store Style Settings
const SettingsScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Account Section */}
      <Surface style={{ margin: 16, padding: 20, borderRadius: 12, elevation: 2 }}>
        <Text variant="titleMedium" style={{ 
          marginBottom: 16, 
          fontWeight: '600',
          color: theme.colors.primary 
        }}>
          Account
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Avatar.Text 
            size={64} 
            label={user?.displayName?.charAt(0) || 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: '600' }}>
              {user?.displayName || 'Guest User'}
            </Text>
            <Text variant="bodyMedium" style={{ 
              color: theme.colors.onSurfaceVariant,
              marginTop: 4
            }}>
              {user?.email || 'Not signed in'}
            </Text>
            <Chip 
              style={{ 
                alignSelf: 'flex-start', 
                marginTop: 8,
                backgroundColor: user?.userType === 'fisherman' ? '#1976D2' : '#666'
              }}
              textStyle={{ color: '#FFFFFF', fontSize: 11 }}
              compact
            >
              {user?.userType === 'fisherman' ? '🎣 Fisherman' : '👤 General User'}
            </Chip>
          </View>
        </View>

        <Button 
          mode="outlined" 
          onPress={editProfile}
          style={{ alignSelf: 'flex-start' }}
        >
          Edit Profile
        </Button>
      </Surface>

      {/* Preferences Section */}
      <Surface style={{ margin: 16, marginTop: 0, padding: 20, borderRadius: 12, elevation: 2 }}>
        <Text variant="titleMedium" style={{ 
          marginBottom: 16, 
          fontWeight: '600',
          color: theme.colors.primary 
        }}>
          Preferences
        </Text>

        <List.Section>
          <List.Subheader style={{ paddingHorizontal: 0 }}>Appearance</List.Subheader>
          <List.Item
            title="Theme"
            description="Light, Dark, or System"
            left={() => <List.Icon icon="palette" />}
            right={() => <ThemeSelector />}
          />

          <List.Subheader style={{ paddingHorizontal: 0 }}>Location</List.Subheader>
          <List.Item
            title="Default Location"
            description={defaultLocation || "Use GPS"}
            left={() => <List.Icon icon="location-on" />}
            onPress={selectDefaultLocation}
          />

          <List.Subheader style={{ paddingHorizontal: 0 }}>Language</List.Subheader>
          <List.Item
            title="Language"
            description="Indonesian / English"
            left={() => <List.Icon icon="language" />}
            right={() => <LanguageSelector />}
          />
        </List.Section>
      </Surface>

      {/* Notifications Section */}
      <Surface style={{ margin: 16, marginTop: 0, padding: 20, borderRadius: 12, elevation: 2 }}>
        <Text variant="titleMedium" style={{ 
          marginBottom: 16, 
          fontWeight: '600',
          color: theme.colors.primary 
        }}>
          Notifications
        </Text>

        <List.Section>
          <List.Item
            title="Weather Alerts"
            description="Get notified of severe weather"
            left={() => <List.Icon icon="notifications" />}
            right={() => <Switch value={notificationSettings.weatherAlerts} />}
          />

          <List.Item
            title="Marine Warnings" 
            description="Critical conditions for fishermen"
            left={() => <List.Icon icon="warning" />}
            right={() => <Switch value={notificationSettings.marineWarnings} />}
          />

          <List.Item
            title="Alert Threshold"
            description="Low, Medium, High, Critical"
            left={() => <List.Icon icon="tune" />}
            right={() => <AlertThresholdSelector />}
          />

          <List.Item
            title="Quiet Hours"
            description="9:00 PM - 7:00 AM"
            left={() => <List.Icon icon="do-not-disturb" />}
            onPress={setQuietHours}
          />
        </List.Section>
      </Surface>

      {/* Data & Privacy */}
      <Surface style={{ margin: 16, marginTop: 0, padding: 20, borderRadius: 12, elevation: 2 }}>
        <Text variant="titleMedium" style={{ 
          marginBottom: 16, 
          fontWeight: '600',
          color: theme.colors.primary 
        }}>
          Data & Privacy
        </Text>

        <List.Section>
          <List.Item
            title="Clear Cache"
            description="Free up storage space"
            left={() => <List.Icon icon="cleaning-services" />}
            onPress={clearAllCache}
          />

          <List.Item
            title="Data Usage"
            description="Manage offline storage"
            left={() => <List.Icon icon="storage" />}
            right={() => <Text>{formatBytes(cacheSize)}</Text>}
          />

          <List.Item
            title="Privacy Policy"
            left={() => <List.Icon icon="privacy-tip" />}
            onPress={openPrivacyPolicy}
          />

          <List.Item
            title="About BMKG Data"
            description="Weather data attribution"
            left={() => <List.Icon icon="info" />}
            onPress={showBMKGAttribution}
          />
        </List.Section>
      </Surface>

      {/* Account Actions */}
      {user && (
        <Surface style={{ margin: 16, marginTop: 0, borderRadius: 12, elevation: 2 }}>
          <List.Item
            title="Sign Out"
            titleStyle={{ color: '#F44336' }}
            left={() => <List.Icon icon="logout" color="#F44336" />}
            onPress={logout}
            style={{ paddingVertical: 16 }}
          />
        </Surface>
      )}
    </ScrollView>
  );
};
```

---

## 🔐 Authentication Screens (Material Design 3)

### **Login Screen Implementation**
```typescript
// app/(auth)/login.tsx
const LoginScreen = () => {
  const { signIn, isLoading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* App Logo & Title */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <MaterialIcons name="waves" size={80} color="#1976D2" />
          <Text variant="headlineMedium" style={{ 
            marginTop: 16,
            fontWeight: '600',
            color: '#1976D2'
          }}>
            Marine Weather Alert
          </Text>
          <Text variant="bodyLarge" style={{ 
            marginTop: 8,
            textAlign: 'center',
            color: '#666666',
            lineHeight: 24
          }}>
            Stay safe at sea with real-time weather updates and marine condition alerts
          </Text>
        </View>

        {/* Login Form */}
        <View style={{ marginBottom: 24 }}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email Address"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                style={{ marginBottom: 16 }}
                left={<TextInput.Icon icon="email" />}
              />
            )}
          />
          {errors.email && (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email.message}
            </HelperText>
          )}

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password.message}
            </HelperText>
          )}
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text variant="bodyMedium" style={{ marginLeft: 8 }}>
              Remember me
            </Text>
          </View>

          <Button mode="text" onPress={handleForgotPassword}>
            Forgot Password?
          </Button>
        </View>

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          style={{ 
            paddingVertical: 8,
            marginBottom: 16
          }}
          contentStyle={{ height: 48 }}
        >
          Sign In
        </Button>

        {/* Divider */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 24
        }}>
          <Divider style={{ flex: 1 }} />
          <Text variant="bodySmall" style={{ 
            marginHorizontal: 16, 
            color: '#999999' 
          }}>
            OR
          </Text>
          <Divider style={{ flex: 1 }} />
        </View>

        {/* Social Login */}
        <Button
          mode="outlined"
          onPress={signInWithGoogle}
          style={{ marginBottom: 24 }}
          contentStyle={{ height: 48 }}
          icon="google"
        >
          Continue with Google
        </Button>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text variant="bodyMedium" style={{ color: '#666666' }}>
            Don't have an account? 
          </Text>
          <Button mode="text" onPress={() => router.push('/(auth)/register')}>
            Sign Up
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```

---

## 🎨 Component Design Patterns

### **Loading States (Google Play Store Pattern)**
```typescript
// src/components/common/LoadingCard.tsx
const LoadingCard = () => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 16, elevation: 2 }}>
      <Card.Content style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ 
            marginLeft: 12,
            color: theme.colors.onSurfaceVariant 
          }}>
            Loading weather data...
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};
```

### **Empty States (Engaging & Helpful)**
```typescript
// src/components/common/EmptyStateCard.tsx
const EmptyStateCard = ({ type }: { type: 'reports' | 'alerts' | 'history' }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'reports':
        return {
          icon: 'assignment-turned-in',
          title: 'No Reports Yet',
          subtitle: 'Fishermen reports will appear here when available',
          action: null
        };
      case 'alerts':
        return {
          icon: 'check-circle',
          title: 'All Clear!',
          subtitle: 'No active weather alerts for your area',
          action: null
        };
      case 'history':
        return {
          icon: 'note-add',
          title: 'Start Reporting',
          subtitle: 'Your observation reports will appear here',
          action: { label: 'Add First Report', onPress: openReportForm }
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card style={{ margin: 16, elevation: 1 }}>
      <Card.Content style={{ 
        padding: 40, 
        alignItems: 'center' 
      }}>
        <MaterialIcons 
          name={content.icon} 
          size={64} 
          color="#CCCCCC" 
        />
        <Text variant="titleMedium" style={{ 
          marginTop: 16,
          marginBottom: 8,
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {content.title}
        </Text>
        <Text variant="bodyMedium" style={{ 
          textAlign: 'center',
          color: '#666666',
          lineHeight: 20
        }}>
          {content.subtitle}
        </Text>

        {content.action && (
          <Button
            mode="contained-tonal"
            onPress={content.action.onPress}
            style={{ marginTop: 20 }}
          >
            {content.action.label}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};
```

---

## 🚨 Alert Modal System (Critical UX)

### **Weather Alert Modal (Emergency Design)**
```typescript
// src/components/alerts/AlertModal.tsx
const AlertModal = ({ alert, visible, onDismiss }: Props) => {
  const theme = useTheme();

  return (
    <Modal 
      visible={visible} 
      onDismiss={onDismiss}
      contentContainerStyle={{
        margin: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        elevation: 8
      }}
    >
      <View style={{ padding: 24 }}>
        {/* Alert Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 16 
        }}>
          <MaterialIcons 
            name={getAlertIcon(alert.severity)} 
            size={32} 
            color={getAlertColor(alert.severity)} 
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text variant="titleLarge" style={{ fontWeight: '600' }}>
              {alert.title}
            </Text>
            <Chip 
              style={{ 
                alignSelf: 'flex-start',
                marginTop: 4,
                backgroundColor: getAlertColor(alert.severity)
              }}
              textStyle={{ color: '#FFFFFF', fontSize: 11 }}
              compact
            >
              {alert.severity.toUpperCase()}
            </Chip>
          </View>
        </View>

        {/* Alert Content */}
        <ScrollView style={{ maxHeight: 300 }}>
          <Text variant="bodyLarge" style={{ 
            lineHeight: 24,
            marginBottom: 16
          }}>
            {alert.description}
          </Text>

          {/* Affected Areas */}
          <Text variant="titleSmall" style={{ 
            fontWeight: '600',
            marginBottom: 8
          }}>
            Affected Areas:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {alert.affectedAreas.map((area) => (
              <Chip 
                key={area} 
                style={{ margin: 2 }}
                compact
              >
                {area}
              </Chip>
            ))}
          </View>

          {/* Validity Period */}
          <Text variant="titleSmall" style={{ 
            fontWeight: '600',
            marginBottom: 8
          }}>
            Valid Period:
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            From: {formatDateTime(alert.validFrom)}
            {'
'}Until: {formatDateTime(alert.validTo)}
          </Text>
        </ScrollView>

        {/* Action Buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'flex-end',
          marginTop: 16
        }}>
          <Button mode="text" onPress={onDismiss}>
            Close
          </Button>
          <Button 
            mode="contained" 
            onPress={shareAlert}
            style={{ marginLeft: 12 }}
          >
            Share Alert
          </Button>
        </View>
      </View>
    </Modal>
  );
};
```

---

## 🎭 Theme System (Blue Material Design 3)

### **Complete Theme Configuration**
```typescript
// src/constants/theme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#E3F2FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#0D47A1',
    secondary: '#03DAC6',
    secondaryContainer: '#E0F7FA',
    tertiary: '#FF9800',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    outline: '#E0E0E0',

    // Custom alert colors
    alertCritical: '#D32F2F',
    alertHigh: '#F44336',
    alertMedium: '#FF9800',
    alertLow: '#4CAF50',

    // Marine condition colors
    waveCalm: '#4CAF50',
    waveModerate: '#FF9800', 
    waveRough: '#F44336',
    waveExtreme: '#B71C1C'
  }
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1565C0',
    primaryContainer: '#0D47A1',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#E3F2FD',
    secondary: '#018786',
    secondaryContainer: '#004D40',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D'
  }
};
```

---

## 🌊 Maritime-Specific UI Patterns

### **Wave Height Visualization**
```typescript
// src/components/marine/WaveHeightIndicator.tsx
const WaveHeightIndicator = ({ height, category }: Props) => {
  const getWaveVisualization = (height: number) => {
    const maxHeight = 6; // meters
    const percentage = Math.min((height / maxHeight) * 100, 100);

    return (
      <View style={{
        width: 80,
        height: 120,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Wave Animation */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${percentage}%`,
            backgroundColor: getWaveColor(height),
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          }}
        />

        {/* Height Text */}
        <View style={{
          position: 'absolute',
          top: 8,
          left: 0,
          right: 0,
          alignItems: 'center'
        }}>
          <Text 
            variant="titleMedium" 
            style={{ 
              fontWeight: '700',
              color: percentage > 50 ? '#FFFFFF' : '#1976D2'
            }}
          >
            {height.toFixed(1)}m
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {getWaveVisualization(height)}
      <Text variant="bodySmall" style={{ 
        marginTop: 8,
        fontWeight: '600',
        color: getWaveColor(height)
      }}>
        {category}
      </Text>
    </View>
  );
};
```

---

## 📋 Implementation Checklist

### **Phase 1: Foundation UI (Week 1)**
- [ ] Expo Router file-based navigation setup
- [ ] Material Design 3 theme configuration (blue primary)
- [ ] Bottom tabs navigation with custom styling
- [ ] Header component with search and profile dropdown
- [ ] Basic home screen layout with weather cards

### **Phase 2: Core Screens (Week 2)**
- [ ] Forecasts screen with 5 sub-tabs implementation
- [ ] Library screen with multi-section layout
- [ ] Settings screen (Google Play Store style)
- [ ] Authentication screens with form validation
- [ ] Alert modal system for critical notifications

### **Phase 3: Maritime-Specific Components (Week 3)**
- [ ] Wave height visualization components
- [ ] Marine condition indicators
- [ ] Fisherman report cards and forms
- [ ] Critical alert system with emergency styling
- [ ] Location selector with BMKG codes

### **Phase 4: Polish & Optimization (Week 4)**
- [ ] Loading states and skeleton screens
- [ ] Empty state designs
- [ ] Error boundaries and fallback UIs
- [ ] Accessibility improvements
- [ ] Performance optimization (lazy loading, memoization)

---

## 🎯 Best Practices Summary

### **Material Design 3 Implementation**
- Use **elevated cards** (elevation 2-4) for content sections
- Apply **consistent spacing** (8dp, 16dp, 24dp multiples)
- Implement **proper color contrast** for maritime visibility
- Use **semantic colors** for different alert severities
- Apply **smooth transitions** between screens and states

### **Google Play Store Design Patterns**
- **Section-based layout** with clear visual separation
- **Action-oriented buttons** with primary/secondary hierarchy  
- **Card-based information architecture**
- **Consistent iconography** with Material Icons
- **Clean typography** with proper information hierarchy

### **Maritime UX Considerations**
- **Priority information first** (alerts, current conditions)
- **Large touch targets** (minimum 48dp)
- **High contrast colors** for outdoor visibility
- **Offline-first design** with clear offline indicators
- **Emergency-accessible features** with minimal interaction steps

This comprehensive UI/UX guide ensures your Maritime Early Warning System app delivers an intuitive, safe, and visually appealing experience that follows 2025 design standards while meeting the specific needs of maritime users.
