import { getUserById } from "@/firebase/auth";
import { createNote, getNotesByUserId } from "@/firebase/note";
import { noteSchema } from "@/validation/notes";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, res: NextResponse) {
  try {
    const { topicId, title, content, importance, userId } =
      await request.json();

    const validNote = noteSchema.safeParse({
      topicId,
      userId,
      title,
      content,
      importance,
    });

    if (!validNote.success) {
      return NextResponse.json(
        { error: validNote.error.issues[0].message },
        { status: 400 }
      );
    }

    const newNote = {
      topicId,
      userId,
      title,
      content,
      importance,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await createNote(newNote);

    return NextResponse.json(
      { message: "Note created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
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

  const notes = await getNotesByUserId(userId);
  return NextResponse.json(notes ?? [], { status: 200 });
}
