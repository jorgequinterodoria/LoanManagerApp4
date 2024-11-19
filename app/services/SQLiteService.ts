import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

export const initDatabase = async () => {
    const db = await SQLite.openDatabase({ name: 'loan_manager.db', location: 'default' });
    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT
    );
  `);
    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      amount REAL,
      interest_rate REAL,
      payment_frequency TEXT,
      loan_type TEXT,
      start_date TEXT,
      end_date text,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER primary key autoincrement,
      loan_id integer,
      amount real,
      payment_date text,
      note text,
      FOREIGN KEY (loan_id) REFERENCES loans(id)
    );
  `);
    return db;
};

export const getDatabase = async () => {
    return await SQLite.openDatabase({ name: 'loan_manager.db', location: 'default' });
};
