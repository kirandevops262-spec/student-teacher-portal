const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');

const app = express();
app.use(cors());
app.use(express.json());

const REGION = process.env.AWS_REGION || 'us-east-1';
const ssm = new SSMClient({ region: REGION });

let db;

/* ------------------ FETCH DB CONFIG FROM SSM ------------------ */

async function getDBConfig() {
  // If running locally, use env vars directly (no SSM)
  if (process.env.USE_SSM !== 'true') {
    return {
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      name: process.env.database,
    };
  }

  const command = new GetParametersCommand({
    Names: [
      '/myapp/db/host',
      '/myapp/db/user',
      '/myapp/db/password',
      '/myapp/db/name',
    ],
    WithDecryption: true,
  });

  const res = await ssm.send(command);
  const params = {};
  res.Parameters.forEach((p) => {
    params[p.Name.split('/').pop()] = p.Value;
  });

  if (!params.host || !params.user || !params.password || !params.name) {
    throw new Error('Missing DB parameters in SSM');
  }

  return params;
}

/* ------------------ CREATE DATABASE IF NOT EXISTS ------------------ */

async function ensureDatabaseExists(config) {
  const conn = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.name}\``);
  await conn.end();
  console.log('✅ Database verified');
}

/* ------------------ CONNECT TO DB WITH RETRY ------------------ */

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const cfg = await getDBConfig();

      if (process.env.USE_SSM === 'true') {
        await ensureDatabaseExists(cfg);
      }

      const pool = mysql.createPool({
        host: cfg.host,
        user: cfg.user,
        password: cfg.password,
        database: cfg.name,
        connectionLimit: 10,
        ...(process.env.USE_SSM === 'true' && { ssl: { rejectUnauthorized: false } }),
      });

      console.log(`✅ Connected to DB (attempt ${i})`);
      return pool;
    } catch (err) {
      console.error(`❌ DB connection failed (attempt ${i})`, err.message);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/* ------------------ TABLE CREATION ------------------ */

async function ensureTables(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS student (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      roll_number VARCHAR(255),
      class VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS teacher (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      subject VARCHAR(255),
      class VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tables ready');
}

/* ------------------ HEALTH ROUTES (for AWS ALB) ------------------ */

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'backend', uptime: process.uptime() });
});

app.get('/health/db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as db_up');
    res.status(200).json({ status: 'ok', database: 'connected', result: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'down', error: err.message });
  }
});

/* ------------------ ROUTES ------------------ */

app.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM student');
  res.json({ message: 'Backend running 🚀', data: rows });
});

app.get('/student', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM student');
  res.json(rows);
});

app.get('/teacher', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM teacher');
  res.json(rows);
});

app.post('/addstudent', async (req, res) => {
  const { name, rollNo, class: cls } = req.body;
  await db.query('INSERT INTO student (name, roll_number, class) VALUES (?, ?, ?)', [name, rollNo, cls]);
  res.json({ message: 'Student added successfully' });
});

app.post('/addteacher', async (req, res) => {
  const { name, subject, class: cls } = req.body;
  await db.query('INSERT INTO teacher (name, subject, class) VALUES (?, ?, ?)', [name, subject, cls]);
  res.json({ message: 'Teacher added successfully' });
});

app.delete('/student/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM student WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.delete('/teacher/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM teacher WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

/* ------------------ START SERVER ------------------ */

(async () => {
  try {
    db = await connectWithRetry();
    await ensureTables(db);
    app.listen(3500, () => console.log('🚀 Server running on port 3500'));
  } catch (err) {
    console.error('❌ App failed to start:', err);
    process.exit(1);
  }
})();
