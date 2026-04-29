const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');
const jwtCfg = require('../config/jwt');

const register = async ({ name, email, password, role = 'user' }) => {
  const [exists] = await db.execute(
    'SELECT id FROM users WHERE email = ?', [email]
  );
  if (exists.length) throw { status: 409, message: 'Email déjà utilisé' };

  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)',
    [name, email, hash, role]
  );
  return { id: result.insertId, name, email, role };
};

const login = async ({ email, password }) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?', [email]
  );
  const user = rows[0];
  if (!user) throw { status: 401, message: 'Identifiants incorrects' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Identifiants incorrects' };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtCfg.secret,
    { expiresIn: jwtCfg.expiresIn }
  );
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { register, login };