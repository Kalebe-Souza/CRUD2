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
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} resizeMode="cover" source={{ uri: 'data:image/png;base64,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' }}>

      <View style={styles.container}>

<Text variant='titleLarge' style={{ ...styles.title, color: 'red' }}>Lista de pacientes</Text>


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