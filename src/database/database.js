import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('databaseName');

async function createTables() {
  try {
    await db.execAsync(` 
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS CadastroCliente 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, telefone TEXT);

      CREATE TABLE IF NOT EXISTS CadastroFuncionario 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, telefone TEXT, cargo TEXT);
      
      CREATE TABLE IF NOT EXISTS CadastroAtendimento 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, time TEXT, patientName TEXT, funcionario TEXT, description TEXT);
    `);
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

// Função para inserir um cliente
async function insertCliente(nome, email, telefone) {
  try {
    const result = await db.runAsync(
      'INSERT INTO CadastroCliente (nome, email, telefone) VALUES (?, ?, ?);', 
      nome, email, telefone);
    console.log('Cliente cadastrado com sucesso!', result.lastInsertRowId);
    return result.lastInsertRowId; 
  } catch (error) {
    console.error
  }
}


// Função para inserir um funcionário
async function insertFuncionario(nome, email, telefone, cargo) {
  try {
    const result = await db.runAsync(
      'INSERT INTO CadastroFuncionario (nome, email, telefone, cargo) VALUES (?, ?, ?, ?);',
      nome, email, telefone, cargo
    );
    console.log('Funcionário cadastrado com sucesso!', result.lastInsertRowId);
    return result.lastInsertRowId; 
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);
    throw error; 
  }
}


// Função para inserir um atendimento
async function insertAtendimento(date, time, patientName, funcionario, description) {
  try {
    const result = await db.runAsync(
    'INSERT INTO CadastroAtendimento (date, time, patientName, funcionario, description) VALUES (?, ?, ?, ?, ?);', 
    date, time, patientName, funcionario, description
    );
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

// Função para buscar cliente por nome
async function fetchClienteByNome(nome) {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroCliente WHERE nome LIKE ?;', [`%${nome}%`]);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar cliente por nome:', error);
  }
}

// Função para atualizar um cliente
async function updateCliente(nome, email, telefone) {
  try {
    await db.runAsync(
      'UPDATE CadastroCliente SET nome = ?, email = ?, telefone = ?', 
      nome, email, telefone
    );
    console.log('Cliente atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
}

// Função para buscar funcionário por nome
async function fetchFuncionarioByNome(nome) {
  try {
    const rows = await db.getAllAsync('SELECT * FROM CadastroFuncionario WHERE nome LIKE ?;', [`%${nome}%`]);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar funcionário por nome:', error);
  }
}

// Função para atualizar um funcionário
async function updateFuncionario(nome, email, telefone, cargo) {
  try {
    await db.runAsync(
      'UPDATE CadastroFuncionario SET nome = ?, email = ?, telefone = ?, cargo = ?;', 
      [nome, email, telefone, cargo]
    );
    console.log('Funcionário atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw error;
  }
}

// Função para buscar atendimentos por data no formato DD/MM/AAAA
async function fetchAtendimentosPorData(date) {
  try {
    const query = 'SELECT * FROM CadastroAtendimento WHERE date = ?;';
    
    // O banco já armazena a data no formato DD/MM/AAAA, então não é necessária a conversão
    const rows = await db.getAllAsync(query, [date]);
    
    if (rows.length > 0) {
      return rows;
    } else {
      console.log('Nenhum atendimento encontrado para a data:', date);
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar atendimentos por data:', error);
    throw error;
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

  fetchClienteByNome,
  updateCliente,

  fetchFuncionarioByNome,
  updateFuncionario,

  fetchAtendimentosPorData 
};
