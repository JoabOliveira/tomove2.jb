import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { fetchClienteByNome, fetchCliente, updateCliente } from '../database/database'; // Assegure-se de importar a função updateCliente

const PerfilCliente = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar cliente por nome
  const buscarCliente = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, forneça um nome válido.');
      return;
    }

    setLoading(true);
    try {
      const clientesData = await fetchClienteByNome(nome, email, telefone);
      if (clientesData.length > 0) {
        const clienteData = clientesData[0];
        setCliente(clienteData);
        setNome(clienteData.nome);
        setEmail(clienteData.email);
        setTelefone(clienteData.telefone);
        setMensagemErro(null);
      } else {
        setMensagemErro('Cliente não encontrado.');
        Alert.alert('Erro', 'Cliente não encontrado.');
      }
    } catch (error) {
      setMensagemErro('Erro ao carregar dados do cliente.');
      console.error('Error:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do cliente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todos os clientes
  const buscarTodosClientes = async () => {
    setLoading(true);
    try {
      const todosClientes = await fetchCliente(); // Busca todos os clientes
      if (todosClientes.length > 0) {
        setClientes(todosClientes); // Armazena os clientes no estado
        setMensagemErro(null);
      } else {
        setMensagemErro('Nenhum cliente encontrado.');
      }
    } catch (error) {
      setMensagemErro('Erro ao carregar clientes.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateCliente(nome, email, telefone); // Chame a função para atualizar o cliente
      setCliente({nome, email, telefone }); // Atualize o estado do cliente
      Alert.alert('Sucesso', 'Dados do cliente atualizados com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar dados do cliente.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Cliente</Text>
      <TextInput 
        style={styles.input} 
        value={nome} 
        onChangeText={setNome} 
        placeholder="Digite o nome do cliente"
      />
      <Button title="Buscar" onPress={buscarCliente} />

      <Button title="Buscar Todos os Clientes" onPress={buscarTodosClientes} />

      {loading && <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />}
      {mensagemErro && <Text style={styles.error}>{mensagemErro}</Text>}

      {cliente && (
        <View>
          <Text>Nome: {cliente.nome}</Text>
          <Text>Email: {cliente.email}</Text>
          <Text>Telefone: {cliente.telefone}</Text>
          <Button title="Editar" onPress={() => setModoEdicao(true)} />
        </View>
      )}

      {modoEdicao && (
        <View>
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome} 
            placeholder="Nome do cliente" 
          />
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Email do cliente" 
          />
          <TextInput 
            style={styles.input} 
            value={telefone} 
            onChangeText={setTelefone} 
            placeholder="Telefone do cliente" 
          />
          <Button title="Salvar" onPress={handleSubmit} />
          <Button title="Cancelar" onPress={() => setModoEdicao(false)} color="grey" />
        </View>
      )}

      {/* Exibir todos os clientes */}
      {clientes.length > 0 && (
        <ScrollView style={styles.scrollContainer}>
          {clientes.map((cliente) => (
            <View key={cliente.id} style={styles.clienteContainer}>
              <Text>Nome: {cliente.nome}</Text>
              <Text>Email: {cliente.email}</Text>
              <Text>Telefone: {cliente.telefone}</Text>
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
  clienteContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});


export default PerfilCliente;
