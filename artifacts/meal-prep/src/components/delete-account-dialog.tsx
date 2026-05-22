import { useState } from "react";
import { useClerk } from "@clerk/react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

const BASE_URL = (import.meta.env.BASE_URL as string)?.replace(/\/$/, "") || "";

interface DeleteAccountDialogProps {
  onClose: () => void;
}

export function DeleteAccountDialog({ onClose }: DeleteAccountDialogProps) {
  const { signOut } = useClerk();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/account`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account.");
      }

      await signOut({ redirectUrl: BASE_URL || "/" });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 size={16} className="text-red-400" />
            </div>
            <h2 className="text-base font-bold text-foreground">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-3 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">This action is permanent and cannot be undone.</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deleting your account will permanently remove:
              </p>
              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                <li>• All meal plans and saved meals</li>
                <li>• Your photo scan journal</li>
                <li>• Weight and water tracking history</li>
                <li>• Your account and login credentials</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Type <span className="font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded text-xs">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="Type DELETE here"
              disabled={loading}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2.5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmed || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete My Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
