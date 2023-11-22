import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Dialog, FAB, MD3Colors, Portal, Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'


export default function ListaLocais({ navigation, route }) {

  const [Locais, setLocais] = useState([])
  const [showModalExcluirUsuario, setShowModalExcluirUsuario] = useState(false)
  const [locaisASerExcluida, setlocaisASerExcluida] = useState(null)


  useEffect(() => {
    loadLocais()
  }, [])

  async function loadLocais() {
    const response = await AsyncStorage.getItem('Locais')
    console.log("dados", response)
    const LocaisStorage = response ? JSON.parse(response) : []
    setLocais(LocaisStorage)
  }



  const showModal = () => setShowModalExcluirUsuario(true);

  const hideModal = () => setShowModalExcluirUsuario(false);

  async function adicionarlocais(locais) {
    let novaListaLocais = Locais
    novaListaLocais.push(locais)
    await AsyncStorage.setItem('Locais', JSON.stringify(novaListaLocais));
    setLocais(novaListaLocais)
  }

  async function editarlocais(locaisAntiga, novosDados) {
    console.log('locais ANTIGA -> ', locaisAntiga)
    console.log('DADOS NOVOS -> ', novosDados)

    const novaListaLocais = Locais.map(locais => {
      if (locais == locaisAntiga) {
        return novosDados
      } else {
        return locais
      }
    })

    await AsyncStorage.setItem('Locais', JSON.stringify(novaListaLocais))
    setLocais(novaListaLocais)

  }

  async function excluirlocais(locais) {
    const novaListaLocais = Locais.filter(p => p !== locais)
    await AsyncStorage.setItem('Locais', JSON.stringify(novaListaLocais))
    setLocais(novaListaLocais)
    Toast.show({
      type: 'success',
      text1: 'locais excluida com sucesso!'
    })
  }

  function handleExluirlocais() {
    excluirlocais(locaisASerExcluida)
    setlocaisASerExcluida(null)
    hideModal()
  }


  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'https://app.caveira.com/img/background-login.648286b5.png' }}>

      <View style={styles.container}>

        <Text variant='titleLarge' style={styles.title} >Lista de Locais</Text>

        <FlatList
          style={styles.list}
          data={Locais}
          renderItem={({ item }) => (
            <Card
              mode='outlined'
              style={styles.card}
            >
              <Card.Content
                style={styles.cardContent}
              >
                <View style={{ flex: 1 }}>
                  <Text variant='titleMedium'>{item?.nome}</Text>
                  <Text variant='bodyLarge'>CEP: {item?.CEP}</Text>
                  <Text variant='bodyLarge'>Cidade: {item?.Cidade} cm</Text>
                  <Text variant='bodyLarge'>UF: {item.Estado} kg</Text>
                </View>

              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.push('FormLocais', { acao: editarlocais, locaisAntiga: item })}>
                  Editar
                </Button>
                <Button onPress={() => {
                  setlocaisASerExcluida(item)
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
          onPress={() => navigation.push('FormLocais', { acao: adicionarlocais })}
        />

        <Portal>
          <Dialog visible={showModalExcluirUsuario} onDismiss={hideModal}>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Tem certeza que deseja excluir este usuário?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Voltar</Button>
              <Button onPress={handleExluirlocais}>Tenho Certeza</Button>
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