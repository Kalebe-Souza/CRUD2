import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormLocais({ navigation, route }) {
  const { acao, locaisAntiga } = route.params;

  const [locais, setLocais] = useState([]);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório'),
    CEP: Yup.string().required('Campo obrigatório'),
    Cidade: Yup.string().required('Campo obrigatório'),
    Estado: Yup.string().required('Campo obrigatório'),
  });

  const loadLocais = async () => {
    try {
      const locaisData = await AsyncStorage.getItem('locais');
      const locaisArray = locaisData ? JSON.parse(locaisData) : [];
      setLocais(locaisArray);
    } catch (error) {
      console.error('Erro ao carregar locais', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {locaisAntiga ? 'Editar Locais' : 'Adicionar Locais'}
      </Text>

      <Formik
        initialValues={{
          nome: locaisAntiga ? locaisAntiga.nome : '',
          CEP: locaisAntiga ? locaisAntiga.CEP : '',
          Cidade: locaisAntiga ? locaisAntiga.Cidade : '',
          Estado: locaisAntiga ? locaisAntiga.Estado : '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log('SALVAR DADOS NOVOS Locais -> ', values);
          if (locaisAntiga) {
            acao(locaisAntiga, values);
          } else {
            acao(values);
          }

          try {
            const locaisData = await AsyncStorage.getItem('locais');
            const locaisArray = locaisData ? JSON.parse(locaisData) : [];
            const newLocaisArray = [...locaisArray, values];
            await AsyncStorage.setItem('locais', JSON.stringify(newLocaisArray));
            setLocais(newLocaisArray);
          } catch (error) {
            console.error('Erro ao salvar locais em AsyncStorage:', error);
          }

          Toast.show({
            type: 'success',
            text1: 'Locais salvos com sucesso!',
          });

          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={styles.inputContainer}>
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
                label="CEP"
                placeholder="00000-000"
                value={values.CEP}
                onChangeText={handleChange('CEP')}
                onBlur={handleBlur('CEP')}
                render={(props) => <TextInputMask {...props} type={'zip-code'} />}
              />

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Cidade"
                value={values.Cidade}
                onChangeText={handleChange('Cidade')}
                onBlur={handleBlur('Cidade')}
              />

              <TextInput
                style={styles.input}
                mode="outlined"
                label="Estado UF"
                placeholder="AA"
                value={values.Estado}
                onChangeText={handleChange('Estado')}
                onBlur={handleBlur('Estado')}
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
