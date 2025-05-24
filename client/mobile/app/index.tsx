import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Index() {

  const router = useRouter();

  return (
    <SafeAreaProvider >
      <SafeAreaView className="bg-black" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
 
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => router.push("/(tabs)/(home)")}>
              <Text className="text-blue-600" style={{ textAlign: "center" }}>Go to home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
