import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { Card, CardProps } from '../../components/Card';
import { HeaderHome } from '../../components/HeaderHome';

//Hook para observar quando voltamos a ver a nossa tela novamente pois está em pilha
import { useFocusEffect } from '@react-navigation/native';

import { styles } from './styles';
import { Button } from '../../components/Button';

export function Home() {
  const { getItem, removeItem, setItem } = useAsyncStorage("@savepassdecode:passwords");
  const [data, setData] = useState<CardProps[]>([]);

  async function handleFetchData() {
    /*
       Recupera todas as chaves -> AsyncStorage.getAllKeys();
       Remove uma chave especifica -> AsyncStorage.removeItem("nome_da_chave");
       Pegar os dados da chave especifica -> AsyncStorage.getItem("nome_da_chave");
    */
    try {
      const response = await getItem();
      const data = response ? JSON.parse(response) : [];
      setData(data);

    } catch (error) {
      console.log("Recuperar dados", error);
      Toast.show({
        type: "error",
        text1: "Não foi possível recuperar dados"
      });
    }

  }

  async function handleRemove(id: string) {
    try {
      const response = await getItem();
      const previousData = response ? JSON.parse(response) : [];

      //Filtrando nos dados que estão salvos, e estou filtrando por todos os registros e retornando todos, menos o ID que quero deletar.
      const data = previousData.filter((item: CardProps) => item.id !== id);
      setItem(JSON.stringify(data));

      //Carregando os novos dados no estado para refletir na atualização
      setData(data);
    }catch (error) {
      console.log("Erro ao remover", error);
      Toast.show({
        type: "error",
        text1: "Não foi possível excluir"
      });
    }
  }

  //Quando o foco voltar para a tela ele vai recarregar;
  useFocusEffect(useCallback(() => {
    handleFetchData();
  }, []));

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>
          Suas senhas
        </Text>

        <Text style={styles.listCount}>
          {`${data.length} ao total`}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          <Card
            data={item}
            onPress={() => handleRemove(item.id)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          title="Limpar lista"
        />
      </View>
    </View>
  );
}