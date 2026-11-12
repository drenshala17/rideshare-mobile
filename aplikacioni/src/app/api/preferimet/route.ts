import { lexoPreferimet, ruajPreferim } from "@/lib/preferimet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await lexoPreferimet();
    if (!result) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Preferimet nuk mund të lexohen tani." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Kërkesa nuk është e vlefshme." }, { status: 400 });
  }

  const udhetimId =
    typeof body === "object" && body !== null && "udhetimId" in body &&
    typeof body.udhetimId === "string"
      ? body.udhetimId.trim()
      : "";
  if (!udhetimId) {
    return Response.json({ error: "ID-ja e udhëtimit mungon." }, { status: 400 });
  }

  try {
    const result = await ruajPreferim(udhetimId);
    if (result.status === 401) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    if (result.status === 404) {
      return Response.json({ error: "Udhëtimi nuk ekziston." }, { status: 404 });
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Nuk u ruajt. Provo përsëri." }, { status: 503 });
  }
}
