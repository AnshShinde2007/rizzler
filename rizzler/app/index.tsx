import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from 'expo-router';  // ✅ works in Expo Router
import { Ionicons } from '@expo/vector-icons';
import { fetchRizz } from './api/fetchrizz';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await fetchRizz(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Something went wrong 😅',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMsg]);
      console.error(err);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with hamburger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#6A1B9A" />
        </TouchableOpacity>
        <Image source={require('./assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerText}>Rizzler</Text>
      </View>

      {/* Chat area */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  
container: { flex: 1 },
  chatContainer: { padding: 10, paddingBottom: 80 },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#6A1B9A',
    alignSelf: 'flex-end',
    borderTopRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#F0F2F5',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 5,
  },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#000000' },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#D81B60',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default Home;
