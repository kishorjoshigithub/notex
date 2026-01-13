import { getUserById } from "@/firebase/auth";
import { createTopic, getTopicsByUserId } from "@/firebase/topic";
import { TopicSchema } from "@/validation/topics";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const topics = await getTopicsByUserId(userId);

  return NextResponse.json(topics ?? [], { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const { name, id, description } = await req.json();
    const validData = TopicSchema.safeParse({ name, description });
    if (validData.success === false) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newTopic = {
      name,
      description,
      id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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
