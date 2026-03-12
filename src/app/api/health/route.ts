export async function GET() {
  return Response.json({
    ok: true,
    app: "chengjiaobao",
    time: new Date().toISOString(),
    aiConfigured: Boolean(process.env.OPENROUTER_API_KEY),
  });
}
