import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Text, Avatar, useTheme, IconButton } from 'react-native-paper';
import { ChatScreenProps } from '../navigation/types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'florist';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'How does it work?',
    sender: 'user',
    timestamp: new Date(2023, 10, 30, 9, 41)
  },
  {
    id: '2',
    text: 'Cool',
    sender: 'user',
    timestamp: new Date(2023, 10, 30, 9, 42)
  },
  {
    id: '3',
    text: 'You just edit any text to type in the conversation you want to show and delete any bubbles you don\'t want to use',
    sender: 'florist',
    timestamp: new Date(2023, 10, 30, 9, 43)
  },
  {
    id: '4',
    text: 'Hmm',
    sender: 'user',
    timestamp: new Date(2023, 10, 30, 9, 44)
  },
  {
    id: '5',
    text: 'I think I get it',
    sender: 'user',
    timestamp: new Date(2023, 10, 30, 9, 45)
  },
  {
    id: '6',
    text: 'Will head to the Help Center if I have more questions tho',
    sender: 'user',
    timestamp: new Date(2023, 10, 30, 9, 46)
  },
  {
    id: '7',
    text: 'Boop!',
    sender: 'florist',
    timestamp: new Date(2023, 10, 30, 9, 47)
  }
];

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // Scroll to bottom when component mounts
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false });
      }
    }, 200);
  }, []);
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.floristMessageContainer
      ]}>
        {!isUser && (
          <Avatar.Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }} 
            size={30} 
            style={styles.avatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.floristMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.floristMessageText
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        
        <View style={styles.floristInfo}>
          <Avatar.Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }} 
            size={36} 
          />
          <View style={styles.floristTextInfo}>
            <Text style={styles.floristName}>Florist</Text>
            <Text style={styles.floristStatus}>Active 17m ago</Text>
          </View>
        </View>
        
        <View style={styles.headerIcons}>
          <IconButton
            icon="phone"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="video"
            size={24}
            onPress={() => {}}
          />
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
      
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <RNTextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Message..."
            placeholderTextColor="#999"
            multiline
          />
          <View style={styles.inputIcons}>
            <TouchableOpacity style={styles.inputIconButton}>
              <Ionicons name="mic-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputIconButton}>
              <Ionicons name="image-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputIconButton}>
              <Ionicons name="happy-outline" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="paper-plane" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  floristInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floristTextInfo: {
    marginLeft: 10,
  },
  floristName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floristStatus: {
    fontSize: 12,
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  floristMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userMessageBubble: {
    backgroundColor: '#2E8B57',
    borderBottomRightRadius: 4,
  },
  floristMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  floristMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  inputIcons: {
    flexDirection: 'row',
  },
  inputIconButton: {
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
}); 