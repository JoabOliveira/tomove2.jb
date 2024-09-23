import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { insertAtendimento } from '../database/database'; // Certifique-se de que esta função exista

const CadastroAtendimento = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [description, setDescription] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(null);

  const handleSubmit = async () => {
    if (!date || !patientName || !funcionario || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await insertAtendimento(date, patientName, funcionario, description);
      setMensagem('Atendimento cadastrado com sucesso!');
      setDate('');
      setPatientName('');
      setFuncionario('');
      setDescription('');
      Alert.alert('Sucesso', 'Atendimento cadastrado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior após sucesso
    } catch (errorMsg) {
      setMensagem('Erro ao cadastrar atendimento.');
      setErro(errorMsg);
      Alert.alert('Erro', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Atendimento</Text>
      <View style={styles.formGroup}>
        <Text>Data:</Text>
        <TextInput 
          style={styles.input} 
          value={date} 
          onChangeText={setDate} 
          placeholder="Digite a data (YYYY-MM-DD)"
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Nome do Cliente:</Text>
        <TextInput 
          style={styles.input} 
          value={patientName} 
          onChangeText={setPatientName} 
          placeholder="Digite o nome do cliente"
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Funcionário:</Text>
        <TextInput 
          style={styles.input} 
          value={funcionario} 
          onChangeText={setFuncionario} 
          placeholder="Digite o nome do funcionário"
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Descrição:</Text>
        <TextInput 
          style={styles.input} 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Digite a descrição do atendimento"
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

export default CadastroAtendimento;
