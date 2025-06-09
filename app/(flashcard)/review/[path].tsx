import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { File, Paths } from "expo-file-system/next";
import { Stack, useLocalSearchParams } from "expo-router";
import { getItem, setItem } from "expo-secure-store";
import { useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  SafeAreaView,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function FlashcardScreen() {
  const { path } = useLocalSearchParams<{ path: string }>();

  const backgroundColor = useThemeColor({}, "background");
  const secondaryColor = useThemeColor({}, "secondary");
  const iconColor = useThemeColor({}, "icon");

  const rotateY = useSharedValue("0deg");
  const translateX = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateY: rotateY.value }, { translateX: translateX.value }],
  }));

  const opacity = useSharedValue(1);
  const tutorialAnimatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const [cardSide, setCardSide] = useState(1);
  const [deckIndex, setDeckIndex] = useState(0);
  const [tutorial, setTutorial] = useState("Tap the card above to flip it!");

  const deck = JSON.parse(new File(Paths.document, path).text());

  const data = (() => {
    let ret: [number, string, string][] = [];

    for (let i = 0; i < deck.cards.length; i++) {
      ret.push([i + 1, deck.cards[i].front, deck.cards[i].back]);
    }

    return ret;
  })();

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{ title: deck.title, headerBackButtonDisplayMode: "minimal" }}
      />

      <View style={styles.content}>
        <Pressable
          onPress={() => {
            if (!getItem("hasFlippedCard")) {
              opacity.value = withSequence(
                withTiming(0, { duration: 500 }, () => {
                  runOnJS(setItem)("hasFlippedCard", "true");
                  runOnJS(setTutorial)("");
                }),
                withTiming(1, { duration: 500 }),
              );
            }

            rotateY.value = withSequence(
              withTiming("90deg", { duration: 300 }),
              withTiming("270deg", { duration: 0 }, () => {
                runOnJS(setCardSide)(cardSide === 1 ? 2 : 1);
              }),
              withTiming("360deg", { duration: 300 }),
              withTiming("0deg", { duration: 0 }),
            );
          }}
          style={{
            flex: 1,
            borderRadius: 32,
            backgroundColor: secondaryColor,
          }}
        >
          <Animated.View
            style={[{ backgroundColor }, styles.flashcard, animatedStyles]}
          >
            <View
              style={[
                {
                  borderRadius: 16,
                  backgroundColor: secondaryColor,
                  position: "absolute",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  top: 32,
                  left: 32,
                  flexDirection: "row",
                  gap: 12,
                },
              ]}
            >
              <ThemedText type="defaultSemiBold">
                {data[deckIndex][0]}
              </ThemedText>
              <ThemedText style={{ color: iconColor, fontStyle: "italic" }}>
                {cardSide === 1 ? "front" : "back"}
              </ThemedText>
            </View>

            <ThemedText type="subtitle" style={{ margin: "auto" }}>
              {data[deckIndex][cardSide]}
            </ThemedText>
          </Animated.View>
        </Pressable>
        <Animated.View
          style={[
            { height: "8%", flexDirection: "row", gap: 16 },
            tutorialAnimatedStyles,
          ]}
        >
          {getItem("hasFlippedCard") ? (
            <>
              <Pressable
                style={[styles.button, { backgroundColor }]}
                onPress={() => {
                  translateX.value = withSequence(
                    withTiming(-2048, { duration: 300 }),
                    withTiming(2048, { duration: 0 }, () => {
                      if (deckIndex === 0)
                        runOnJS(setDeckIndex)(data.length - 1);
                      else runOnJS(setDeckIndex)(deckIndex - 1);
                      runOnJS(setCardSide)(1);
                    }),
                    withTiming(0, { duration: 300 }),
                  );
                }}
              >
                <View style={{ flexDirection: "row", margin: "auto", gap: 8 }}>
                  <ThemedText type="defaultSemiBold">Previous</ThemedText>
                  <IconSymbol name="chevron.left" color={iconColor} />
                </View>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor }]}
                onPress={() => {
                  translateX.value = withSequence(
                    withTiming(2048, { duration: 400 }),
                    withTiming(-2048, { duration: 0 }, () => {
                      if (deckIndex === data.length - 1)
                        runOnJS(setDeckIndex)(0);
                      else runOnJS(setDeckIndex)(deckIndex + 1);
                      runOnJS(setCardSide)(1);
                    }),
                    withTiming(0, { duration: 400 }),
                  );
                }}
              >
                <View style={{ flexDirection: "row", margin: "auto", gap: 8 }}>
                  <ThemedText type="defaultSemiBold">Next</ThemedText>
                  <IconSymbol name="chevron.right" color={iconColor} />
                </View>
              </Pressable>
            </>
          ) : (
            <View style={{ margin: "auto" }}>
              <ThemedText type="defaultSemiBold">{tutorial}</ThemedText>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 32,
    overflow: "hidden",
    minHeight: "100%",
    gap: 16,
    flexDirection: "column",
  },
  flashcard: {
    borderRadius: 32,
    padding: 32,
    overflow: "scroll",
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
});
