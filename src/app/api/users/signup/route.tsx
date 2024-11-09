import { NextRequest } from "next/server";

// TODO: authenticate route
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();


  } catch (err) {
    console.error(err);
  }
}
