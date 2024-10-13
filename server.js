// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/summarize', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'No content provided.' });
    }

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Summarize the following content:\n\n${content}`,
            max_tokens: 150,
            temperature: 0.7,
        });

        const summary = response.data.choices[0].text.trim();
        res.json({ summary });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: 'Failed to generate summary.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
