import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertAtendimento, fetchClienteByNome, fetchFuncionarioByNome } from '../database/database';

const CadastroAtendimento = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [description, setDescription] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [clienteBusca, setClienteBusca] = useState('');
  const [funcionarioBusca, setFuncionarioBusca] = useState('');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTime(false);
    setTime(currentTime);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; 
  };

  const formatTime = (time) => {
    const hours = String(time.getHours() -3).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; 
  };

  const handleSubmit = async () => {
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    if (!formattedDate || !formattedTime || !patientName || !funcionario || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await insertAtendimento(formattedDate, formattedTime, patientName, funcionario, description);
      Alert.alert('Sucesso', 'Atendimento cadastrado com sucesso!');

      setPatientName('');
      setFuncionario('');
      setDescription(''); 
      setDate(new Date());
      setTime(new Date());
      setErro(null);    

      navigation.navigate('CadastroAtendimento');
    } catch (errorMsg) {
      setMensagem('Erro ao cadastrar atendimento.');
      setErro(errorMsg);
      Alert.alert('Erro', errorMsg);
    }
  };

  const buscarCliente = async (nome) => {
    if (nome) {
      const resultado = await fetchClienteByNome(nome);
      setClientes(resultado);
    } else {
      setClientes([]);
    }
  };

  const buscarFuncionario = async (nome) => {
    if (nome) {
      const resultado = await fetchFuncionarioByNome(nome);
      setFuncionarios(resultado);
    } else {
      setFuncionarios([]);
    }
  };

  const selecionarCliente = (cliente) => {
    setPatientName(cliente.nome);
    setClienteBusca(''); 
    setClientes([]); 
  };

  const selecionarFuncionario = (funcionario) => {
    setFuncionario(funcionario.nome);
    setFuncionarioBusca('');
    setFuncionarios([]); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Atendimento</Text>
      <View style={styles.formGroup}>
        <Text>Data:</Text>
        <Button title="Selecionar Data" onPress={() => setShowDate(true)} />
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text>{formatDate(date)}</Text> 
      </View>
      <View style={styles.formGroup}>
        <Text>Horário:</Text>
        <Button title="Selecionar Horário" onPress={() => setShowTime(true)} />
        {showTime && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <Text>{formatTime(time)}</Text>
      </View>
      <View style={styles.formGroup}>
        <Text>Cliente:</Text>
        <TextInput 
          style={styles.input} 
          value={patientName} 
          onChangeText={(nome) => {
            setPatientName(nome);
            buscarCliente(nome);
          }} 
          placeholder="Digite o nome do cliente"
        />
        {clientes.length > 0 && (
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selecionarCliente(item)}>
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View style={styles.formGroup}>
        <Text>Funcionário:</Text>
        <TextInput 
          style={styles.input} 
          value={funcionario} 
          onChangeText={(nome) => {
            setFuncionario(nome);
            buscarFuncionario(nome);
          }} 
          placeholder="Digite o nome do funcionário"
        />
        {funcionarios.length > 0 && (
          <FlatList
            data={funcionarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selecionarFuncionario(item)}>
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        )}
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
