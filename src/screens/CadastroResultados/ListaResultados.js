import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Dialog, FAB, MD3Colors, Portal, Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'


export default function ListaResultado({ navigation, route }) {

  const [Resultado, setResultado] = useState([])
  const [showModalExcluirUsuario, setShowModalExcluirUsuario] = useState(false)
  const [resultadoASerExcluida, setresultadoASerExcluida] = useState(null)


  useEffect(() => {
    loadResultado()
  }, [])

  async function loadResultado() {
    const response = await AsyncStorage.getItem('Resultado')
    console.log("🚀 ~ file: ListaResultadoAsyncStorage.js:21 ~ loadResultado ~ response:", response)
    const ResultadoStorage = response ? JSON.parse(response) : []
    setResultado(ResultadoStorage)
  }



  const showModal = () => setShowModalExcluirUsuario(true);

  const hideModal = () => setShowModalExcluirUsuario(false);

  async function adicionarresultado(resultado) {
    let novaListaResultado = Resultado
    novaListaResultado.push(resultado)
    await AsyncStorage.setItem('Resultado', JSON.stringify(novaListaResultado));
    setResultado(novaListaResultado)
  }

  async function editarresultado(resultadoAntiga, novosDados) {
    console.log('resultado ANTIGA -> ', resultadoAntiga)
    console.log('DADOS NOVOS -> ', novosDados)

    const novaListaResultado = Resultado.map(resultado => {
      if (resultado == resultadoAntiga) {
        return novosDados
      } else {
        return resultado
      }
    })

    await AsyncStorage.setItem('Resultado', JSON.stringify(novaListaResultado))
    setResultado(novaListaResultado)

  }

  async function excluirresultado(resultado) {
    const novaListaResultado = Resultado.filter(p => p !== resultado)
    await AsyncStorage.setItem('Resultado', JSON.stringify(novaListaResultado))
    setResultado(novaListaResultado)
    Toast.show({
      type: 'success',
      text1: 'resultado excluida com sucesso!'
    })
  }

  function handleExluirresultado() {
    excluirresultado(resultadoASerExcluida)
    setresultadoASerExcluida(null)
    hideModal()
  }



  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'https://app.caveira.com/img/background-login.648286b5.png' }}>

      <View style={styles.container}>

        <Text variant='titleLarge' style={styles.title} >Lista de Resultado</Text>

        <FlatList
          style={styles.list}
          data={Resultado}
          renderItem={({ item }) => (
            <Card
              mode='outlined'
              style={styles.card}
            >
              <Card.Content
                style={styles.cardContent}
              >
                <View style={{ flex: 1 }}>
                  <Text variant='titleMedium'>{item.nomeCandidato}</Text>
                  {/* Ajuste aqui para exibir os valores corretos */}
                  <Text variant='bodyLarge'>Concurso: {item.Concurso}</Text>
                  <Text variant='bodyLarge'>Nota: {item.Nota} </Text>
                  <Text variant='bodyLarge'>Local da prova: {item.Local} </Text>

                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.push('FormResultdos', { acao: editarresultado, resultadoAntiga: item })}>
                  Editar
                </Button>
                <Button onPress={() => {
                  setresultadoASerExcluida(item)
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
          onPress={() => navigation.push('FormResultados', { acao: adicionarresultado })}
        />
        <Portal>
          <Dialog visible={showModalExcluirUsuario} onDismiss={hideModal}>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Tem certeza que deseja excluir este usuário?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Voltar</Button>
              <Button onPress={handleExluirresultado}>Tenho Certeza</Button>
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