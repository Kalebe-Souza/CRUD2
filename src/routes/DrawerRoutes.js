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
          backgroundColor: 'white',
        },
        drawerLabelStyle: {
          color: 'red',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: 'red',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
      <Drawer.Screen name='Pacientes' component={StackCandidatos} />
      <Drawer.Screen name='Exames' component={StackConcursos} />
      <Drawer.Screen name='Marcações' component={StackVagas} />
      <Drawer.Screen name='Hospitais' component={StackLocais} />
      <Drawer.Screen name='Resultados' component={StackResultados} />
    </Drawer.Navigator>
  );
};
