import { gjejKerkesen, pranoKerkese } from "@/lib/kerkesat";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function lexoId(value: string) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = lexoId((await params).id);
  if (id === null) {
    return Response.json({ error: "ID-ja e kërkesës nuk është e vlefshme." }, { status: 400 });
  }

  try {
    const result = await gjejKerkesen(id);
    if (!result) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    if (!result.kerkesa) {
      return Response.json({ error: "Kërkesa nuk u gjet." }, { status: 404 });
    }
    return Response.json(result, { headers: noStore });
  } catch {
    return Response.json(
      { error: "Kërkesa nuk mund të lexohet tani." },
      { status: 503, headers: noStore },
    );
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = lexoId((await params).id);
  if (id === null) {
    return Response.json({ error: "ID-ja e kërkesës nuk është e vlefshme." }, { status: 400 });
  }

  try {
    const result = await pranoKerkese(id);
    if (result.status === 401) {
      return Response.json({ error: "Duhet të hysh me GitHub." }, { status: 401 });
    }
    if (result.status === 403) {
      return Response.json({ error: "Vetëm pronari i udhëtimit mund ta pranojë." }, { status: 403 });
    }
    if (result.status === 404) {
      return Response.json({ error: "Kërkesa nuk u gjet." }, { status: 404 });
    }
    if (result.status === 409) {
      return Response.json(
        { error: "Kërkesa nuk mund të pranohet sepse nuk ka vende të lira." },
        { status: 409 },
      );
    }
    return Response.json(result, { headers: noStore });
  } catch {
    return Response.json(
      { error: "Kërkesa nuk u pranua. Provo përsëri." },
      { status: 503, headers: noStore },
    );
  }
}
