import { NextResponse } from "next/server";
import { getDebug } from "@/lib/debug/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // Debug payloads are kept in ephemeral, TTL-bound in-memory storage.
  // Missing entries are expected after expiration, process restart, or across instances.
  const data = getDebug(id);
  if (!data) return new Response("Not found", { status: 404 });
  return NextResponse.json(data);
}
