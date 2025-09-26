---
title: "Add Forecasts tab UI and marine summary"
date: 2025-09-25
author: GitHub Copilot
files:
  - app/(tabs)/forecasts/index.tsx
summary: |
  Implemented the Forecasts tab index screen to display a list of daily forecast cards
  using data from `useWeatherData`, and a small marine summary populated from
  `useMarineForecast`. Added loading and error states and worked around react-native-paper
  Card typing variations by using a `CardContent` alias.
