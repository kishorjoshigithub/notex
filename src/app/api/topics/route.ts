import { NextRequest, NextResponse } from "next/server";
import { TopicSchema } from "../../../validation/topics";
import { createTopic } from "@/firebase/topic";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { name, id } = await req.json();
    const validData = TopicSchema.safeParse({ name });
    if (validData.success === false) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newTopic = {
      name,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const topic = await createTopic(newTopic);
    if (!topic) {
      return NextResponse.json(
        { error: "Error creating topic" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Topic created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
