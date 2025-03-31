import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, disconnectSocket } from "../lib/socket";
import Hihi from "../assets/public/hihi.svg"; // SVG 이미지
import { useNavigation } from "@react-navigation/native"; // ✅ navigation 사용

function MatchingWaitingScreen() {
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigation = useNavigation(); // ✅ navigation 객체 생성

  useEffect(() => {
    connectSocket((type, message) => {
      if (type === "MATCHING") {
        setStatusMessage(message);
        const names = message
          .split("\n")
          .slice(1)
          .filter((name) => !!name.trim());
        setParticipants(names);
      }
    });

    return () => disconnectSocket();
  }, []);

  const handleJoin = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch("http://192.168.219.102:8080/matching/join", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("[응답]", data);

      setJoined(true);

      if (data.chatRoomId) {
        // ✅ 채팅방으로 이동
        navigation.navigate("ChatRoomScreen", { roomId: data.chatRoomId });
      }

    } catch (error) {
      console.error("입장 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Hihi width={150} height={150} />
      <Text style={styles.title}>대기실</Text>
      {!joined ? (
        <Button title="입장하기" onPress={handleJoin} /> // ✅ 연결됨!
      ) : (
        <Text style={styles.joined}>입장 완료! 매칭을 기다리는 중...</Text>
      )}
      <Text style={styles.status}>{statusMessage}</Text>

      <ScrollView style={styles.scroll}>
        {participants.map((name, idx) => (
          <Text key={idx} style={styles.participant}>
            {name}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

export default MatchingWaitingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  joined: { marginVertical: 10, color: "green" },
  status: { fontSize: 16, marginVertical: 10 },
  scroll: { width: "100%", marginTop: 20 },
  participant: {
    fontSize: 18,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
});
