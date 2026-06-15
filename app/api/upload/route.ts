import pdfParse from 'pdf-parse';
import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes resume/CV PDF documents. ' +
            'Provide a summary of the candidate. ' +
            'Give a clear score rating (e.g., "Full-Stack Score: XX%") on how good this candidate is as a Full-Stack Developer based on their skills. ' +
            'List out clearly in bullet points how many projects they have worked on and brief details about them. ' +
            'Format your entire response nicely using markdown.',
        },
        {
          role: 'user',
          content: `Please analyze and summarize this candidate's PDF:\n\n${pdfText}`,
        },
      ],
    });

    return Response.json({
      success: true,
      extractedText: pdfText,
      aiResponse: response.choices?.[0]?.message?.content,
    });
  } catch (error) {
    console.error('PDF parsing error:', error);

    return Response.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
