import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

export default function FormCandidatos({ navigation, route }) {
  const { acao, CandidatosAntiga } = route.params;
  const [concursos, setConcursos] = useState([]);
  const [candidatos, setCandidatos] = useState([]);

  useEffect(() => {
    loadConcursos();
  }, []);

  const loadConcursos = async () => {
    try {
      const concursosData = await AsyncStorage.getItem('concursos');
      console.log('concursosData:', concursosData);
      const concursosArray = concursosData ? JSON.parse(concursosData) : [];
      console.log('concursosArray:', concursosArray);
      setConcursos(concursosArray);
    } catch (error) {
      console.error('Erro ao carregar concursos', error);
    }
  };





  const validationSchema = Yup.object().shape({
    cpf: Yup.string().min(11, 'CPF deve conter 11 digitos').required('Campo obrigatório!'),
    nome: Yup.string().required('Campo obrigatorio'),
    data: Yup.string().required('Campo obrigatorio'),
    telefone: Yup.string().min(11, 'Telefone deve conter os 11 digitos').required('Campo obrigatório!'),
    concurso: Yup.string().required(),


  });

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {CandidatosAntiga ? 'Editar Candidatos' : 'Adicionar Candidatos'}
      </Text>

      <Formik
        initialValues={{
          cpf: CandidatosAntiga ? CandidatosAntiga.cpf : '',
          nome: CandidatosAntiga ? CandidatosAntiga.nome : '',
          data: CandidatosAntiga ? CandidatosAntiga.data : '',
          telefone: CandidatosAntiga ? CandidatosAntiga.telefone : '',
          concurso: CandidatosAntiga ? CandidatosAntiga.concursoNome : '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log('SALVAR DADOS NOVA Candidatos -> ', values);
          if (CandidatosAntiga) {
            acao(CandidatosAntiga, values);
          } else {
            acao(values);
          }

          try {
            const candidatosData = await AsyncStorage.getItem('candidatos');
            const candidatosArray = candidatosData ? JSON.parse(candidatosData) : [];
            const newCandidatosArray = [...candidatosArray, values];
            await AsyncStorage.setItem('candidatos', JSON.stringify(newCandidatosArray));
            setCandidatos(newCandidatosArray);
          } catch (error) {
            console.error('Erro ao salvar candidatos em AsyncStorage:', error);
          }

          Toast.show({
            type: 'success',
            text1: 'Candidato salvo com sucesso!',
          });

          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, errors, values }) => (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                mode="outlined"
                label={'CPF'}
                placeholder='000.000.000-00'
                value={values.cpf}
                onChangeText={handleChange('cpf')}
                onBlur={handleBlur('cpf')}
                error={touched.cpf && errors.cpf}
                keyboardType='numeric'
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'cpf'}
                  />
                )}
              />
              {touched.cpf && errors.cpf && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.cpf}</Text>
              )}

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Nome"
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
              />

              <TextInput
                style={styles.input}
                mode="outlined"
                label="data"
                placeholder='00/00/0000'
                keyboardType='numeric'
                value={values.data}
                onChangeText={handleChange('data')}
                onBlur={handleBlur('data')}
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'datetime'}
                    options={{
                      format: 'DD/MM/YYYY'
                    }}

                  />
                )}
              />
              {touched.data && errors.data && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{errors.data}</Text>
              )}

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Telefone"
                placeholder='(00) 0 0000-0000'
                keyboardType='numeric'
                value={values.telefone}
                onChangeText={handleChange('telefone')}
                onBlur={handleBlur('telefone')}
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'cel-phone'}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                  />
                )}
              />
              <Picker
                style={styles.input}
                mode="outlined"
                label="Concurso"
                selectedValue={values.concurso}
                onValueChange={(itemValue) => {
                  handleChange('concurso')(itemValue);
                }}
              >
                {concursos.map((concurso, index) => (
                  <Picker.Item key={index} label={concurso.nome} value={concurso.nome} />
                ))}
              </Picker>





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
