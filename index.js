const express = require('express');
const scrapData = require('./Scrapper');
var cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors())
app.use(express.json());



const articlesFilePath = path.join(__dirname, 'articles.json');


const loadArticles = () => {
  if (fs.existsSync(articlesFilePath)) {
    const data = fs.readFileSync(articlesFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const saveArticles = (articles) => {
  fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2));
};

let articles = loadArticles()



app.get("/",(req,res)=>{
  res.status(200).json({Message:"Web Scrapper Api", PostEndpoint:"url/scrape",
    getEndpoint:"url/articles"
  })
})
app.post('/scrape', async (req, res) => {
  const { value } = req.body;
  if (!value) {
      return res.status(400).json({ error: 'Input is required' });
  }

  try {
      articles = await scrapData(value);
      saveArticles(articles);
      res.status(200).json(articles);
  } catch (error) {
      res.status(500).json({ error: 'Error while getting articles' });
  }
});

app.get("/articles", async (req, res) => {
  res.status(200).json(articles);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
