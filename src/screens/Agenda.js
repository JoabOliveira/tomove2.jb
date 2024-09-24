import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Agenda = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Move</Text>

      <Button
        title="Ver Atendimentos"
        onPress={() => navigation.navigate('Atendimentos')}
      />
      <Button
        title="Cadastrar Atendimento"
        onPress={() => navigation.navigate('CadastroAtendimento')}
      />
      <Button
        title="Cadastrar Cliente"
        onPress={() => navigation.navigate('CadastroCliente')}
      />
      <Button
        title="Cadastrar Funcionário"
        onPress={() => navigation.navigate('CadastroFuncionario')}
      />
      <Button
        title="Perfil do Cliente"
        onPress={() => navigation.navigate('PerfilCliente')} 
      />
      <Button
        title="Perfil do Funcionário"
        onPress={() => navigation.navigate('PerfilFuncionario')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default Agenda;
