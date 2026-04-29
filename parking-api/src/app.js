const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const routes       = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Parking API running' }));

// Gestionnaire d'erreurs global (doit être en dernier)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000')
})