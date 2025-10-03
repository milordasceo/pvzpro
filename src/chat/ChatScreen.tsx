import React from 'react';
import {
  View,
  Animated,
  Text as RNText,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Appbar, Avatar, Text, TextInput, useTheme, Menu, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledScrollView, SquareIconButton, StyledDialog } from '../components';

type Role = 'me' | 'manager' | 'system';

type PenaltyAttachment = {
  amount: number;
  description: string;
  category: string;
  severity: string;
  color: string;
  date: string;
  relatedItemPrice?: number;
};

type Message = {
  id: string;
  role: Role;
  text: string;
  at: number;
  penaltyAttachment?: PenaltyAttachment;
};

export const ChatScreen: React.FC<any> = ({ route, navigation }) => {
  const theme = useTheme();
  const title = route?.params?.title ?? 'Чат';
  const initialMessage = route?.params?.initialMessage;
  const penaltyData = route?.params?.penaltyData;
  
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 's1', role: 'system', text: 'Чат создан', at: Date.now() - 60_000 },
    { id: 'm1', role: 'manager', text: 'Здравствуйте! Чем могу помочь?', at: Date.now() - 55_000 },
  ]);
  const [text, setText] = React.useState('');
  const [penaltyMessageAdded, setPenaltyMessageAdded] = React.useState(false);
  const [attachmentsVisible, setAttachmentsVisible] = React.useState(false);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const emojiHeight = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<any>(null);
  const inputRef = React.useRef<any>(null);
  const [inputSearch, setInputSearch] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [confirmClearVisible, setConfirmClearVisible] = React.useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [muted, setMuted] = React.useState(false);

  const scrollToEnd = React.useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    });
  }, []);
  
  // Добавляем сообщение со штрафом при загрузке, если есть данные (только один раз)
  React.useEffect(() => {
    if (penaltyData && initialMessage && !penaltyMessageAdded) {
      setPenaltyMessageAdded(true);
      setTimeout(() => {
        const newMsg: Message = {
          id: `penalty-${Date.now()}`,
          role: 'me',
          text: initialMessage,
          at: Date.now(),
          penaltyAttachment: penaltyData,
        };
        setMessages((prev) => [...prev, newMsg]);
        // Прокручиваем к новому сообщению
        setTimeout(() => scrollToEnd(), 100);
      }, 300);
    }
  }, [penaltyData, initialMessage, penaltyMessageAdded, scrollToEnd]);

  const closeEmoji = React.useCallback(() => {
    setEmojiOpen(false);
    Animated.timing(emojiHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [emojiHeight]);

  const toggleEmoji = React.useCallback(() => {
    setEmojiOpen((prev) => {
      const next = !prev;
      Animated.timing(emojiHeight, {
        toValue: next ? 220 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      // удерживаем фокус на поле ввода
      setTimeout(() => inputRef.current?.focus?.(), 0);
      return next;
    });
  }, [emojiHeight]);

  const emojiSet = React.useMemo(
    () => [
      '😀',
      '😁',
      '😂',
      '🥲',
      '😊',
      '😍',
      '😘',
      '🤗',
      '🤔',
      '😎',
      '😇',
      '🙂',
      '🙃',
      '😌',
      '🤩',
      '🤝',
      '👍',
      '👏',
      '🙏',
      '🤙',
      '🫶',
      '💪',
      '🔥',
      '✨',
      '🎉',
      '✅',
      '❗',
      '❓',
      '📷',
      '📎',
    ],
    [],
  );

  const onSend = React.useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Math.random()), role: 'me', text: trimmed, at: Date.now() },
    ]);
    setText('');
    closeEmoji();
    scrollToEnd();
  }, [text, scrollToEnd, closeEmoji]);

  const addSystemMessage = React.useCallback((t: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Math.random()), role: 'system', text: t, at: Date.now() },
    ]);
  }, []);

  const onTogglePinned = React.useCallback(() => {
    setPinned((v) => {
      const next = !v;
      addSystemMessage(next ? 'Чат закреплён' : 'Чат откреплён');
      return next;
    });
    setMenuVisible(false);
  }, [addSystemMessage]);

  const onToggleMuted = React.useCallback(() => {
    setMuted((v) => {
      const next = !v;
      addSystemMessage(next ? 'Уведомления выключены' : 'Уведомления включены');
      return next;
    });
    setMenuVisible(false);
  }, [addSystemMessage]);

  const onPickImage = React.useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!res.canceled && res.assets?.length) {
        setMessages((prev: Message[]) => [
          ...prev,
          { id: String(Math.random()), role: 'me', text: '📷 Фото прикреплено', at: Date.now() },
        ]);
        scrollToEnd();
      }
    } catch {}
  }, [scrollToEnd]);

  const onTakePhoto = React.useCallback(async () => {
    try {
      const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!res.canceled && res.assets?.length) {
        setMessages((prev) => [
          ...prev,
          { id: String(Math.random()), role: 'me', text: '📷 Фото снято', at: Date.now() },
        ]);
        scrollToEnd();
      }
    } catch {}
  }, [scrollToEnd]);

  const onPickFile = React.useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({});
      if (!res.canceled) {
        const fileName = res.assets?.[0]?.name ?? 'файл';
        setMessages((prev) => [
          ...prev,
          { id: String(Math.random()), role: 'me', text: `📎 Файл: ${fileName}`, at: Date.now() },
        ]);
        scrollToEnd();
      }
    } catch {}
  }, [scrollToEnd]);

  return (
    <View style={{ flex: 1, backgroundColor: '#E5DDD5' }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Action icon="arrow-left" size={20} onPress={() => navigation?.goBack?.()} />
        <Avatar.Text
          size={28}
          label={title.slice(0, 2).toUpperCase()}
          style={{ marginLeft: 4, marginRight: 8 }}
        />
        <Appbar.Content
          title={title}
          subtitle="был(а) недавно"
          titleStyle={{ fontSize: 16, fontWeight: '600' }}
          subtitleStyle={{ fontSize: 12, color: '#9CA3AF' }}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              size={20}
              onPress={() => setMenuVisible((prev) => !prev)}
            />
          }
        >
          <Menu.Item
            onPress={onTogglePinned}
            title={pinned ? 'Открепить' : 'Закрепить'}
            leadingIcon={pinned ? 'pin-off' : 'pin'}
          />
          <Menu.Item
            onPress={onToggleMuted}
            title={muted ? 'Включить уведомления' : 'Выключить уведомления'}
            leadingIcon={muted ? 'bell' : 'bell-off'}
          />
          <Menu.Item
            onPress={() => {
              setSearchVisible(true);
              setMenuVisible(false);
            }}
            title="Поиск"
            leadingIcon="magnify"
          />
          <Menu.Item
            onPress={() => {
              setConfirmClearVisible(true);
              setMenuVisible(false);
            }}
            title="Очистить историю"
            leadingIcon="broom"
          />
          <Menu.Item
            onPress={() => {
              setConfirmDeleteVisible(true);
              setMenuVisible(false);
            }}
            title="Удалить чат"
            leadingIcon="delete"
          />
        </Menu>
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StyledScrollView ref={scrollViewRef}>
          {messages.map((item) => {
            if (item.role === 'system') {
              return (
                <View key={item.id} style={{ alignItems: 'center', marginVertical: 6 }}>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>
                    {new Date(item.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {item.text}
                  </Text>
                </View>
              );
            }
            const isMe = item.role === 'me';
            const formatRUB = (n: number) =>
              new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
              }).format(n);
            
            return (
              <View
                key={item.id}
                style={{
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  marginVertical: 2,
                  paddingHorizontal: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: isMe ? '#DCF8C6' : '#FFFFFF',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    maxWidth: '82%',
                    borderTopLeftRadius: isMe ? 12 : 2,
                    borderTopRightRadius: isMe ? 2 : 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 1,
                  }}
                >
                  <Text style={{ color: '#111827' }}>{item.text}</Text>
                  
                  {/* Карточка штрафа */}
                  {item.penaltyAttachment && (
                    <View
                      style={{
                        marginTop: 8,
                        padding: 10,
                        backgroundColor: '#FFF',
                        borderWidth: 1,
                        borderColor: '#FEE2E2',
                        borderRadius: 8,
                        gap: 6,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons
                          name="alert-circle"
                          size={16}
                          color={item.penaltyAttachment.color}
                        />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#111827', flex: 1 }}>
                          {item.penaltyAttachment.description}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <View
                          style={{
                            backgroundColor: `${item.penaltyAttachment.color}20`,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: '600', color: item.penaltyAttachment.color }}>
                            {item.penaltyAttachment.severity}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 10, color: '#6B7280' }}>
                          {item.penaltyAttachment.date}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Сумма штрафа:</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: item.penaltyAttachment.color }}>
                          {formatRUB(item.penaltyAttachment.amount)}
                        </Text>
                      </View>
                      
                      {item.penaltyAttachment.relatedItemPrice && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: 10, color: '#9CA3AF' }}>Стоимость товара:</Text>
                          <Text style={{ fontSize: 11, color: '#6B7280' }}>
                            {formatRUB(item.penaltyAttachment.relatedItemPrice)}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <Text
                    style={{ color: '#6B7280', fontSize: 11, marginTop: 4, alignSelf: 'flex-end' }}
                  >
                    {new Date(item.at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </StyledScrollView>

        {/* Оверлей для закрытия смайликов по клику вне панели */}
        <Animated.View
          pointerEvents={emojiOpen ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFillObject as any, { bottom: emojiHeight, zIndex: 2 }]}
        >
          <Pressable style={{ flex: 1 }} onPress={closeEmoji} />
        </Animated.View>

        {/* Панель смайликов */}
        <Animated.View
          style={{
            height: emojiHeight,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            overflow: 'hidden',
            zIndex: 3,
          }}
        >
          {emojiOpen && (
            <FlatList
              data={emojiSet}
              keyExtractor={(item, index) => `${item}-${index}`}
              numColumns={8}
              contentContainerStyle={{ padding: 6 }}
              keyboardShouldPersistTaps="always"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setText((prev: string) => prev + item);
                    setTimeout(() => inputRef.current?.focus?.(), 0);
                  }}
                  style={{
                    width: `${100 / 8}%`,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RNText style={{ fontSize: 26, lineHeight: 30 }}>{item}</RNText>
                </Pressable>
              )}
            />
          )}
        </Animated.View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingHorizontal: 8,
            backgroundColor: theme.colors.surface,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            ref={inputRef}
            placeholder="Сообщение"
            style={{ flex: 1, marginRight: 8, maxHeight: 140 }}
            mode="outlined"
            dense
            multiline
            contentStyle={{ minHeight: 44, paddingVertical: 8, textAlignVertical: 'center' }}
            left={
              <TextInput.Icon
                icon="emoticon-outline"
                onPress={toggleEmoji}
                forceTextInputFocus={false}
              />
            }
            right={
              <TextInput.Icon
                icon={text.trim().length > 0 ? 'send' : 'paperclip'}
                onPress={text.trim().length > 0 ? onSend : () => setAttachmentsVisible(true)}
                forceTextInputFocus={false}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>

      <StyledDialog
        visible={attachmentsVisible}
        onDismiss={() => setAttachmentsVisible(false)}
        title="Вложение"
      >
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <SquareIconButton
              icon="camera"
              onPress={() => {
                setAttachmentsVisible(false);
                onTakePhoto();
              }}
              size={48}
            />
            <SquareIconButton
              icon="image"
              onPress={() => {
                setAttachmentsVisible(false);
                onPickImage();
              }}
              size={48}
            />
            <SquareIconButton
              icon="paperclip"
              onPress={() => {
                setAttachmentsVisible(false);
                onPickFile();
              }}
              size={48}
            />
          </View>
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>
            Снимок • Фото из галереи • Файл
          </Text>
        </View>
      </StyledDialog>

      <StyledDialog
        visible={searchVisible}
        onDismiss={() => setSearchVisible(false)}
        title="Поиск по чату"
      >
        <View style={{ gap: 12 }}>
          <TextInput
            value={inputSearch}
            onChangeText={setInputSearch}
            placeholder="Введите текст"
            mode="outlined"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Button onPress={() => setSearchVisible(false)}>Закрыть</Button>
            <Button
              onPress={() => {
                addSystemMessage(`Поиск: ${inputSearch}`);
                setSearchVisible(false);
              }}
            >
              Найти
            </Button>
          </View>
        </View>
      </StyledDialog>

      <StyledDialog
        visible={confirmClearVisible}
        onDismiss={() => setConfirmClearVisible(false)}
        title="Очистить историю чата?"
      >
        <View style={{ gap: 12 }}>
          <Text>Все сообщения будут удалены локально.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Button onPress={() => setConfirmClearVisible(false)}>Отмена</Button>
            <Button
              onPress={() => {
                setMessages([]);
                addSystemMessage('История очищена');
                setConfirmClearVisible(false);
              }}
            >
              Очистить
            </Button>
          </View>
        </View>
      </StyledDialog>

      <StyledDialog
        visible={confirmDeleteVisible}
        onDismiss={() => setConfirmDeleteVisible(false)}
        title="Удалить чат?"
      >
        <View style={{ gap: 12 }}>
          <Text>Чат будет удалён локально.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Button onPress={() => setConfirmDeleteVisible(false)}>Отмена</Button>
            <Button
              onPress={() => {
                setConfirmDeleteVisible(false);
                navigation?.goBack?.();
              }}
            >
              Удалить
            </Button>
          </View>
        </View>
      </StyledDialog>
    </View>
  );
};
