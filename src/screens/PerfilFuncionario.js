import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { fetchFuncionarioByNome, fetchFuncionario, updateFuncionario } from '../database/database';

const PerfilFuncionario = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [funcionario, setFuncionario] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const buscarFuncionario = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, forneça um nome válido.');
      return;
    }

    setLoading(true);
    try {
      const funcionariosData = await fetchFuncionarioByNome(nome, email, telefone, cargo);
      if (funcionariosData.length > 0) {
        const funcionarioData = funcionariosData[0]; 
        setFuncionario(funcionarioData);
        setNome(funcionarioData.nome);
        setEmail(funcionarioData.email);
        setTelefone(funcionarioData.telefone);
        setCargo(funcionarioData.cargo);
        setMensagemErro(null);
      } else {
        setMensagemErro('Funcionário não encontrado.');
        Alert.alert('Erro', 'Funcionário não encontrado.');
      }
    } catch (error) {
      setMensagemErro('Erro ao carregar dados do funcionário.');
      console.error('Error:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do funcionário.');
    } finally {
      setLoading(false);
    }
  };

  
  const buscarTodosFuncionarios = async () => {
    setLoading(true);
    try {
      const todosFuncionarios = await fetchFuncionario(); 
      if (todosFuncionarios.length > 0) {
        setFuncionarios(todosFuncionarios);
        setMensagemErro(null);
      } else {
        setMensagemErro('Nenhum funcionário encontrado.');
      }
    } catch (error) {
      setMensagemErro('Erro ao carregar funcionários.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateFuncionario(nome, email, telefone, cargo);
      setFuncionario({ nome, email, telefone, cargo });
      Alert.alert('Sucesso', 'Dados do funcionário atualizados com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar dados do funcionário.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Funcionário</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome do funcionário"
      />
      <Button title="Buscar" onPress={buscarFuncionario} />
      <Button title="Buscar Todos os Funcionários" onPress={buscarTodosFuncionarios} />

      {loading && <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />}
      {mensagemErro && <Text style={styles.error}>{mensagemErro}</Text>}

      {funcionario && (
        <View>
          <Text>Nome: {funcionario.nome}</Text>
          <Text>Email: {funcionario.email}</Text>
          <Text>Telefone: {funcionario.telefone}</Text>
          <Text>Cargo: {funcionario.cargo}</Text>
          <Button title="Editar" onPress={() => setModoEdicao(true)} />
        </View>
      )}

      {modoEdicao && (
        <View>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome do funcionário"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email do funcionário"
          />
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone do funcionário"
          />
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Cargo do funcionário"
          />
          <Button title="Salvar" onPress={handleSubmit} />
          <Button title="Cancelar" onPress={() => setModoEdicao(false)} color="grey" />
        </View>
      )}

      {funcionarios.length > 0 && (
        <ScrollView style={styles.scrollContainer}>
          {funcionarios.map((funcionario) => (
            <View key={funcionario.id} style={styles.funcionarioContainer}>
              <Text>Nome: {funcionario.nome}</Text>
              <Text>Email: {funcionario.email}</Text>
              <Text>Telefone: {funcionario.telefone}</Text>
              <Text>Cargo: {funcionario.cargo}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  error: {
    marginTop: 16,
    color: 'red',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    marginTop: 20,
  },
  funcionarioContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default PerfilFuncionario;
