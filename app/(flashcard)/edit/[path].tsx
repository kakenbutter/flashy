import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import { toast } from "burnt";

import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image } from "expo-image";
import { File, Paths } from "expo-file-system/next";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function Edit() {
  const { path } = useLocalSearchParams<{ path: string }>();

  const deck = JSON.parse(new File(Paths.document, path).text());

  const backgroundColor = useThemeColor({}, "background");
  const secondaryColor = useThemeColor({}, "secondary");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [image, setImage] = useState(deck.image);
  const [aspect, setAspect] = useState(deck.aspect);
  const [cards, setCards] = useState<{ front: string; back: string }[]>(
    deck.cards,
  );

  const [cameraPermissions, requestCameraPermissions] =
    ImagePicker.useCameraPermissions();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />

      <KeyboardAwareScrollView bottomOffset={62} style={{ height: "100%" }}>
        <View style={styles.content}>
          <ThemedText type="title">Edit deck</ThemedText>

          <Pressable
            style={{
              flexDirection: "row",
              gap: 8,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor,
              position: "absolute",
              top: Platform.OS === "ios" ? 24 : 40,
              right: 32,
            }}
            onPress={() => {
              if (title.length === 0 || title.trim().length === 0) {
                toast({
                  preset: "error",
                  title: Platform.OS === "ios" ? "Error" : "Invalid title",
                  message: "Invalid title",
                  duration: 2,
                });
              } else if (cards.length === 0) {
                toast({
                  preset: "error",
                  title:
                    Platform.OS === "ios"
                      ? "Error"
                      : "At least one card required",
                  message: "At least one card required",
                  duration: 2,
                });
              } else if (
                !cards.every(
                  (item) => item.front.length > 0 && item.back.length > 0,
                )
              ) {
                toast({
                  preset: "error",
                  title: Platform.OS === "ios" ? "Error" : "Invalid card text",
                  message: "Invalid card text",
                  duration: 2,
                });
              } else {
                toast({
                  preset: "done",
                  title: Platform.OS === "ios" ? "Success" : "Deck edited",
                  message: "Deck edited",
                  duration: 2,
                });
                try {
                  let file = new File(Paths.document, path);
                  file.create({ overwrite: true });
                  file.write(
                    JSON.stringify({
                      title,
                      description,
                      image,
                      aspect,
                      cards,
                    }),
                  );
                  setTitle("");
                  setDescription("");
                  setImage("");
                  setAspect("");
                  setCards([]);
                  router.replace("/(tabs)");
                } catch {
                  toast({
                    preset: "error",
                    title:
                      Platform.OS === "ios" ? "Error" : "Something went wrong",
                    message: "Something went wrong",
                    duration: 2,
                  });
                }
              }
            }}
          >
            <IconSymbol name="plus" color={iconColor} />
            <ThemedText type="defaultSemiBold">Save Deck</ThemedText>
          </Pressable>

          <View style={[styles.groupContainer, { backgroundColor }]}>
            <View style={[styles.textBox, { backgroundColor: secondaryColor }]}>
              <TextInput
                placeholder="Title"
                onChangeText={(value) => setTitle(value.replace("\n", ""))}
                value={title}
                style={{
                  fontSize: 24,
                  lineHeight: 28,
                  fontWeight: "600",
                  color: textColor,
                }}
                multiline
                maxLength={40}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: Platform.OS === "ios" ? 8 : 0,
                  marginHorizontal: Platform.OS === "android" ? 4 : 0,
                }}
              >
                <ThemedText
                  style={{
                    fontStyle: "italic",
                    color: iconColor,
                  }}
                >
                  The title of your deck
                </ThemedText>
                <ThemedText
                  style={{
                    fontStyle: "italic",
                    color: iconColor,
                    marginLeft: "auto",
                  }}
                >
                  {title.length}/40
                </ThemedText>
              </View>
            </View>

            <View
              style={[
                styles.textBox,
                { backgroundColor: secondaryColor, minHeight: 128 },
              ]}
            >
              <TextInput
                placeholder="Description"
                onChangeText={setDescription}
                value={description}
                style={[
                  styles.textInput,
                  {
                    color: textColor,
                    flex: 1,
                  },
                ]}
                multiline
                maxLength={200}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: "auto",
                  marginHorizontal: Platform.OS === "android" ? 4 : 0,
                }}
              >
                <ThemedText
                  style={{
                    fontStyle: "italic",
                    color: iconColor,
                  }}
                >
                  Description for your deck
                </ThemedText>
                <ThemedText
                  style={{
                    fontStyle: "italic",
                    color: iconColor,
                    marginLeft: "auto",
                  }}
                >
                  {description.length}/200
                </ThemedText>
              </View>
            </View>

            <Pressable
              style={{
                borderRadius: 16,
                backgroundColor: secondaryColor,
                overflow: "hidden",
                minHeight: 108,
              }}
              onPress={() => {
                const options = [
                  "Use camera",
                  "Pick from photo library",
                  "Cancel",
                ];
                const cancelButtonIndex = 2;

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                  },
                  async (selectedIndex) => {
                    switch (selectedIndex) {
                      case 0:
                        if (!cameraPermissions?.granted) {
                          await requestCameraPermissions();
                        }

                        const camera = await ImagePicker.launchCameraAsync({
                          mediaTypes: ["images"],
                          quality: 1,
                          base64: true,
                        });
                        if (!camera.canceled) {
                          setImage(
                            "data:image/jpeg;base64," + camera.assets[0].base64,
                          );
                          setAspect(
                            camera.assets[0].width +
                              "/" +
                              camera.assets[0].height,
                          );
                        }
                        break;
                      case 1:
                        const library =
                          await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ["images"],
                            quality: 1,
                            base64: true,
                          });
                        if (!library.canceled) {
                          setImage(
                            "data:image/jpeg;base64," +
                              library.assets[0].base64,
                          );
                          setAspect(
                            library.assets[0].width +
                              "/" +
                              library.assets[0].height,
                          );
                        }
                        break;
                      case cancelButtonIndex:
                    }
                  },
                );
              }}
            >
              {image.length === 0 ? (
                <View
                  style={{
                    margin: "auto",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol name="plus" color={iconColor} />
                  <ThemedText style={{ color: iconColor }}>
                    Add an image
                  </ThemedText>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: image }}
                    cachePolicy="none"
                    style={{ aspectRatio: aspect }}
                  />

                  <Pressable
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      padding: 8,
                      borderRadius: 32,
                      backgroundColor: secondaryColor,
                    }}
                    onPress={() => {
                      setImage("");
                    }}
                  >
                    <IconSymbol name="trash.fill" color={iconColor} />
                  </Pressable>
                </>
              )}
            </Pressable>
          </View>

          {/* TODO - add image support for cards */}

          <ThemedText type="subtitle">Cards</ThemedText>

          <View style={[styles.groupContainer, { backgroundColor }]}>
            {cards.map((item, index) => {
              const front = item.front;
              const back = item.back;

              return (
                <View key={index} style={{ gap: 16 }}>
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
                    <Pressable
                      style={{
                        borderRadius: 16,
                        backgroundColor: secondaryColor,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        flexDirection: "row",
                        marginLeft: "auto",
                      }}
                      onPress={() => {
                        setCards(
                          cards.slice(0, index).concat(cards.slice(index + 1)),
                        );
                      }}
                    >
                      <IconSymbol
                        name="trash.fill"
                        color={iconColor}
                        size={20}
                        style={{ marginVertical: "auto" }}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: iconColor }}
                      >
                        {" "}
                        Delete
                      </ThemedText>
                    </Pressable>
                  </View>
                  <View
                    style={[
                      styles.textBox,
                      { backgroundColor: secondaryColor },
                    ]}
                  >
                    <TextInput
                      placeholder="Front"
                      onChangeText={(text) => {
                        setCards(
                          cards
                            .slice(0, index)
                            .concat([
                              {
                                front: text,
                                back: back,
                              },
                            ])
                            .concat(cards.slice(index + 1)),
                        );
                      }}
                      value={front}
                      style={[
                        styles.textInput,
                        {
                          color: textColor,
                        },
                      ]}
                      multiline
                      maxLength={200}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "auto",
                        marginHorizontal: Platform.OS === "android" ? 4 : 0,
                      }}
                    >
                      <ThemedText
                        style={{
                          fontStyle: "italic",
                          color: iconColor,
                        }}
                      >
                        Text on front of card
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontStyle: "italic",
                          color: iconColor,
                          marginLeft: "auto",
                        }}
                      >
                        {front.length}/200
                      </ThemedText>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.textBox,
                      {
                        backgroundColor: secondaryColor,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Back"
                      onChangeText={(text) => {
                        setCards(
                          cards
                            .slice(0, index)
                            .concat([
                              {
                                front: front,
                                back: text,
                              },
                            ])
                            .concat(cards.slice(index + 1)),
                        );
                      }}
                      value={back}
                      style={[
                        styles.textInput,
                        {
                          color: textColor,
                        },
                      ]}
                      multiline
                      maxLength={200}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "auto",
                        marginHorizontal: Platform.OS === "android" ? 4 : 0,
                      }}
                    >
                      <ThemedText
                        style={{
                          fontStyle: "italic",
                          color: iconColor,
                        }}
                      >
                        Text on back of card
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontStyle: "italic",
                          color: iconColor,
                          marginLeft: "auto",
                        }}
                      >
                        {back.length}/200
                      </ThemedText>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 4,
                      backgroundColor: secondaryColor,
                      marginHorizontal: 8,
                      borderRadius: 8,
                    }}
                  />
                </View>
              );
            })}

            <Pressable
              style={{
                borderRadius: 16,
                backgroundColor: secondaryColor,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 128,
              }}
              onPress={() => {
                setCards([...cards, { front: "", back: "" }]);
              }}
            >
              <IconSymbol name="plus" color={iconColor} />
              <ThemedText style={{ color: iconColor }}>
                Add a new card
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 32,
    gap: 24,
    overflow: "hidden",
    height: "100%",
  },
  textBox: {
    padding: 16,
    borderRadius: 16,
    paddingVertical: 12,
  },
  groupContainer: {
    gap: 16,
    padding: 20,
    borderRadius: 32,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 21,
    marginBottom: Platform.OS === "ios" ? 8 : 0,
  },
});
