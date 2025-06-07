import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function Browse() {
  return (
    <SafeAreaView>
      <ScrollView style={{ height: "100%" }}>
        <View
          style={Platform.OS === "ios" ? styles.content : styles.contentAndroid}
        >
          {/* title */}

          <ThemedText type="title">Browse</ThemedText>

          {/* TODO - implement browse section */}
          <View>
            <ThemedText>Coming Soon!</ThemedText>
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
});
