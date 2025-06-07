import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Directory, File, Paths } from "expo-file-system/next";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";

export default function Home() {
  const backgroundColor = useThemeColor({}, "background");
  const secondaryColor = useThemeColor({}, "secondary");
  const iconColor = useThemeColor({}, "icon");

  const decks = new Directory(Paths.document)
    .list()
    .map((item) => {
      if (item instanceof File) {
        try {
          return JSON.parse(item.text());
        } catch {
          return null;
        }
      }
      return null;
    })
    .filter(Boolean);

  const router = useRouter();

  const paths = new Directory(Paths.document)
    .list()
    .map((item) => {
      if (item instanceof File) {
        try {
          JSON.parse(item.text());
          return item.uri.split("/").at(-1)!;
        } catch {
          return "";
        }
      }
      return "";
    })
    .filter((value) => value.length !== 0);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await getItemAsync("hasLaunched");
      if (!hasLaunched) {
        await setItemAsync("hasLaunched", "true");
        router.navigate("/onboarding");
      }
    };
    checkFirstLaunch();
  }, [router]);

  return (
    <SafeAreaView>
      <ScrollView style={{ height: "100%" }}>
        <View
          style={Platform.OS === "ios" ? styles.content : styles.contentAndroid}
        >
          <ThemedText type="title">Decks</ThemedText>

          <View style={{ height: "100%" }}>
            {decks.length === 0 ? (
              <View
                style={{
                  marginHorizontal: "auto",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText type="subtitle" style={{ color: iconColor }}>
                  No decks found 🙁
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={{ color: iconColor }}>
                  Create a deck to get started!
                </ThemedText>
              </View>
            ) : (
              decks.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      { backgroundColor: backgroundColor },
                      styles.buttonContainer,
                    ]}
                  >
                    <Link
                      href={{
                        pathname: "/(flashcard)/menu/[path]",
                        params: {
                          path: paths[index],
                        },
                      }}
                      push
                      asChild
                    >
                      <Pressable style={styles.button}>
                        {item.image.length > 0 ? (
                          <View
                            style={[
                              { backgroundColor: secondaryColor },
                              styles.imageContainer,
                            ]}
                          >
                            <Image
                              source={{ uri: item.image }}
                              cachePolicy="none"
                              style={{ height: "100%" }}
                            />
                          </View>
                        ) : (
                          <View
                            style={[
                              { backgroundColor: secondaryColor },
                              styles.imageContainer,
                            ]}
                          >
                            <IconSymbol
                              size={28}
                              name="photo"
                              style={{ margin: "auto" }}
                              color={iconColor}
                            />
                          </View>
                        )}
                        <ThemedText
                          type="defaultSemiBold"
                          style={{
                            marginLeft: 16,
                            width: "60%",
                            marginVertical: "auto",
                          }}
                          numberOfLines={2}
                        >
                          {item.title}
                        </ThemedText>
                        <IconSymbol
                          size={28}
                          name="chevron.right"
                          style={{
                            marginVertical: "auto",
                            marginLeft: "auto",
                          }}
                          color={iconColor}
                        />
                      </Pressable>
                    </Link>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 32,
    paddingBottom: 64,
    gap: 16,
    overflow: "hidden",
    height: "100%",
  },
  contentAndroid: {
    padding: 32,
    paddingTop: 48,
    gap: 16,
    overflow: "hidden",
    height: "100%",
  },
  buttonContainer: {
    paddingRight: 32,
    paddingLeft: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    flexDirection: "row",
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    aspectRatio: 1,
    minHeight: 64,
  },
});
