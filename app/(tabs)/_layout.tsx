import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Decks",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="square.stack.3d.down.right.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus" color={color} />
          ),
        }}
      />

      {/*
        TODO
        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="magnifyingglass" color={color} />
            ),
          }}
        />
        */}

      {/* temporary, remove when "browse" is implemented */}
      <Tabs.Screen
        name="browse"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
