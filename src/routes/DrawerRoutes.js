import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';


import StackVagas from '../screens/CadastroVagas/StackVagas';
import StackCandidatos from '../screens/CadastroCandidatos/StackCandidatos';
import StackLocais from '../screens/CadastroLocais/StackLocais';
import StackResultados from '../screens/CadastroResultados/StackResultados';
import StackConcursos from '../screens/CadastroConcursos/StackConcursos';


const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName='Candidatos'
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'black',
        },
        drawerLabelStyle: {
          color: 'white',
        },
        headerStyle: {
          backgroundColor: 'gray',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
      <Drawer.Screen name='Candidatos' component={StackCandidatos} />
      <Drawer.Screen name='Contursos' component={StackConcursos} />
      <Drawer.Screen name='Vagas' component={StackVagas} />
      <Drawer.Screen name='Locais de Prova' component={StackLocais} />
      <Drawer.Screen name='Resultados dos Candidatos' component={StackResultados} />
    </Drawer.Navigator>
  );
};
