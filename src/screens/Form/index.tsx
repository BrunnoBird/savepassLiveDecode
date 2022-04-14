import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { HeaderForm } from '../../components/HeaderForm';

export function Form() {
  const { getItem, setItem } = useAsyncStorage("@savepassdecode:passwords");
  const navigation = useNavigation();
  
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  async function handleNew() {
    try {
      const id = uuid.v4();

      const newData = {
        id,
        name,
        user,
        password
      }

      // buscando os dados já existentes armazenados
      const response = await getItem();
      const previousData = response ? JSON.stringify(response) : [];
      // criamos um novo array com o que tinha armazenado, com a nova informação que adicionei
      const data = [...previousData, newData];
      
      await setItem(JSON.stringify(data));
      Toast.show({
        type: "success",
        text1: "Cadastrado com sucesso"
      });
    } catch (error) {
      console.log("Erro ao salvar senha:", error);
      Toast.show({
        type: "error",
        text1: "Não foi possível cadastar"
      });
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <ScrollView>

          <HeaderForm />

          <View style={styles.form}>
            <Input
              label="Nome do serviço"
              onChangeText={setName}
              value={name}
            />
            <Input
              label="E-mail ou usuário"
              autoCapitalize="none"
              onChangeText={setUser}
            />
            <Input
              label="Senha"
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Salvar"
              onPress={handleNew}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView >
  );
}