import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native'; 
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchFuncionarioById, updateFuncionario } from '../database/database'; 

const PerfilFuncionario = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  if (!id) {
    Alert.alert('Erro', 'ID do cliente não fornecido.');
    navigation.goBack(); // ou navegue para onde você quiser
    return null;
  }

  const [funcionario, setFuncionario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setMensagemErro('Erro: ID não fornecido.');
      return;
    }

    const fetchFuncionario = async () => {
      try {
        const funcionarioData = await fetchFuncionarioById(id);
        if (funcionarioData) {
          setFuncionario(funcionarioData);
          setNome(funcionarioData.nome);
          setEmail(funcionarioData.email);
          setTelefone(funcionarioData.telefone);
          setCargo(funcionarioData.cargo);
        } else {
          setMensagemErro('Funcionário não encontrado.');
          Alert.alert('Erro', 'Funcionário não encontrado.');
        }
      } catch (error) {
        setMensagemErro('Erro ao carregar dados do funcionário.');
        Alert.alert('Erro', 'Erro ao carregar dados do funcionário.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionario();
  }, [id]);

  const handleSubmit = async () => { 
    try {
      await updateFuncionario(id, nome, email, telefone, cargo);
      setFuncionario({ ...funcionario, nome, email, telefone, cargo });
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
      <Text style={styles.title}>Perfil do Funcionário</Text>
      {funcionario ? (
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
              <View style={styles.formGroup}>
                <Text>Cargo:</Text>
                <TextInput 
                  style={styles.input} 
                  value={cargo} 
                  onChangeText={setCargo} 
                  placeholder="Digite o cargo"
                />
              </View>
              <Button title="Salvar" onPress={handleSubmit} />
              <Button title="Cancelar" onPress={() => setModoEdicao(false)} color="grey" />
            </View>
          ) : (
            <View>
              <Text><Text style={styles.bold}>Nome:</Text> {funcionario.nome}</Text>
              <Text><Text style={styles.bold}>Email:</Text> {funcionario.email}</Text>
              <Text><Text style={styles.bold}>Telefone:</Text> {funcionario.telefone}</Text>
              <Text><Text style={styles.bold}>Cargo:</Text> {funcionario.cargo}</Text>
              <Button title="Editar" onPress={() => setModoEdicao(true)} />
            </View>
          )}
          {mensagemSucesso && <Text style={styles.message}>{mensagemSucesso}</Text>}
        </View>
      ) : (
        <Text>Funcionário não encontrado.</Text>
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

export default PerfilFuncionario;
