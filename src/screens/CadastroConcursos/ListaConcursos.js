import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Dialog, FAB, MD3Colors, Portal, Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'


export default function ListaConcursos({ navigation, route }) {

  const [Concursos, setConcursos] = useState([])
  const [showModalExcluirUsuario, setShowModalExcluirUsuario] = useState(false)
  const [concursoASerExcluida, setconcursoASerExcluida] = useState(null)


  useEffect(() => {
    loadConcursos()
  }, [])

  async function loadConcursos() {
    const response = await AsyncStorage.getItem('Concursos')
    console.log("dados", response)
    const ConcursosStorage = response ? JSON.parse(response) : []
    setConcursos(ConcursosStorage)
  }



  const showModal = () => setShowModalExcluirUsuario(true);

  const hideModal = () => setShowModalExcluirUsuario(false);

  async function adicionarconcurso(concurso) {
    let novaListaConcursos = Concursos
    novaListaConcursos.push(concurso)
    await AsyncStorage.setItem('Concursos', JSON.stringify(novaListaConcursos));
    setConcursos(novaListaConcursos)
  }

  async function editarconcurso(concursoAntiga, novosDados) {
    console.log('concurso ANTIGA -> ', concursoAntiga)
    console.log('DADOS NOVOS -> ', novosDados)

    const novaListaConcursos = Concursos.map(concurso => {
      if (concurso == concursoAntiga) {
        return novosDados
      } else {
        return concurso
      }
    })

    await AsyncStorage.setItem('Concursos', JSON.stringify(novaListaConcursos))
    setConcursos(novaListaConcursos)

  }

  async function excluirconcurso(concurso) {
    const novaListaConcursos = Concursos.filter(p => p !== concurso)
    await AsyncStorage.setItem('Concursos', JSON.stringify(novaListaConcursos))
    setConcursos(novaListaConcursos)
    Toast.show({
      type: 'success',
      text1: 'concurso excluida com sucesso!'
    })
  }

  function handleExluirconcurso() {
    excluirconcurso(concursoASerExcluida)
    setconcursoASerExcluida(null)
    hideModal()
  }


  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'https://app.caveira.com/img/background-login.648286b5.png' }}>

      <View style={styles.container}>

        <Text variant='titleLarge' style={styles.title} >Lista de Concursos</Text>

        <FlatList
          style={styles.list}
          data={Concursos}
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
                  <Text variant='bodyLarge'>Salario: {item?.salario}</Text>
                  <Text variant='bodyLarge'>Vagas prevista: {item?.vagas} </Text>
                  <Text variant='bodyLarge'>Banca Examinadora: {item.banca} </Text>
                </View>

              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.push('FormConcursos', { acao: editarconcurso, concursoAntiga: item })}>
                  Editar
                </Button>
                <Button onPress={() => {
                  setconcursoASerExcluida(item)
                  showModal()
                }}>
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          )}
        />

        {/* Botão Flutuante */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.push('FormConcursos', { acao: adicionarconcurso })}
        />


        {/* Modal Excluir Usuário */}
        <Portal>
          <Dialog visible={showModalExcluirUsuario} onDismiss={hideModal}>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Tem certeza que deseja excluir este usuário?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Voltar</Button>
              <Button onPress={handleExluirconcurso}>Tenho Certeza</Button>
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