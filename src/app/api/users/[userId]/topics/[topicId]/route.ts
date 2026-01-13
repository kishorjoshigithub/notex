import { deleteTopicById, updateTopicById } from "@/firebase/topic";
import { Topic } from "@/types";
import { TopicSchema } from "@/validation/topics";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await context.params;

    if (!topicId) {
      return NextResponse.json({ error: "Invalid topicId" }, { status: 400 });
    }

    await deleteTopicById(topicId);
    return NextResponse.json(
      { message: "Topic deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
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
        }
      );
    }

    const topic = await updateTopicById(topicId, { name } as Topic);
    return NextResponse.json(
      { message: "Topic updated successfully", topic },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
