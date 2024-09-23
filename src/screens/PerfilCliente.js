import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchClienteById, updateCliente } from '../database/database';

const PerfilCliente = () => { 
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  if (!id) {
    Alert.alert('Erro', 'ID do cliente não fornecido.');
    navigation.goBack(); // ou navegue para onde você quiser
    return null;
  }

  const [cliente, setCliente] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const clienteData = await fetchClienteById(id);
        if (clienteData) {
          setCliente(clienteData);
          setNome(clienteData.nome);
          setEmail(clienteData.email);
          setTelefone(clienteData.telefone);
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

    fetchCliente();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await updateCliente(id, nome, email, telefone);
      setCliente({ ...cliente, nome, email, telefone });
      setModoEdicao(false);
      setMensagemSucesso('Perfil atualizado com sucesso!');
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      setMensagemErro('Erro ao atualizar perfil.');
      console.error('Error:', error);
      Alert.alert('Erro', 'Erro ao atualizar perfil.');
    }
  };

  if (loading) return <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />;
  if (mensagemErro) return <Text style={styles.error}>{mensagemErro}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Cliente</Text>
      {cliente ? (
        <View>
          {modoEdicao ? (
            <View>
              <View style={styles.formGroup}>
                <Text>Nome:</Text>
                <TextInput 
                  style={styles.input} 
                  value={nome} 
                  onChangeText={setNome} 
                  placeholder="Digite o nome"
                />
              </View>
              <View style={styles.formGroup}>
                <Text>Email:</Text>
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail} 
                  placeholder="Digite o email"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formGroup}>
                <Text>Telefone:</Text>
                <TextInput 
                  style={styles.input} 
                  value={telefone} 
                  onChangeText={setTelefone} 
                  placeholder="Digite o telefone"
                  keyboardType="phone-pad"
                />
              </View>
              <Button title="Salvar" onPress={handleSubmit} />
              <Button title="Cancelar" onPress={() => setModoEdicao(false)} color="grey" />
            </View>
          ) : (
            <View>
              <Text><Text style={styles.bold}>Nome:</Text> {cliente.nome}</Text>
              <Text><Text style={styles.bold}>Email:</Text> {cliente.email}</Text>
              <Text><Text style={styles.bold}>Telefone:</Text> {cliente.telefone}</Text>
              <Button title="Editar" onPress={() => setModoEdicao(true)} />
            </View>
          )}
          {mensagemSucesso && <Text style={styles.message}>{mensagemSucesso}</Text>}
        </View>
      ) : (
        <Text>Cliente não encontrado.</Text>
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
  formGroup: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  message: {
    marginTop: 16,
    color: 'green',
  },
  error: {
    marginTop: 16,
    color: 'red',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default PerfilCliente;
