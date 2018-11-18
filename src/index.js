import express from 'express';
import scrape from './scrape';

const app = express();
const port = 3000;

app.get('/transactions', async (req, res) => {
    res.set('Content-Type', 'application/json');

    const body = await scrape(req);
    res.send(body);
});

app.listen(port, () => console.log(`Listening on port ${port}`))
