import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Dialog, FAB, MD3Colors, Portal, Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'


export default function ListaVagas({ navigation, route }) {

  const [vagas, setvagas] = useState([])
  const [showModalExcluirUsuario, setShowModalExcluirUsuario] = useState(false)
  const [vagaASerExcluida, setvagaASerExcluida] = useState(null)


  useEffect(() => {
    loadvagas()
  }, [])

  async function loadvagas() {
    const response = await AsyncStorage.getItem('vagas')
    console.log("🚀 ~ file: ListavagasAsyncStorage.js:21 ~ loadvagas ~ response:", response)
    const vagasStorage = response ? JSON.parse(response) : []
    setvagas(vagasStorage)
  }



  const showModal = () => setShowModalExcluirUsuario(true);

  const hideModal = () => setShowModalExcluirUsuario(false);

  async function adicionarvaga(vaga) {
    let novaListavagas = vagas
    novaListavagas.push(vaga)
    await AsyncStorage.setItem('vagas', JSON.stringify(novaListavagas));
    setvagas(novaListavagas)
  }

  async function editarvaga(vagaAntiga, novosDados) {
    console.log('vaga ANTIGA -> ', vagaAntiga)
    console.log('DADOS NOVOS -> ', novosDados)

    const novaListavagas = vagas.map(vaga => {
      if (vaga == vagaAntiga) {
        return novosDados
      } else {
        return vaga
      }
    })

    await AsyncStorage.setItem('vagas', JSON.stringify(novaListavagas))
    setvagas(novaListavagas)

  }

  async function excluirvaga(vaga) {
    const novaListavagas = vagas.filter(p => p !== vaga)
    await AsyncStorage.setItem('vagas', JSON.stringify(novaListavagas))
    setvagas(novaListavagas)
    Toast.show({
      type: 'success',
      text1: 'vaga excluida com sucesso!'
    })
  }

  function handleExluirvaga() {
    excluirvaga(vagaASerExcluida)
    setvagaASerExcluida(null)
    hideModal()
  }


  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'https://app.caveira.com/img/background-login.648286b5.png' }}>

      <View style={styles.container}>

        <Text variant='titleLarge' style={styles.title} >Lista de vagas</Text>

        <FlatList
          style={styles.list}
          data={vagas}
          renderItem={({ item }) => (
            <Card
              mode='outlined'
              style={styles.card}
            >
              <Card.Content
                style={styles.cardContent}
              >
                <View style={{ flex: 1 }}>
                  <Text variant='titleMedium'>{item?.concursos}</Text>
                  <Text variant='bodyLarge'>Total de Vagas: {item?.Vagas}</Text>
                  <Text variant='bodyLarge'>Banca Examinadora: {item?.banca} </Text>
                </View>


              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.push('FormVagas', { acao: editarvaga, vagaAntiga: item })}>


                  Editar
                </Button>
                <Button onPress={() => {
                  setvagaASerExcluida(item)
                  showModal()
                }}>
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.push('FormVagas', { acao: adicionarvaga })}
        />
        <Portal>
          <Dialog visible={showModalExcluirUsuario} onDismiss={hideModal}>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Tem certeza que deseja excluir este usuário?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Voltar</Button>
              <Button onPress={handleExluirvaga}>Tenho Certeza</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    margin: 10
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  list: {
    width: '90%',
  },
  card: {
    marginTop: 15
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: MD3Colors.primary80,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 15
  }
})