import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Love_01 from "../assets/icon/profile/love_01.svg";
import Love_04 from "../assets/icon/profile/love_04.svg";

import ChatMessage from "../chat/components/ChatMessage";
import ChatInput from "../chat/components/ChatInput";
import ChatSidebar from "../chat/components/ChatSidebar";
import ChatHeader from "../chat/components/ChatHeader";
import ExitModal from "../chat/components/ExitModal";
import EventModal from "../chat/components/EventModal";
import ResultModal from "../chat/components/ResultModal";
import SignalModal from "../chat/components/SignalModal";

import { useChat } from "../context/ChatContext";
import { subscribeChatRoom } from "../lib/socket";

export default function Chat({ navigation }) {
  const route = useRoute();
  const roomId = route.params?.roomId;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [eventConfirmed, setEventConfirmed] = useState(false);
  const [selectedGameIcon, setSelectedGameIcon] = useState(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [thirdModalVisible, setThirdModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;
  const scrollViewRef = useRef(null);

  const {
    currentRoomMessages,
    setCurrentRoomMessages,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useChat();

  // ✅ 채팅방 입장 및 메시지 구독
  useEffect(() => {
    if (!roomId) return;

    joinRoom(roomId);

    subscribeChatRoom(roomId, (type, msg) => {
      if (type === "CHAT") {
        const convertedMsg = {
          ...msg,
          sender: msg.nickName,            // 💥 서버 → 클라 필드명 맞춤
          content: msg.message,            // 💥 서버 → 클라 필드명 맞춤
          timestamp: msg.createdAt,        // 💥 시간 필드 맞춤
        };

        console.log("[수신된 메시지]", convertedMsg); // ✅ 확인용 로그
        setCurrentRoomMessages((prev) => [...prev, convertedMsg]);
      }
    });

    return () => {
      leaveRoom();
    };
  }, [roomId]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? 0 : Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible]);

  const handleEventConfirm = () => {
    setEventModalVisible(false);
    setSelectedGameIcon(null);
    setTimeout(() => setResultModalVisible(true), 300);
  };

  const handleResultConfirm = () => {
    setResultModalVisible(false);
    setTimeout(() => setThirdModalVisible(true), 300);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ChatHeader
          title="하트시그널"
          onBack={handleBack}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        />

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 100 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {currentRoomMessages.map((msg, index) => (
            <ChatMessage
              key={msg.id || index}
              message={msg.content || msg.message}        // 💬 내용
              type={msg.sender === "current_user" ? "right" : "left"}
              sender={msg.sender || msg.nickName}         // 🙋‍♂️ 보낸 사람
              icon={msg.sender === "current_user" ? Love_04 : Love_01}
              time={new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))}
        </ScrollView>

        <ChatInput onSendMessage={sendMessage} />

        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
        >
          <ChatSidebar
            onClose={() => setSidebarVisible(false)}
            onEventPress={() => setEventModalVisible(true)}
            onExitPress={() => setExitModalVisible(true)}
            onReportPress={() => navigation.navigate("ChatReport")}
            navigation={navigation}
          />
        </Animated.View>

        <ExitModal
          visible={exitModalVisible}
          onClose={() => setExitModalVisible(false)}
          onConfirm={() => setExitModalVisible(false)}
        />

        <EventModal
          visible={eventModalVisible}
          onClose={() => setEventModalVisible(false)}
          onConfirm={handleEventConfirm}
          isConfirmed={eventConfirmed}
          selectedIcon={selectedGameIcon}
          onSelectIcon={setSelectedGameIcon}
        />

        <ResultModal
          visible={resultModalVisible}
          onClose={() => setResultModalVisible(false)}
          onConfirm={handleResultConfirm}
        />

        <SignalModal
          visible={thirdModalVisible}
          onClose={() => setThirdModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
});
