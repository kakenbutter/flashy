import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { File, Paths } from "expo-file-system/next";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";

export default function Onboarding() {
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");

  const router = useRouter();

  const deck = new File(Paths.document, "example.json");
  deck.create({ overwrite: true });
  deck.write(
    JSON.stringify({
      title: "Example deck",
      description:
        "An example deck to test out the app, featuring definitions for the 10 most commonly used nouns in the English language! Definitions taken from dictionary.com",
      image: "adaptive-icon",
      aspect: "1024/1024",
      cards: [
        {
          front: "time",
          back: "the system of those sequential relations that any event has to any other, as past, present, or future; indefinite and continuous duration regarded as that in which events succeed one another",
        },
        {
          front: "person",
          back: "a human being, whether an adult or child",
        },
        {
          front: "year",
          back: "a period of 365 or 366 days, in the Gregorian calendar, divided into 12 calendar months, now reckoned as beginning Jan. 1 and ending Dec. 31 calendar year, or civil year",
        },
        {
          front: "way",
          back: "manner, mode, or fashion",
        },
        {
          front: "day",
          back: "the interval of light between two successive nights; the time between sunrise and sunset",
        },
        {
          front: "thing",
          back: "a material object without life or consciousness; an inanimate object",
        },
        {
          front: "man",
          back: "an adult male person",
        },
        {
          front: "world",
          back: "the earth or globe, considered as a planet",
        },
        {
          front: "life",
          back: "the condition that distinguishes organisms from inorganic objects and dead organisms, being manifested by growth through metabolism, reproduction, and the power of adaptation to environment through changes originating internally",
        },
        {
          front: "hand",
          back: "the terminal, prehensile part of the upper limb in humans and other primates, consisting of the wrist, metacarpal area, fingers, and thumb",
        },
      ],
    }),
  );

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <ThemedText type="title">Welcome! 👋</ThemedText>
        <ThemedText>
          Welcome to{" "}
          <ThemedText style={{ fontStyle: "italic" }}>flashy</ThemedText> — a
          flashcard app with barely enough features to pass as one!
        </ThemedText>
        <ThemedText>
          Get started by trying out the example deck provided, or make your own!
        </ThemedText>
        <Pressable
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            flexDirection: "row",
            marginTop: 16,
            backgroundColor,
          }}
          onPress={() => {
            router.back();
          }}
        >
          <ThemedText type="defaultSemiBold">Let's go!</ThemedText>
          <IconSymbol
            name="chevron.right"
            style={{ marginLeft: "auto" }}
            color={iconColor}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 32,
    paddingTop: 64,
    gap: 16,
    overflow: "hidden",
    minHeight: "100%",
  },
});
