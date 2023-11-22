import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

export default function FormConcursos({ navigation, route }) {
    const { acao, concursoAntiga } = route.params;
    const [concursos, setConcursos] = useState([]);

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Campo obrigatório'),
        vagas: Yup.string().required('Campo obrigatório'),
        salario: Yup.string().required('Campo obrigatório'),
        banca: Yup.string().required('Campo obrigatório'),
    });

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                {concursoAntiga ? 'Editarconcurso' : 'Adicionarconcurso'}
            </Text>

            <Formik
                initialValues={{
                    nome: concursoAntiga ? concursoAntiga.nome : '',
                    vagas: concursoAntiga ? concursoAntiga.vagas : '',
                    salario: concursoAntiga ? concursoAntiga.salario : '',
                    banca: concursoAntiga ? concursoAntiga.banca : '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    console.log('SALVAR DADOS NOVA concurso -> ', values);
                    if (concursoAntiga) {
                        acao(concursoAntiga, values);
                    } else {
                        acao(values);
                    }

                    try {
                        const concursosData = await AsyncStorage.getItem('concursos');
                        const concursosArray = concursosData ? JSON.parse(concursosData) : [];
                        const newConcursosArray = [...concursosArray, values];
                        await AsyncStorage.setItem('concursos', JSON.stringify(newConcursosArray));
                        setConcursos(newConcursosArray);
                    } catch (error) {
                        console.error('Erro ao salvar concurso em AsyncStorage:', error);
                    }


                    Toast.show({
                        type: 'success',
                        text1: 'Concurso salvo com sucesso!',
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
                                label="vagas"
                                placeholder='0000'
                                value={values.vagas}
                                onChangeText={handleChange('vagas')}
                                onBlur={handleBlur('vagas')}
                            />

                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                label="salario"
                                placeholder='R$ 0000,00'
                                value={values.salario}
                                onChangeText={handleChange('salario')}
                                onBlur={handleBlur('salario')}
                                render={(props) => (
                                    <TextInputMask
                                        {...props}
                                        type={'money'}
                                    />
                                )}
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
