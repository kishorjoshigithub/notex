"use client";

import { X, Trash2 } from "lucide-react";

interface DeleteModalProps {
  id: string;
  title: string;
  message: string;
  onSubmit: (id: string) => void;
  onClose: () => void;
}

const DeleteModal = ({
  id,
  title,
  message,
  onSubmit,
  onClose,
}: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(id)}
            className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
