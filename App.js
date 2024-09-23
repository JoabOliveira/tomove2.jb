import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Agenda from './src/screens/Agenda';
import Atendimentos from './src/screens/Atendimentos';
import CadastroAtendimento from './src/screens/CadastroAtendimento';
import CadastroCliente from './src/screens/CadastroCliente';
import CadastroFuncionario from './src/screens/CadastroFuncionario';

import PerfilCliente from './src/screens/PerfilCliente';
import PerfilFuncionario from './src/screens/PerfilFuncionario';


  const Stack = createNativeStackNavigator();

  const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Agenda" component={Agenda} />
        <Stack.Screen name="Atendimentos" component={Atendimentos} />
        <Stack.Screen name="CadastroAtendimento" component={CadastroAtendimento} />
        <Stack.Screen name="CadastroCliente" component={CadastroCliente} />
        <Stack.Screen name="CadastroFuncionario" component={CadastroFuncionario} />
        
        <Stack.Screen name="PerfilCliente" component={PerfilCliente} />
        <Stack.Screen name="PerfilFuncionario" component={PerfilFuncionario} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;