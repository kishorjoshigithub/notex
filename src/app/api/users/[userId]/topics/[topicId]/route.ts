import { getUserById } from "@/firebase/auth";
import { getNotesByTopicId } from "@/firebase/note";
import { deleteTopicById, updateTopicById } from "@/firebase/topic";
import { Topic } from "@/types";
import { TopicSchema } from "@/validation/topics";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string; topicId: string }> },
) {
  try {
    const { topicId } = await context.params;

    if (!topicId) {
      return NextResponse.json({ error: "Invalid topicId" }, { status: 400 });
    }

    await deleteTopicById(topicId);
    return NextResponse.json(
      { message: "Topic deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string; topicId: string }> },
) {
  try {
    const { topicId } = await context.params;

    if (!topicId) {
      return NextResponse.json({ error: "Invalid topicId" }, { status: 400 });
    }

    const { name } = await request.json();

    const validData = TopicSchema.safeParse({ name });
    if (!validData.success) {
      return NextResponse.json(
        { error: validData.error.issues[0].message },
        {
          status: 400,
        },
      );
    }

    const topic = await updateTopicById(topicId, { name } as Topic);
    return NextResponse.json(
      { message: "Topic updated successfully", topic },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string; topicId: string }> },
) {
  const { userId, topicId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const notes = await getNotesByTopicId(topicId);
  return NextResponse.json(notes ?? [], { status: 200 });
}
