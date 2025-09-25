import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import AuthContext from '../contexts/AuthContext';

const AuthScreen = () => {
  const ctx = useContext(AuthContext) as any;
  const { login, register } = ctx || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Title>Masuk / Daftar</Title>
      <TextInput
        label="Email"
        accessibilityLabel="Email"
        testID="input-email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        accessibilityLabel="Password"
        testID="input-password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={() => login(email, password)}
        style={styles.button}
        accessibilityLabel="Masuk"
        testID="button-masuk"
      >
        Masuk
      </Button>
      <Button
        mode="outlined"
        onPress={() => register(email, password)}
        style={styles.button}
        accessibilityLabel="Daftar"
        testID="button-daftar"
      >
        Daftar
      </Button>
      <Paragraph>Gunakan akun untuk mengirim laporan nelayan.</Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 }
});

export default AuthScreen;
