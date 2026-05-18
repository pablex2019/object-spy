const express = require('express');
const cors = require('cors');
const { inspectPage } = require('./services/inspector');
const {
  generatePlaywrightScript,
} = require('./services/scriptGenerator');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.post('/inspect', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await inspectPage(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-script', (req, res) => {
  const { elements } = req.body;

  if (!elements || !Array.isArray(elements)) {
    return res.status(400).json({
      error: 'Debe enviar un array de elementos',
    });
  }

  const script = generatePlaywrightScript(elements);

  res.json({ script });
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});