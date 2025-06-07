import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";
import { File, Paths } from "expo-file-system/next";
import { toast } from "burnt";

export default function FlashcardScreen() {
  const { path } = useLocalSearchParams<{ path: string }>();

  const backgroundColor = useThemeColor({}, "background");
  const secondaryColor = useThemeColor({}, "secondary");
  const iconColor = useThemeColor({}, "icon");

  const deck = JSON.parse(new File(Paths.document, path).text());

  const router = useRouter();

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />

      <ScrollView style={{ height: "100%" }}>
        <View style={styles.content}>
          <View style={{ flexDirection: "row" }}>
            <ThemedText type="title">{deck.title}</ThemedText>
            <View
              style={{
                marginLeft: "auto",
                flexDirection: "row",
                gap: 16,
                position: "absolute",
                top: Platform.OS === "ios" ? -8 : -4,
                right: 0,
              }}
            >
              <Link
                href={{
                  pathname: "/(flashcard)/edit/[path]",
                  params: { path },
                }}
                push
                asChild
              >
                <Pressable
                  style={{
                    padding: 8,
                    borderRadius: 32,
                    backgroundColor,
                  }}
                >
                  <IconSymbol name="pencil" color={iconColor} />
                </Pressable>
              </Link>

              <Pressable
                style={{
                  padding: 8,
                  borderRadius: 32,
                  backgroundColor,
                }}
                onPress={() => {
                  try {
                    new File(Paths.document, path).delete();
                    toast({
                      preset: "done",
                      title: "Success",
                      message: "Deck deleted",
                      duration: 2,
                    });
                    router.replace("/(tabs)");
                  } catch {
                    toast({
                      preset: "error",
                      title: "Error",
                      message: "Something went wrong",
                      duration: 2,
                    });
                  }
                }}
              >
                <IconSymbol name="trash.fill" color={iconColor} />
              </Pressable>
            </View>
          </View>

          <View style={[{ backgroundColor }, styles.imageContainer]}>
            {deck.image.length > 0 ? (
              <Image
                source={{ uri: deck.image }}
                cachePolicy="none"
                style={{
                  aspectRatio: deck.aspect,
                  margin: "auto",
                }}
              />
            ) : (
              <View style={{ margin: "auto", justifyContent: "center" }}>
                <IconSymbol
                  size={64}
                  name="photo"
                  style={{ marginHorizontal: "auto" }}
                  color={iconColor}
                />
                <ThemedText style={{ color: iconColor }}>
                  No image found
                </ThemedText>
              </View>
            )}
          </View>

          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <ThemedText type="subtitle">Description</ThemedText>
              {deck.description.length === 0 ? (
                <ThemedText style={{ fontStyle: "italic", color: iconColor }}>
                  No description found.
                </ThemedText>
              ) : (
                <ThemedText>{deck.description}</ThemedText>
              )}
            </View>
            <View style={{ gap: 16 }}>
              <ThemedText type="subtitle">Cards</ThemedText>
              {deck.cards.length === 0 ? (
                <View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: iconColor }}
                  >
                    No cards found ⁉️
                  </ThemedText>
                  <ThemedText style={{ color: iconColor }}>
                    I don't know how, but you did it. You should probably add
                    some cards!
                  </ThemedText>
                </View>
              ) : (
                <View
                  style={{
                    borderRadius: 32,
                    gap: 16,
                    padding: 20,
                    backgroundColor,
                  }}
                >
                  {deck.cards.map(
                    (item: { front: string; back: string }, index: number) => (
                      <View key={index} style={{ gap: 12 }}>
                        {index !== 0 ? (
                          <View
                            style={{
                              height: 4,
                              backgroundColor: secondaryColor,
                              marginHorizontal: 8,
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                        ) : (
                          <></>
                        )}
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={{
                              borderRadius: 16,
                              backgroundColor: secondaryColor,
                              paddingHorizontal: 12,
                              paddingVertical: 4,
                            }}
                          >
                            <ThemedText
                              type="defaultSemiBold"
                              style={{ color: iconColor }}
                            >
                              Card {index + 1}
                            </ThemedText>
                          </View>
                        </View>

                        <View
                          style={{
                            borderRadius: 16,
                            padding: 16,
                            backgroundColor: secondaryColor,
                          }}
                        >
                          <ThemedText type="defaultSemiBold">
                            {item.front}
                          </ThemedText>
                        </View>
                        <View
                          style={{
                            borderRadius: 16,
                            padding: 16,
                            backgroundColor: secondaryColor,
                          }}
                        >
                          <ThemedText type="defaultSemiBold">
                            {item.back}
                          </ThemedText>
                        </View>
                      </View>
                    ),
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <BlurView
        style={styles.buttonContainer}
        tint={useColorScheme() ?? "default"}
        intensity={Platform.OS === "ios" ? 50 : 100}
      >
        <View style={[styles.button, { backgroundColor }]}>
          <Link
            href={{
              pathname: "/(flashcard)/main/[path]",
              params: { path },
            }}
            push
            asChild
          >
            <Pressable style={{ flexDirection: "row" }}>
              <ThemedText type="defaultSemiBold">Start</ThemedText>
              <IconSymbol
                size={24}
                name="chevron.right"
                color={iconColor}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
          </Link>
        </View>
        <View style={[styles.button, { backgroundColor }]}>
          <Link
            href={{
              pathname: "/(flashcard)/review/[path]",
              params: { path },
            }}
            push
            asChild
          >
            <Pressable style={{ flexDirection: "row" }}>
              <ThemedText type="defaultSemiBold">Review</ThemedText>
              <IconSymbol
                size={24}
                name="chevron.right"
                color={iconColor}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>
          </Link>
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 32,
    paddingBottom: 96,
    gap: 16,
    overflow: "hidden",
    minHeight: "100%",
  },
  imageContainer: {
    minHeight: 224,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 8,
  },
  buttonContainer: {
    position: "absolute",
    paddingHorizontal: 32,
    paddingBottom: 32,
    width: "100%",
    paddingTop: 16,
    bottom: 0,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    paddingHorizontal: 24,
    flex: 1,
  },
});
