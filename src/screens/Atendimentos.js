import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { fetchAtendimentosPorData } from '../database/database'; // Supondo que você tenha essa função
import DateTimePicker from '@react-native-community/datetimepicker';

const Atendimentos = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [atendimentos, setAtendimentos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAtendimentos(dataSelecionada);
  }, [dataSelecionada]);

  const loadAtendimentos = async (data) => {
    setLoading(true);
    try {
      const atendimentosData = await fetchAtendimentosPorData(data.toISOString().split('T')[0]);
      setAtendimentos(atendimentosData);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar atendimentos.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataSelecionada;
    setShowDatePicker(false);
    setDataSelecionada(currentDate);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text><Text style={styles.bold}>Cliente:</Text> {item.patientName}</Text>
      <Text><Text style={styles.bold}>Funcionário:</Text> {item.funcionarioName}</Text>
      <Text><Text style={styles.bold}>Data:</Text> {new Date(item.date).toLocaleString()}</Text>
      <Text><Text style={styles.bold}>Descrição:</Text> {item.description}</Text>
    </View>
  );

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda do Dia</Text>

      <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text>Data selecionada: {dataSelecionada.toLocaleDateString()}</Text>

      <FlatList
        data={atendimentos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});

export default Atendimentos;
