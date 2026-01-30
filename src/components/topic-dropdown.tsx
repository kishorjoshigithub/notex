"use client";

import { Check, ChevronDown, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useTopic } from "@/context/topicContext";

const TopicDropdown = () => {
  const { topics, selectedTopic, setSelectedTopic, loading } = useTopic();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="px-4 py-2">
        <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!topics.length) return null;

  return (
    <div className="px-4">
      <div className="relative w-full">
        {/* Trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`
        w-full h-10 flex items-center justify-between
        px-3 rounded-md
        bg-accent text-sm font-medium
        transition
        hover:bg-accent/80
        focus:outline-none focus:ring-2 focus:ring-ring
        ${open ? "ring-2 ring-ring" : ""}
      `}
        >
          <span className="truncate">
            {selectedTopic?.name ?? "Select topic"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
          absolute inset-x-0 w-full mt-2 z-50 h-80 overflow-y-auto
          rounded-md border border-border
          bg-background shadow-lg
          
        "
          >
            {topics.map((topic) => {
              const isActive = topic.id === selectedTopic?.id;

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setOpen(false);
                  }}
                  className={`
                w-full h-9 px-3
                flex items-center justify-between
                text-sm transition-colors
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/60"
                }
              `}
                >
                  <span className="truncate">{topic.name}</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {isActive && <Check className="w-4 h-4" />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDropdown;
