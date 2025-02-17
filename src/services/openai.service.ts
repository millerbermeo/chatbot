import OpenAI from 'openai';
import  config  from '../configs/env';

const openai = new OpenAI({
    apiKey: config.openai.apiKey
})

async function getResponse() {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Te llamas Miller, preséntate como tal' },
        { role: 'user', content: '¿De qué se trata la UFC?' }
      ],
    });
  
    console.log(response.choices[0].message.content);
  }
  
  getResponse();