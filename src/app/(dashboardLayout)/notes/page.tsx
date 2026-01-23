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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Note>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    if (!user?.uid) return;
    const res = await api.get(`/users/${user.uid}/topics`);
    setTopics(res.data);
  }, [user?.uid]);

  const fetchNotes = useCallback(async () => {
    if (!user?.uid) return;
    const res = await api.get(`/users/${user.uid}/notes`);
    setNotes(res.data);
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    Promise.all([fetchTopics(), fetchNotes()])
      .catch(() => toast.error("Failed to load notes"))
      .finally(() => setLoading(false));
  }, [fetchNotes, fetchTopics, user?.uid]);

  const openModal = (note?: any) => {
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
        title: "",
        content: "",
        topicId: topics.length ? topics[0].id : "",
        userId: user?.uid || "",
      });
    }

    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingNoteId(null);
    setIsModalOpen(false);
    setErrors({});
  };

  const filteredAndSortedNotes = useMemo(() => {
    const filtered =
      selectedTopic === "all"
        ? notes
        : notes.filter((n) => n.topicId === selectedTopic);

    return [...filtered].sort((a, b) => {
      const aTime = a.createdAt.seconds * 1000;
      const bTime = b.createdAt.seconds * 1000;

      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [notes, selectedTopic, sortBy]);

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

      await fetchNotes();
      closeModal();
    } catch {
      toast.error(
        editingNoteId ? "Failed to update note" : "Failed to create note",
      );
    } finally {
      setSaving(false);
    }
  };

  const getTopicName = (id: string) =>
    topics.find((t) => t.id === id)?.name || "Unknown";

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
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-sm font-medium">Filter by Topic : </label>
              <Select
                value={selectedTopic || "all"}
                onValueChange={(v) => setSelectedTopic(v)}
              >
                <SelectTrigger className="my-3">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="text-sm font-medium ml-4">Sort by : </label>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="my-3">
                  <SelectValue placeholder="Select sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openModal} className="gap-2">
              <Plus size={16} />
              New Note
            </Button>
          </div>

          {filteredAndSortedNotes.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedNotes.map((note) => (
                <Card
                  key={note.id}
                  className="group relative overflow-hidden border border-border/60 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="absolute right-4 top-4 flex gap-2 opacity-1000 transition-opacity ">
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
                        handleDeleteNote(note.id);
                      }}
                    >
                      {deletingNoteId === note.id ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>

                  <CardHeader className="space-y-2 border-b border-gray-500/40">
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
                  </CardHeader>

                  <CardContent className="flex-1 pb-6">
                    <div className="relative h-52 overflow-y-auto pr-2">
                      <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
                        <MDEditor.Markdown
                          source={note.content}
                          style={{
                            backgroundColor: "transparent",
                            color: "hsl(215 16% 47%)",
                          }}
                        />
                      </div>
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
                <Button onClick={openModal} className="gap-2">
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
              value={formData.topicId || ""}
              onValueChange={(v) => handleChange("topicId", v)}
            >
              <SelectTrigger className="my-3 w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topicId && (
              <p className="text-sm text-destructive">{errors.topicId}</p>
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
    </div>
  );
};

export default NotesComponent;
