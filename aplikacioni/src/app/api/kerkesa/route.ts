import { krijoKerkese, lexoKerkesat } from "@/lib/kerkesat";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const result = await lexoKerkesat();
    if (!result) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    return Response.json(result, { headers: noStore });
  } catch {
    return Response.json(
      { error: "Kërkesat nuk mund të lexohen tani." },
      { status: 503, headers: noStore },
    );
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
    typeof body === "object" &&
    body !== null &&
    "udhetimId" in body &&
    typeof body.udhetimId === "string"
      ? body.udhetimId.trim()
      : "";

  if (!udhetimId) {
    return Response.json({ error: "ID-ja e udhëtimit mungon." }, { status: 400 });
  }

  try {
    const result = await krijoKerkese(udhetimId);
    if (result.status === 401) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    if (result.status === 403) {
      return Response.json({ error: "Vetëm udhëtari mund të dërgojë kërkesë." }, { status: 403 });
    }
    if (result.status === 404) {
      return Response.json({ error: "Udhëtimi nuk ekziston." }, { status: 404 });
    }
    if (result.status === 409) {
      return Response.json(
        { error: "Nuk ka vende të lira ose kërkesa ekziston." },
        { status: 409 },
      );
    }
    return Response.json(result, { status: result.status, headers: noStore });
  } catch {
    return Response.json(
      { error: "Kërkesa nuk u ruajt. Provo përsëri." },
      { status: 503, headers: noStore },
    );
  }
}
