import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormResultado({ navigation, route }) {
  const { acao, resultadoAntiga } = route.params;
  const [concursos, setConcursos] = useState([]);
  const [nomes, setNomes] = useState([]);
  const [locais, setLocais] = useState([]);

  useEffect(() => {
    loadConcursos();
    loadNomes();
    loadLocais();
  }, []);

  const loadConcursos = async () => {
    try {
      const concursosData = await AsyncStorage.getItem('concursos');
      const concursosArray = concursosData ? JSON.parse(concursosData) : [];
      setConcursos(concursosArray);
    } catch (error) {
      console.error('Erro ao carregar concursos', error);
    }
  };

  const loadNomes = async () => {
    try {
      const candidatosData = await AsyncStorage.getItem('candidatos');
      const candidatosArray = candidatosData ? JSON.parse(candidatosData) : [];
      const uniqueNomes = new Set(candidatosArray.map((candidato) => candidato.nome));

      console.log('Nomes carregados:', Array.from(uniqueNomes));

      setNomes(Array.from(uniqueNomes));
    } catch (error) {
      console.error('Erro ao carregar nomes', error);
    }
  };

  const loadLocais = async () => {
    try {
      const locaisData = await AsyncStorage.getItem('locais');
      const locaisArray = locaisData ? JSON.parse(locaisData) : [];
      setLocais(locaisArray); // Corrigido de locaisisArray para locaisArray
    } catch (error) {
      console.error('Erro ao carregar locais', error);
    }
  };
  

  const validationSchema = Yup.object().shape({
    nomeCandidato: Yup.string().required('Campo obrigatório!'),
    Concurso: Yup.string().required('Campo obrigatório!'),
    Nota: Yup.string().required('Campo obrigatório!'),
    Local: Yup.string().required('Campo obrigatório!'),
  });

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {resultadoAntiga ? 'Editar resultado' : 'Adicionar resultado'}
      </Text>

      <Formik
        initialValues={{
          nomeCandidato: resultadoAntiga ? resultadoAntiga.nomeCandidato : '',
          Concurso: resultadoAntiga ? resultadoAntiga.Concurso : '',
          Nota: resultadoAntiga ? resultadoAntiga.Nota : '',
          Local: resultadoAntiga ? resultadoAntiga.Local : '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log('SALVAR DADOS NOVO Resultado -> ', values);
          if (resultadoAntiga) {
            acao(resultadoAntiga, values);
          } else {
            acao(values);
          }

          try {
            const resultadosData = await AsyncStorage.getItem('resultados');
            const resultadosArray = resultadosData ? JSON.parse(resultadosData) : [];
            const newResultadosArray = [...resultadosArray, values];
            await AsyncStorage.setItem('resultados', JSON.stringify(newResultadosArray));
            setResultados(newResultadosArray);
          } catch (error) {
            console.error('Erro ao salvar resultado em AsyncStorage:', error);
          }

          Toast.show({
            type: 'success',
            text1: 'Resultado salvo com sucesso!',
          });

          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <View style={styles.inputContainer}>
              <Picker
                style={{ ...styles.input, backgroundColor: 'white' }}
                mode="outlined"
                label="Nome do Candidato"
                selectedValue={values.nomeCandidato}
                onValueChange={(itemValue) => {
                  handleChange('nomeCandidato')(itemValue);
                }}
              >
                {nomes.map((candidato, index) => (
                  <Picker.Item key={index} label={candidato} value={candidato} />
                ))}
              </Picker>

              {touched.nomeCandidato && errors.nomeCandidato && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.nomeCandidato}</Text>
              )}

              <Picker
                style={styles.input}
                mode="outlined"
                label="Concurso"
                selectedValue={values.Concurso}
                onValueChange={(itemValue) => {
                  handleChange('Concurso')(itemValue);
                }}
              >
                {concursos.map((concurso, index) => (
                  <Picker.Item key={index} label={concurso.nome} value={concurso.nome} />
                ))}
              </Picker>

              <Picker
                style={styles.input}
                mode="outlined"
                label="Local"
                selectedValue={values.Local}
                onValueChange={(itemValue) => {
                  handleChange('Local')(itemValue);
                }}
              >
                {locais.map((local, index) => (
                  <Picker.Item key={index} label={local.nome} value={local.nome} />
                ))}
              </Picker>

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Nota"
                value={values.Nota}
                onChangeText={handleChange('Nota')}
                onBlur={handleBlur('Nota')}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button style={styles.button} mode="contained-tonal" onPress={() => navigation.goBack()}>
                Voltar
              </Button>

              <Button style={styles.button} mode="contained" onPress={handleSubmit}>
                Salvar
              </Button>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    margin: 10,
  },
  inputContainer: {
    width: '90%',
    flex: 1,
  },
  input: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
  },
});
