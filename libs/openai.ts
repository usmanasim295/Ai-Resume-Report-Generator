import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});