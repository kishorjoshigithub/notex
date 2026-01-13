"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Sparkles,
  Edit2Icon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { Topic } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TopicSchema } from "@/validation/topics";
import api from "@/lib/axios";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const router = useRouter();

  const fetchTopics = async () => {
    if (!user?.uid) return;
    try {
      const response = await api.get(`/users/${user.uid}/topics`);
      if (response.status === 200) setTopics(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [user?.uid]);

  const handleSubmitTopic = async () => {
    const parsed = TopicSchema.safeParse({
      name: newTopicName,
      description: newTopicDescription,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      if (editingTopic) {
        await api.put(`/users/${user?.uid}/topics/${editingTopic.id}`, {
          name: newTopicName,
          description: newTopicDescription,
        });
        toast.success("Topic updated");
      } else {
        await api.post("/users/[userId]/topics", {
          name: newTopicName,
          description: newTopicDescription,
          id: user?.uid,
        });
        toast.success("Topic created");
      }

      fetchTopics();
      setIsDialogOpen(false);
      setEditingTopic(null);
      setNewTopicName("");
      setNewTopicDescription("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      setDeletingTopicId(topicId);
      await api.delete(`users/${user?.uid}/topics/${topicId}`);
      toast.success("Topic deleted");
      fetchTopics();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingTopicId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Topics</h1>
          <p className="text-sm text-muted-foreground">
            Organize your notes by learning topics
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTopic(null);
            setNewTopicName("");
            setNewTopicDescription("");
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </Button>
      </div>

      {/* Loading */}
      {fetching && (
        <div className="flex justify-center py-20">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!fetching && topics.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center  text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No topics yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first topic to organize notes and ideas.
            </p>
            <Button
              className="mt-6 gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </CardContent>
        </Card>
      )}

      {!fetching && topics.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => router.push("/notes")}
              className="
                group cursor-pointer
                transition-all
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              <CardHeader className="flex flex-row gap-4 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
                  {topic.name.charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {topic.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between pt-0">
                <p className="text-xs text-muted-foreground">
                  Created{" "}
                  {new Date(
                    topic.createdAt.seconds * 1000
                  ).toLocaleDateString()}
                </p>

                <div className="flex gap-2 opacity-100 transition-opacity ">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic(topic);
                      setNewTopicName(topic.name);
                      setNewTopicDescription(topic.description);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={deletingTopicId === topic.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTopic(topic.id);
                    }}
                  >
                    {deletingTopicId === topic.id ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Topic" : "Add Topic"}
            </DialogTitle>
            <DialogDescription>
              {editingTopic
                ? "Update your topic details"
                : "Create a new learning topic"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Topic Name</label>
              <Input
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="JavaScript, React, AI..."
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                placeholder="Short description of the topic"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitTopic}
              disabled={isLoading}
              className="relative"
            >
              <span className={isLoading ? "opacity-0" : ""}>
                {editingTopic ? "Update Topic" : "Create Topic"}
              </span>
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2Icon className="animate-spin" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Topics;
