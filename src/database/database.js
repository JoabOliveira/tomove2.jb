import * as SQLite from 'expo-sqlite';

// Abrir banco de dados
const db = SQLite.openDatabaseSync('databaseName');

// Criar tabelas
async function createTables() {
  try {
    await db.execAsync(` 
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS CadastroCliente (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, telefone TEXT);
      CREATE TABLE IF NOT EXISTS CadastroFuncionario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, telefone TEXT, cargo TEXT);
      CREATE TABLE IF NOT EXISTS CadastroAtendimento (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, patientName TEXT, funcionario TEXT, description TEXT);
    `);
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

// Função para inserir um cliente
async function insertCliente(nome, email, telefone) {
  try {
    const result = await db.runAsync('INSERT INTO CadastroCliente (nome, email, telefone) VALUES (?, ?, ?);', nome, email, telefone);
    console.log('Cliente cadastrado com sucesso!', result.lastInsertRowId);
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
  }
}

// Função para inserir um funcionário
async function insertFuncionario(nome, email, telefone, cargo) {
  try {
    const result = await db.runAsync('INSERT INTO CadastroFuncionario (nome, email, telefone, cargo) VALUES (?, ?, ?, ?);', nome, email, telefone, cargo);
    console.log('Funcionário cadastrado com sucesso!', result.lastInsertRowId);
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);
  }
}

// Função para inserir um atendimento
async function insertAtendimento(date, patientName, funcionario, description) {
  try {
    const result = await db.runAsync('INSERT INTO CadastroAtendimento (date, patientName, funcionario, description) VALUES (?, ?, ?, ?);', date, patientName, funcionario, description);
    console.log('Atendimento cadastrado com sucesso!', result.lastInsertRowId);
  } catch (error) {
    console.error('Erro ao cadastrar atendimento:', error);
  }
}

// Função para buscar todos os clientes
async function fetchCliente() {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroCliente;');
    return rows;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
}

// Função para buscar todos os funcionários
async function fetchFuncionario() {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroFuncionario;');
    return rows;
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
  }
}

// Função para buscar todos os atendimentos
async function fetchAtendimento() {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroAtendimento;');
    return rows;
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error);
  }
}

// Função para buscar atendimento por ID
async function fetchAtendimentoById(id) {
  try {
    const row = await db.getFirstAsync('SELECT * FROM CadastroAtendimento WHERE id = ?;', id);
    return row || null;
  } catch (error) {
    console.error('Erro ao buscar atendimento:', error);
  }
}

// Função para buscar atendimentos por data
async function fetchAtendimentoPorData(date) {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroAtendimento WHERE date = ?;', date);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar atendimentos por data:', error);
  }
}

// Inicializar as tabelas
createTables();

// Exportar funções
export { 
  insertCliente, 
  insertFuncionario, 
  insertAtendimento, 
  fetchCliente, 
  fetchFuncionario, 
  fetchAtendimento, 
  fetchAtendimentoById, 
  fetchAtendimentoPorData 
};
