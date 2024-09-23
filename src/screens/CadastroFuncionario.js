import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { insertFuncionario } from '../database/database';

const CadastroFuncionario = ({ navigation }) => {  // Adicionado 'navigation' como prop
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(null);

  const handleSubmit = async () => {
    if (!nome || !email || !telefone || !cargo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await insertFuncionario(nome, email, telefone, cargo);  // Supondo que esta função retorne uma Promise
      setMensagem('Funcionário cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setTelefone('');
      setCargo('');
      Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
      navigation.goBack();  // Volta para a tela anterior após sucesso
    } catch (errorMsg) {
      setMensagem('Erro ao cadastrar funcionário.');
      setErro(errorMsg);
      Alert.alert('Erro', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Funcionário</Text>
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
      <Button title="Cadastrar" onPress={handleSubmit} />
      {mensagem ? <Text style={styles.message}>{mensagem}</Text> : null}
      {erro ? <Text style={styles.error}>{erro}</Text> : null}
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
  message: {
    marginTop: 16,
    color: 'green',
  },
  error: {
    marginTop: 16,
    color: 'red',
  },
});

export default CadastroFuncionario;
