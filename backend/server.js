// server.js
import express from "express"
import axios from "axios"

const app = express();
const port = 3000;

app.use(express.json());

// Proxy endpoint to forward the API request
app.post('/api/track', async (req, res) => {
  try {
    const response = await axios.post('http://worldfirst.xpresion.in/api/v1/Tracking/Tracking', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error with the API request', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});