import { deleteNote, updateNote } from "@/firebase/note";
import { Note } from "@/types";
import { noteSchema } from "@/validation/notes";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await context.params;

    if (!noteId) {
      return NextResponse.json({ error: "Invalid topicId" }, { status: 400 });
    }

    await deleteNote(noteId);
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
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await context.params;

    if (!noteId) {
      return NextResponse.json({ error: "Invalid noteId" }, { status: 400 });
    }

    const { topicId, title, content, importance, userId } =
      await request.json();

    const validData = noteSchema.safeParse({
      topicId,
      userId,
      title,
      content,
      importance,
    });
    if (!validData.success) {
      return NextResponse.json(
        { error: validData.error.issues[0].message },
        {
          status: 400,
        }
      );
    }

    const note = await updateNote(noteId, {
      topicId,
      userId,
      title,
      content,
      importance,
    } as Note);
    return NextResponse.json(
      { message: "Note updated successfully", note },
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
