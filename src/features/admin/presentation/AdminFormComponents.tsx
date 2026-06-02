/**
 * AdminFormComponents.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useRef, useState, useEffect } from "react";
import { supabase } from "../../../core/supabase/client";
import { toast } from "../../../shared/components/Toast";

export function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label className="admin-label">
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-input"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          boxSizing: "border-box",
          color: "inherit",
          fontSize: "14px",
          outline: "none",
          transition: "all 0.2s",
        }}
      />
    </div>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label className="admin-label">
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
        )}
      </label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="min-input"
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          boxSizing: "border-box",
          color: "inherit",
          fontSize: "14px",
          outline: "none",
          resize: "vertical",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

export function TagEditor({
  label,
  tags,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    if (!input.trim()) return;
    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
    setInput("");
  };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label className="admin-label">
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
        )}
      </label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          value={input}
          placeholder={placeholder ?? "Add item…"}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(",")) {
              const parts = val.split(",");
              // all parts except the last one are definitely complete tags
              const newTags = parts
                .slice(0, -1)
                .map((t) => t.trim())
                .filter((t) => t && !tags.includes(t));
                
              const lastPart = parts[parts.length - 1];
              
              if (newTags.length > 0) {
                onChange([...tags, ...newTags]);
              }
              setInput(lastPart.trimStart());
            } else {
              setInput(val);
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="min-input"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "12px",
            boxSizing: "border-box",
            color: "inherit",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s",
          }}
        />
        <button
          onClick={add}
          type="button"
          className="min-button"
          style={{
            padding: "10px 18px",
            borderRadius: "12px",
            border: "none",
            color: "#A3D045",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {tags.map((tag, idx) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(163,208,69,0.15)",
              color: "#A3D045",
              border: "1px solid rgba(163,208,69,0.3)",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "13px",
              fontWeight: 600,
              animation: `tagPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s both`,
            }}
          >
            {tag}
            <button
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#A3D045",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
                padding: 0,
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              ×
            </button>
          </span>
        ))}
        <style>{`@keyframes tagPopIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    </div>
  );
}

export function AvatarUploader({
  currentUrl,
  onUploaded,
  bucketName = "avatars",
  required = false,
}: {
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  bucketName?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`; // random path
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
      toast.success("Photo uploaded successfully!");
    } else {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
      alert(
        `Upload failed: ${error.message}.\n\nPlease ensure you have created a public bucket named '${bucketName}' in your Supabase Storage dashboard and enabled Row Level Security (RLS) policies for anonymous uploads/reads.`,
      );
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <label className="admin-label">
        Profile Photo
        {required && (
          <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
        )}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          className="min-input"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            padding: preview ? "0" : "16px",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "24px",
              }}
            >
              👤
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="min-button"
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              border: "none",
              color: "inherit",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {uploading ? "Uploading…" : "Change photo"}
          </button>
          <p style={{ color: "#475569", fontSize: "11px", marginTop: "4px" }}>
            JPG, PNG or WebP · Max 2MB
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  );
}

export function AdminToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div
          className="admin-label"
          style={{ fontSize: "14px", marginBottom: 0 }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              color: "inherit",
              opacity: 0.7,
              fontSize: "12px",
              marginTop: "2px",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          border: "none",
          background: checked ? "#A3D045" : "#334155",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "22px" : "2px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

export function SaveBar({
  saving,
  saved,
  error,
}: {
  saving: boolean;
  saved: boolean;
  error: string;
}) {
  useEffect(() => {
    if (saved && !error) {
      toast.success("Saved successfully!");
    }
  }, [saved, error]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginTop: "32px",
      }}
    >
      <button
        type="submit"
        disabled={saving}
        className={saving ? "" : "min-button"}
        style={{
          padding: "14px 32px",
          borderRadius: "12px",
          border: "none",
          color: saving ? "#94a3b8" : "#A3D045",
          fontWeight: 700,
          fontSize: "15px",
          letterSpacing: "0.5px",
          cursor: saving ? "not-allowed" : "pointer",
          background: saving ? "transparent" : undefined,
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
      {saved && !error && (
        <span style={{ color: "#A3D045", fontSize: "13px" }}>
          ✓ Saved successfully
        </span>
      )}
      {error && (
        <span style={{ color: "#f87171", fontSize: "13px" }}>{error}</span>
      )}
    </div>
  );
}

export interface AdminMessage {
  id: string;
  sender_name: string;
  role: string;
  request_type: string;
  message: string;
  created_at: string;
}

export function AdminMessagesPanel({ role }: { role: "member" | "executive" }) {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_messages")
      .select("*")
      .eq("role", role)
      .eq("is_read", false)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as AdminMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [role]);

  const markRead = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase
      .from("admin_messages")
      .update({ is_read: true })
      .eq("id", id);
  };

  if (loading) return null;
  if (messages.length === 0) return null;

  return (
    <div style={{ marginBottom: "24px" }}>
      <h2
        style={{
          color: "#fbbf24",
          fontSize: "14px",
          fontWeight: 700,
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        📬 New Edit Requests ({messages.length})
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            className="min-card"
            style={{
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              animation: "adminFadeIn 0.3s",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "16px" }}>
                  {m.sender_name}
                </div>
                <div
                  className="min-input"
                  style={{
                    color: "#fbbf24",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "8px",
                  }}
                >
                  {m.request_type || "Update"}
                </div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  · {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              <div
                style={{ fontSize: "15px", lineHeight: 1.6, fontWeight: 500 }}
              >
                {m.message}
              </div>
            </div>
            <button
              onClick={() => markRead(m.id)}
              className="min-button"
              style={{
                color: "#fbbf24",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: "none",
              }}
            >
              Mark Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = () => setOpen(false);
    // Timeout prevents immediate trigger
    setTimeout(() => document.addEventListener("click", handleOutsideClick), 10);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="min-input"
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 16px",
          borderRadius: "12px",
          color: "inherit",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          cursor: "pointer",
          border: "none",
        }}
      >
        <span style={{ fontWeight: 600 }}>{selectedLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            opacity: 0.6,
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {open && (
        <div
          className="min-card"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: "160px",
            padding: "8px",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="min-button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                background: opt.value === value ? "rgba(163,208,69,0.15)" : "transparent",
                color: opt.value === value ? "#A3D045" : "inherit",
                fontSize: "13px",
                fontWeight: opt.value === value ? 700 : 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
