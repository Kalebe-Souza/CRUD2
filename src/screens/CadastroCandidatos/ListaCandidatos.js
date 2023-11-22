import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, FAB, Portal, Text, MD3Colors } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function ListaCandidatos({ navigation, route }) {
  const [Candidatos, setCandidatos] = useState([]);
  const [showModalExcluirUsuario, setShowModalExcluirUsuario] = useState(false);
  const [CandidatosASerExcluida, setCandidatosASerExcluida] = useState(null);
  const [concursos, setConcursos] = useState([]); // Adicione esta linha

  useEffect(() => {
    loadCandidatos();
    loadConcursos(); // Adicione esta linha
  }, []);
  async function loadCandidatos() {
    try {
      const response = await AsyncStorage.getItem('Candidatos');
      console.log("🚀 ~ file: ListaCandidatosAsyncStorage.js:21 ~ loadCandidatos ~ response:", response);

      const CandidatosStorage = response ? JSON.parse(response) : [];

      const CandidatosComNomeConcurso = CandidatosStorage.map(candidato => {
        const concursoSelecionado = concursos.find(concurso => concurso.id === candidato.concursoID);
        return {
          ...candidato,
          concursoNome: concursoSelecionado?.nome || '',
        };
      });

      setCandidatos(CandidatosComNomeConcurso);
    } catch (error) {
      console.error('Erro ao carregar candidatos', error);
    }
  }

  // Adicione esta função
  async function loadConcursos() {
    try {
      const concursosData = await AsyncStorage.getItem('concursos');
      console.log('concursosData:', concursosData);
      const concursosArray = concursosData ? JSON.parse(concursosData) : [];
      console.log('concursosArray:', concursosArray);
      setConcursos(concursosArray);
    } catch (error) {
      console.error('Erro ao carregar concursos', error);
    }
  }


  const showModal = () => setShowModalExcluirUsuario(true);

  const hideModal = () => setShowModalExcluirUsuario(false);



  async function adicionarCandidatos(novoCandidato) {
    const concursoSelecionado = concursos.find(concurso => concurso.nome === novoCandidato.concurso);
    const candidatoComNomeConcurso = { ...novoCandidato, concursoNome: concursoSelecionado?.nome || '' };
  
    let novaListaCandidatos = [...Candidatos, candidatoComNomeConcurso];
    
    await AsyncStorage.setItem('Candidatos', JSON.stringify(novaListaCandidatos));
    setCandidatos(novaListaCandidatos);
  }
  
  

  async function editarCandidatos(CandidatosAntiga, novosDados) {
    console.log('Candidatos ANTIGA -> ', CandidatosAntiga);
    console.log('DADOS NOVOS -> ', novosDados);
  
    const concursoSelecionado = concursos.find(concurso => concurso.nome === novosDados.concurso);
    const dadosAtualizados = { ...novosDados, concursoNome: concursoSelecionado?.nome || '' };
  
    const novaListaCandidatos = Candidatos.map(candidato => {
      if (JSON.stringify(candidato) === JSON.stringify(CandidatosAntiga)) {
        return dadosAtualizados;
      } else {
        return candidato;
      }
    });
  
    await AsyncStorage.setItem('Candidatos', JSON.stringify(novaListaCandidatos));
    setCandidatos(novaListaCandidatos);
  }
  
  

  

  async function excluirCandidatos(CandidatoParaExcluir) {
    const novaListaCandidatos = Candidatos.filter(candidato => candidato !== CandidatoParaExcluir);
  
    await AsyncStorage.setItem('Candidatos', JSON.stringify(novaListaCandidatos));
  
    setCandidatos(novaListaCandidatos);
    
    Toast.show({
      type: 'success',
      text1: 'Candidato excluído com sucesso!'
    });
  }
  

  function handleExluirCandidatos() {
    excluirCandidatos(CandidatosASerExcluida)
    setCandidatosASerExcluida(null)
    hideModal()
  }




  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'https://app.caveira.com/img/background-login.648286b5.png' }}>

      <View style={styles.container}>

        <Text variant='titleLarge' style={styles.title} >Lista de Candidatos</Text>

        <FlatList
          style={styles.list}
          data={Candidatos}
          renderItem={({ item }) => (
            <Card
              mode='outlined'
              style={styles.card}
            >
              <Card.Content
                style={styles.cardContent}
              >
                <View style={{ flex: 1 }}>
                  <Text variant='titleMedium'>Nome: {item?.nome}</Text>
                  <Text variant='bodyLarge'>Telefone: {item?.telefone}</Text>
                  <Text variant='bodyLarge'>Data de nascimento: {item?.data} </Text>
                  <Text variant='bodyLarge'>Concurso que pretende: {item?.concursoNome}</Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.push('FormCandidatos', { acao: editarCandidatos, CandidatosAntiga: { ...item, concursoNome: item?.concursoNome } })}>
                  Editar
                </Button>

                <Button onPress={() => {
                  setCandidatosASerExcluida(item)
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
          onPress={() => navigation.push('FormCandidatos', { acao: adicionarCandidatos })}
        />
        <Portal>
          <Dialog visible={showModalExcluirUsuario} onDismiss={hideModal}>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Tem certeza que deseja excluir este usuário?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideModal}>Voltar</Button>
              <Button onPress={handleExluirCandidatos}>Tenho Certeza</Button>
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