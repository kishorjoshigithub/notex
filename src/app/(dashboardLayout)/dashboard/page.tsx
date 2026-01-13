"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import api from "@/lib/axios";
import { Loader2Icon } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/users/${user.uid}/dashboard`);
        if (res.status === 200) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">
              {data?.topicCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">
              {data?.noteCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= Recent Lists ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* -------- Recent Topics -------- */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recent Topics</CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            {data?.recentTopics?.length ? (
              <ul className="space-y-3">
                {data.recentTopics.map((topic: any) => (
                  <li
                    key={topic.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium truncate">
                      {topic.name ?? "Untitled"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        topic.createdAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No topics yet</p>
            )}
          </CardContent>
        </Card>

        {/* -------- Recent Notes -------- */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            {data?.recentNotes?.length ? (
              <ul className="space-y-3">
                {data.recentNotes.map((note: any) => (
                  <li
                    key={note.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium truncate">
                      {note.title ?? "Untitled"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        note.createdAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No notes yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
