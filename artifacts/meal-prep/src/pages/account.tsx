import { useState } from "react";
import { useUser } from "@clerk/react";
import { Trash2, Shield, UserCircle2, AlertTriangle } from "lucide-react";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your PrepFit account and data</p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <UserCircle2 size={24} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {isLoaded ? (user?.fullName || user?.firstName || "PrepFit User") : "—"}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {isLoaded ? (user?.primaryEmailAddress?.emailAddress || "—") : "—"}
          </p>
        </div>
      </div>

      {/* Data & privacy */}
      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3">
          <Shield size={16} className="text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Privacy Policy</p>
            <a
              href="/privacy"
              className="text-xs text-primary hover:underline"
            >
              prepfit.fit/privacy
            </a>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-red-500/20 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-red-500/20 bg-red-500/5">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Danger Zone</p>
        </div>
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Delete account &amp; all data</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Permanently removes your account, meal plans, photos, weight history, and all associated data. This cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </div>
  );
}
