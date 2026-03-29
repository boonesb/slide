import { NextResponse } from "next/server";
import { getDebug } from "@/lib/debug/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const data = getDebug(id);
  if (!data) return new Response("Not found", { status: 404 });
  return NextResponse.json(data);
}
