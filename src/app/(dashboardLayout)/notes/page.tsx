"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Calendar,
  Tag,
  Loader2Icon,
  Sparkles,
  Trash2,
  Pencil,
  Trash2Icon,
  Edit2Icon,
  Search,
  BrainCircuit,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import MDEditor from "@uiw/react-md-editor";
import { noteSchema } from "@/validation/notes";

import { useAuth } from "@/context/authContext";
import api from "@/lib/axios";
import toast from "react-hot-toast";

import { Importance, Note, Topic } from "@/types";
import { Timestamp } from "firebase/firestore";
import { useTopic } from "@/context/topicContext";
import DeleteModal from "@/components/DeleteModel";

const INITIAL_FORM_STATE: Note = {
  title: "",
  content: "",
  topicId: "",
  userId: "",
  importance: "medium",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

const importanceColors: any = {
  low: "bg-red-500 rounded-md",
  medium: "bg-yellow-500 rounded-md",
  high: "bg-green-500 rounded-md",
};

const NotesComponent: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Note>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { topics, selectedTopic } = useTopic();
  const [generatingNoteId, setGeneratingNoteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [importanceFilter, setImportanceFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const fetchNotes = async () => {
    if (!user?.uid || !selectedTopic) return;
    try {
      setLoading(true);
      const res = await api.get(
        `/users/${user?.uid}/topics/${selectedTopic.id}`,
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTopic?.id || !user?.uid || topics.length === 0) {
      return;
    }
    fetchNotes();
  }, [user?.uid, selectedTopic?.id]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      );
    }

    if (importanceFilter !== "all") {
      result = result.filter((n) => n.importance === importanceFilter);
    }

    result.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [notes, search, importanceFilter, sortBy]);

  const openModal = (note?: any) => {
    if (!user?.uid || !selectedTopic) return;

    if (note) {
      setEditingNoteId(note.id);
      setFormData({
        title: note.title ?? "",
        content: note.content ?? "",
        topicId: note.topicId ?? "",
        userId: user?.uid || "",
        importance: note.importance ?? "medium",
        createdAt: note.createdAt ?? Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      setEditingNoteId(null);
      setFormData({
        ...INITIAL_FORM_STATE,
        topicId: selectedTopic.id,
        userId: user?.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log(formData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleGenerating = (noteId: string) => {
    setIsGenerating(true);
    setGeneratingNoteId(noteId);
  };

  const generateWithAI = async (content: string, noteId: string) => {
    setIsGenerating(true);
    try {
      const response = await api.patch(`/users/${user?.uid}/notes/${noteId}`, {
        content: content,
      });
      if (response.status === 200) {
        toast.success("Note has been enhanced with AI");
        fetchNotes();
      } else {
        toast.error(response.data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
      setGeneratingNoteId(null);
    }
  };

  const closeModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingNoteId(null);
    setIsModalOpen(false);
    setErrors({});
  };

  const handleChange = <K extends keyof Note>(key: K, value: Note[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const validation = noteSchema.safeParse(formData);

    if (!validation.success) {
      const errs: Record<string, string> = {};
      validation.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    try {
      setSaving(true);

      if (editingNoteId) {
        await api.put(`/users/${user?.uid}/notes/${editingNoteId}`, formData);
        toast.success("Note updated successfully");
      } else {
        await api.post(`/users/${user?.uid}/notes`, formData);
        toast.success("Note created successfully");
      }

      fetchNotes();
      closeModal();
    } catch {
      toast.error(
        editingNoteId ? "Failed to update note" : "Failed to create note",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setDeletingNoteId(noteId);
      const response = await api.delete(`/users/${user?.uid}/notes/${noteId}`);

      if (response.status === 200) {
        toast.success("Note deleted successfully");
        fetchNotes();
      } else {
        toast.error(response.data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingNoteId(null);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2Icon className="size-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap-reverse max-sm:gap-4 justify-between items-center mb-8 border-b border-gray-700 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={importanceFilter}
                onValueChange={(v) => setImportanceFilter(v as any)}
              >
                <SelectTrigger className="h-10 w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="h-10 w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className={`h-10 w-64 rounded-md border border-border bg-background
    p-4 text-sm
    placeholder:text-muted-foreground
    focus:outline-none focus:ring-2 focus:ring-ring`}
              />
            </div>

            <Button
              onClick={() => openModal(null)}
              disabled={!selectedTopic}
              className="h-10 gap-2"
            >
              <Plus size={16} />
              New Note
            </Button>
          </div>

          {filteredNotes.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="group relative overflow-hidden border border-border/60 shadow-sm transition-all hover:shadow-lg"
                >
                  <CardHeader className=" border-b border-gray-500/40">
                    <div className="flex gap-2 sm:gap-0 justify-between items-center flex-wrap ">
                      <div className=" space-y-2">
                        <CardTitle className="text-lg font-semibold leading-tight">
                          {note.title}
                        </CardTitle>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 capitalize">
                            <Tag
                              size={12}
                              className={importanceColors[note.importance]}
                            />
                            {note.importance}
                          </span>
                        </div>
                      </div>
                      <div className=" flex gap-2 opacity-1000 transition-opacity ">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateWithAI(note.content, note.id);
                            handleGenerating(note.id);
                          }}
                        >
                          {isGenerating && generatingNoteId === note.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(note);
                          }}
                        >
                          <Edit2Icon className="h-4 w-4 text-primary" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          disabled={deletingNoteId === note.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteNoteId(note.id);
                          }}
                        >
                          {deletingNoteId === note.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-6">
                    <div className="relative h-52 overflow-y-auto pr-2">
                      {isGenerating && generatingNoteId === note.id ? (
                        <div className="flex items-center justify-center h-52">
                          <Loader2Icon className="h-8 w-8 animate-spin" />
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
                          <MDEditor.Markdown
                            source={note.content}
                            style={{
                              backgroundColor: "transparent",
                              color: "hsl(215 16% 47%)",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent className="flex flex-col items-center">
                <Sparkles className="w-8 h-8 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first note to get started.
                </p>
                <Button
                  onClick={() => openModal(null)}
                  disabled={!selectedTopic}
                  className="gap-2"
                >
                  <Plus size={16} />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingNoteId ? "Edit Note" : "New Note"}
              </h2>
              <X
                className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={closeModal}
              />
            </div>
            {errors.topicId && (
              <p className="text-sm text-destructive">{errors.topicId}</p>
            )}

            <input
              className="mb-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}

            <Select
              value={formData.importance || "medium"}
              onValueChange={(v) => handleChange("importance", v as any)}
            >
              <SelectTrigger className="my-3 w-full">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.importance && (
              <p className="text-sm text-destructive">{errors.importance}</p>
            )}

            <div
              data-color-mode="dark"
              className="mt-3 overflow-hidden rounded-md border border-border"
            >
              <MDEditor
                value={formData.content || ""}
                onChange={(v) => handleChange("content", v || "")}
                height={320}
              />
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-destructive">{errors.content}</p>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSave}
                disabled={
                  saving ||
                  !formData.title ||
                  !formData.content ||
                  !formData.topicId
                }
              >
                {saving
                  ? "Saving..."
                  : editingNoteId
                    ? "Update Note"
                    : "Save Note"}
              </Button>

              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteNoteId && (
        <DeleteModal
          id={deleteNoteId}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          onSubmit={(id) => {
            handleDeleteNote(id);
            setDeleteNoteId(null);
          }}
          onClose={() => setDeleteNoteId(null)}
        />
      )}
    </div>
  );
};

export default NotesComponent;
