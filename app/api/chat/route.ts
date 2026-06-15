export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json(
        {
          error: 'Question is required',
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      answer: `You asked: ${question}`,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
