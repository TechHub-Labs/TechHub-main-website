/**
 * SuperAdminExecutives.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../core/supabase/client";
import type { Executive } from "../../../core/supabase/types";
import {
  AdminInput,
  AdminTextarea,
  AvatarUploader,
  AdminToggle,
  SaveBar,
  AdminMessagesPanel,
  TagEditor,
  AdminSelect,
} from "./AdminFormComponents";

const CATEGORY_OPTIONS = ["Founding Council", "'27", "'28"];
const EMPTY: Partial<Executive> = {
  name: "",
  role_title: "",
  quote: "",
  avatar_url: null,
  category: [],
  visible: false,
  github: "",
  linkedin: "",
  twitter: "",
};

export function SuperAdminExecutives() {
  const [execs, setExecs] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Executive> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Visible" | "Hidden">("All");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("executives")
      .select("*")
      .order("visible", { ascending: false })
      .order("sort_order", { ascending: true });
    setExecs((data ?? []) as Executive[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing({ ...EMPTY });
    setIsNew(true);
    setSaved(false);
    setFormErr("");
  };
  const openEdit = (e: Executive) => {
    setEditing({ ...e });
    setIsNew(false);
    setSaved(false);
    setFormErr("");
  };
  const close = () => {
    setEditing(null);
    setSaved(false);
    setFormErr("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setSaved(false);
    setFormErr("");

    if (!editing.name?.trim()) {
      setSaving(false);
      return setFormErr("Please provide a name.");
    }
    if (!editing.role_title?.trim()) {
      setSaving(false);
      return setFormErr("Please provide a role/title.");
    }
    if (!editing.avatar_url) {
      setSaving(false);
      return setFormErr("Please upload a profile picture.");
    }
    if (!editing.category || editing.category.length === 0) {
      setSaving(false);
      return setFormErr("Please select a category.");
    }
    if (!editing.quote?.trim()) {
      setSaving(false);
      return setFormErr("Please provide a quote.");
    }
    if (!editing.skills || editing.skills.length === 0) {
      setSaving(false);
      return setFormErr("At least one skill is required.");
    }
    if (!editing.github?.trim()) {
      setSaving(false);
      return setFormErr("Please provide a GitHub/Portfolio link.");
    }

    const payload = {
      name: editing.name,
      role_title: editing.role_title,
      quote: editing.quote,
      avatar_url: editing.avatar_url,
      category: editing.category ?? [],
      visible: editing.visible ?? false,
      skills: editing.skills ?? [],
      projects: editing.projects ?? [],
      github: editing.github,
      linkedin: editing.linkedin,
      twitter: editing.twitter,
    };

    const { error } = isNew
      ? await (supabase.from("executives") as any).insert(payload)
      : await (supabase.from("executives") as any)
          .update(payload)
          .eq("id", editing.id!);

    setSaving(false);
    if (error) {
      setFormErr(error.message);
      return;
    }
    setSaved(true);
    load();
    setTimeout(close, 1000);
  };

  const confirmDelete = async (id: string) => {
    const { error } = await (supabase.from("executives") as any)
      .delete()
      .eq("id", id);
    if (error) {
      setFormErr(`Delete failed: ${error.message}`);
      setDeleting(null);
      return;
    }
    setDeleting(null);
    load();
  };

  const toggleVisible = async (ex: Executive) => {
    await (supabase.from("executives") as any)
      .update({ visible: !ex.visible })
      .eq("id", ex.id);
    load();
  };

  const moveRow = async (id: string, direction: "up" | "down") => {
    const idx = execs.findIndex((e) => e.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === execs.length - 1) return;

    const newExecs = [...execs];
    const targetIndex = direction === "up" ? idx - 1 : idx + 1;

    const temp = newExecs[idx];
    newExecs[idx] = newExecs[targetIndex];
    newExecs[targetIndex] = temp;

    const updates = newExecs.map((e, i) => ({ ...e, sort_order: i }));
    setExecs(updates); // Optimistic UI

    try {
      await Promise.all(
        updates.map((e) =>
          supabase
            .from("executives")
            .update({ sort_order: e.sort_order })
            .eq("id", e.id),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    const newItems = [...execs];
    const draggedIdx = newItems.findIndex((e) => e.id === draggedId);
    const targetIdx = newItems.findIndex((e) => e.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const [draggedItem] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, draggedItem);

    const updates = newItems.map((e, i) => ({ ...e, sort_order: i }));
    setExecs(updates);

    try {
      await Promise.all(
        updates.map((e) =>
          supabase
            .from("executives")
            .update({ sort_order: e.sort_order })
            .eq("id", e.id),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const set = (key: keyof Executive) => (val: any) =>
    setEditing((prev) => (prev ? { ...prev, [key]: val } : prev));

  const toggleCategory = (cat: string) =>
    set("category")(
      (editing?.category ?? []).includes(cat)
        ? (editing?.category ?? []).filter((c: string) => c !== cat)
        : [...(editing?.category ?? []), cat],
    );

  const filtered = execs.filter((e) => {
    const matchSearch = !search || (e.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || (statusFilter === "Visible" ? e.visible : !e.visible);
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#f1f5f9",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "2px",
            }}
          >
            Executive Council
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            {execs.length} total
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-input"
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              color: "inherit",
              fontSize: "13px",
              outline: "none",
              width: "200px",
              transition: "all 0.2s",
              border: "none",
            }}
          />
          <AdminSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            options={[
              { label: "All Status", value: "All" },
              { label: "Visible", value: "Visible" },
              { label: "Hidden", value: "Hidden" },
            ]}
          />
          <button
            onClick={openNew}
            className="min-button"
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              color: "#A3D045",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            + Add Executive
          </button>
        </div>
      </div>

      <AdminMessagesPanel role="executive" />

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading…</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "Order",
                  "Executive",
                  "Role",
                  "Category",
                  "Visible",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: "#64748b",
                      fontWeight: 600,
                      textAlign: "left",
                      padding: "8px 12px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ex, idx) => (
                <tr
                  key={ex.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  className="drag-handle"
                  draggable={!search && statusFilter === "All"}
                  onDragStart={(e) => handleDragStart(e, ex.id!)}
                  onDragOver={(e) => {
                    if (!search && statusFilter === "All") e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (!search && statusFilter === "All") handleDrop(e, ex.id!);
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "rgba(255,255,255,0.02)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "transparent")
                  }
                >
                  <td style={{ padding: "12px", width: "60px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      {!search && statusFilter === "All" && (
                        <div
                          style={{
                            color: "#475569",
                            fontSize: "10px",
                            marginBottom: "2px",
                          }}
                        >
                          ⋮⋮
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {!search && statusFilter === "All" && (
                          <button
                            onClick={() => moveRow(ex.id!, "up")}
                            disabled={idx === 0}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background: "transparent",
                              border: "1px solid",
                              borderColor: idx === 0 ? "#334155" : "#94a3b8",
                              color: idx === 0 ? "#334155" : "#94a3b8",
                              cursor: idx === 0 ? "default" : "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ↑
                          </button>
                        )}
                        {!search && statusFilter === "All" && (
                          <button
                            onClick={() => moveRow(ex.id!, "down")}
                            disabled={idx === filtered.length - 1}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background: "transparent",
                              border: "1px solid",
                              borderColor: idx === filtered.length - 1 ? "#334155" : "#94a3b8",
                              color: idx === filtered.length - 1 ? "#334155" : "#94a3b8",
                              cursor: idx === filtered.length - 1 ? "default" : "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ↓
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        className="min-input"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                          padding: ex.avatar_url ? "0" : "8px",
                        }}
                      >
                        {ex.avatar_url ? (
                          <img
                            src={ex.avatar_url}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#475569",
                            }}
                          >
                            👤
                          </div>
                        )}
                      </div>
                      <span style={{ fontWeight: 600 }}>{ex.name ?? "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8" }}>
                    {ex.role_title ?? "—"}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8" }}>
                    {(ex.category ?? []).join(", ") || "—"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => toggleVisible(ex)}
                      type="button"
                      className="min-button"
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "12px",
                        border: "none",
                        color: ex.visible ? "#A3D045" : "#94a3b8",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: ex.visible ? "24px" : "4px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: ex.visible ? "#A3D045" : "#94a3b8",
                          transition: "left 0.2s",
                        }}
                      />
                    </button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(ex)}
                        className="min-button"
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "none",
                          color: "inherit",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(ex.id)}
                        className="min-button"
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {execs.length === 0 && (
            <p
              style={{ color: "#475569", textAlign: "center", padding: "32px" }}
            >
              No executives yet.
            </p>
          )}
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div
            className="min-card"
            style={{
              padding: "32px",
              maxWidth: "360px",
              width: "90%",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "24px" }}>⚠️</span>
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                Delete executive?
              </h3>
            </div>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              This action{" "}
              <strong style={{ color: "#ef4444" }}>cannot be undone</strong>.
              The executive will be permanently removed.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDeleting(null)}
                className="min-button"
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleting)}
                className="min-button"
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(239,68,68,0.15)",
                  color: "#ef4444",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4 pt-[80px] lg:pt-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="min-card p-6 sm:p-8"
            style={{
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
                {isNew ? "Add Executive" : "Edit Executive"}
              </h2>
              <button
                onClick={close}
                className="min-button"
                style={{
                  border: "none",
                  color: "#64748b",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col gap-4">
                  <AvatarUploader
                    currentUrl={editing.avatar_url ?? null}
                    onUploaded={(url) =>
                      setEditing((prev) =>
                        prev ? { ...prev, avatar_url: url } : prev,
                      )
                    }
                    bucketName="executives"
                    required
                  />
                  <div>
                    <label className="admin-label">
                      Category{" "}
                      <span style={{ color: "#ef4444", marginLeft: "3px" }}>
                        *
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleCategory(opt)}
                          className={
                            (editing.category ?? []).includes(opt)
                              ? "min-input"
                              : "min-button"
                          }
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            border: "none",
                            cursor: "pointer",
                            color: (editing.category ?? []).includes(opt)
                              ? "#A3D045"
                              : "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 flex flex-col">
                  <AdminInput
                    label="Full Name"
                    value={editing.name ?? ""}
                    onChange={set("name")}
                    required
                  />
                  <AdminInput
                    label="Role/Title"
                    value={editing.role_title ?? ""}
                    onChange={set("role_title")}
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <AdminInput
                      label="GitHub/Portfolio"
                      value={editing.github ?? ""}
                      onChange={set("github")}
                      required
                    />
                    <AdminInput
                      label="LinkedIn"
                      value={editing.linkedin ?? ""}
                      onChange={set("linkedin")}
                    />
                    <AdminInput
                      label="Twitter/X"
                      value={editing.twitter ?? ""}
                      onChange={set("twitter")}
                    />
                  </div>
                  <AdminTextarea
                    label="Quote"
                    value={editing.quote ?? ""}
                    onChange={set("quote")}
                    rows={3}
                    required
                  />
                  <div className="flex flex-col sm:flex-row sm:gap-4 mt-2">
                    <div className="flex-1">
                      <TagEditor
                        label="Skills"
                        tags={editing.skills ?? []}
                        onChange={set("skills")}
                        placeholder="e.g. Leadership"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <AdminToggle
                      label="Visible"
                      description="Show on Executive Council page"
                      checked={editing.visible ?? false}
                      onChange={set("visible")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 border-t border-white/5 pt-4">
                <SaveBar saving={saving} saved={saved} error={formErr} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
