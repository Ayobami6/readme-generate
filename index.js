#!/usr/bin/node

import readline from 'readline';
import fs from 'fs';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const openAIService = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are an AI assistant that can generate Readme Markdown for 
                github project based on description provided as a prompt \n
                ${prompt}`,
      temperature: 1,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const data = response.data['choices'][0]['text'].trim();
    const res = await data;
    await fs.writeFile('README.md', res.toString(), () => {
      console.log('Markdown Created');
    });
  } catch (error) {
    console.log(error.message);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const answer = (ans) => {
  try {
    openAIService(ans);
  } catch (error) {
    console.log(error);
  }

  console.log('Creating your Markdown');

  rl.close();
};

rl.question('Enter your Readme description > ', answer);
