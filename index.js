const express = require('express');
const scrapData = require('./Scrapper');
var cors = require('cors');
const { connection } = require('./db');
const { ArticleModel } = require('./models/ArticleModel');

const app = express();
app.use(cors());
app.use(express.json());

let articles = []; // to store articles

app.get('/', (req, res) => {
  res.status(200).json({
    Message: 'Web Scrapper Api',
    PostEndpoint: 'url/scrape',
    getEndpoint: 'url/articles',
  });
});

app.post('/scrape', async (req, res) => {
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    articles = await scrapData(value);
    await ArticleModel.deleteMany({});
    const data = await ArticleModel.insertMany(articles);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error while getting articles' });
  }
});

app.get('/articles', async (req, res) => {
  res.status(200).json(articles);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log('Connected to mongoDb');
  } catch (error) {
    console.log('Error while connecting to mongoDb..');
  }
  console.log(`Server is running on port ${PORT}`);
});
