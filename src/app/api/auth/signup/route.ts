import { signupUser } from "@/firebase/auth";
import { SignupSchema } from "@/validation/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const { name, email, password } = await request.json();
  try {
    const validData = SignupSchema.safeParse({ name, email, password });
    if (validData.success === false) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const user = await signupUser({ name, email, password });
    if (!user) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
