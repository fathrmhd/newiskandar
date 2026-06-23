import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'Backend server is running smoothly.' });
});

app.post('/api/predict', async (req, res) => {
  try {
    const { userInput } = req.body;

    // Validasi input awal sesuai batasan MVP
    if (!userInput) {
      return res.status(400).json({ error: 'Input cannot be empty bos!' });
    }

    console.log(`[Sync Request] Received input: ${userInput}`);

    //TODO:

    const mockAIResponse = {
      result: `Ini adalah hasil prediksi sinkron untuk data: ${userInput}`,
      confidence: 0.95,
      timestamp: new Date()
    };

    return res.status(200).json(mockAIResponse);

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server successfully deployed locally on port ${PORT}`);
});