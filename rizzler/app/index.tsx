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
      {/* Instagram-style header */}
      <View style={styles.header}>
        <Image
          source={require('./assets/logo.png')} // your Rizzler logo
          style={styles.logo}
        />
        <Text style={styles.headerText}>Rizzler</Text>
      </View>

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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  logo: { width: 30, height: 30, marginRight: 10, borderRadius: 15 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },

  container: { flex: 1 },
  chatContainer: { padding: 10, paddingBottom: 80 },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  userText: { color: '#000' },
  aiText: { color: '#000' },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#3897f0', // Instagram blue
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default Home;
