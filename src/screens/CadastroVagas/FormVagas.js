import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

export default function FormVagas({ navigation, route }) {
  const { acao, vagasAntiga } = route.params;
  const [concursos, setConcursos] = useState([]);

  useEffect(() => {
    loadConcursos()
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

  const validationSchema = Yup.object().shape({
    concursos: Yup.string().required('Campo obrigatório!'),
    Vagas: Yup.string().required('Campo obrigatório!'),
    banca: Yup.string().required('Campo obrigatorio!'),
  });

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {vagasAntiga ? 'Editar vagas' : 'Adicionar vagas'}
      </Text>

      <Formik
        initialValues={{
          concursos: vagasAntiga ? vagasAntiga.concursos : '', // <-- Altere 'concursos' para 'Concurso'
          Vagas: vagasAntiga ? vagasAntiga.Vagas : '',
          banca: vagasAntiga ? vagasAntiga.banca : '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('SALVAR DADOS NOVA vagas -> ', values);
          if (vagasAntiga) {
            acao(vagasAntiga, values);
          } else {
            acao(values);
          }

          Toast.show({
            type: 'success',
            text1: 'vagas salva com sucesso!',
          });

          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.inputContainer}>
              <Picker
                style={styles.input}
                mode="outlined"
                label="Concurso"
                selectedValue={values.concursos}  // <-- Altere 'Concurso' para 'concursos'
                onValueChange={(itemValue, itemIndex) => {
                  handleChange('concursos')(itemValue); // <-- Altere 'Concurso' para 'concursos'
                }}
              >
                {concursos.map((concurso, index) => (
                  <Picker.Item key={index} label={concurso.nome} value={concurso.nome} />
                ))}
              </Picker>
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Vagas"
                value={values.Vagas}
                onChangeText={handleChange('Vagas')}
                onBlur={handleBlur('Vagas')}
              />

              <TextInput
                style={styles.input}
                mode="outlined"
                label="banca"
                value={values.banca}
                onChangeText={handleChange('banca')}
                onBlur={handleBlur('banca')}
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
