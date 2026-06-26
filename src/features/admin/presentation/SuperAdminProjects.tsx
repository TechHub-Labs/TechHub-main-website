/**
 * SuperAdminProjects.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../core/supabase/client";
import type { Project } from "../../../core/supabase/types";
import {
  AdminInput,
  AdminTextarea,
  TagEditor,
  AdminToggle,
  SaveBar,
  AvatarUploader,
} from "./AdminFormComponents";

const STATUS_OPTIONS = ["In Development", "Completed", "On Hold", "Archived"];
const EMPTY: Partial<Project> = {
  title: "",
  description: "",
  short_description: "",
  tech: [],
  status: "In Development",
  category: "",
  team_size: "",
  github_url: "",
  live_url: "",
  image_url: "",
  tiktok_url: "",
  linkedin_url: "",
  twitter_url: "",
  launch_date: "",
  in_development: true,
};

export function SuperAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);

    const { data: pData } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects((pData ?? []) as Project[]);

    const { data: mData } = await supabase
      .from("members")
      .select("id, name, projects");

    const combined = [
      ...(mData ?? []).map((m: any) => ({ ...m, table: "members" })),
    ].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    setAllMembers(combined);

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
    setSelectedMemberIds([]);
    setMemberSearch("");
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setIsNew(false);
    setSaved(false);
    setFormErr("");
    setMemberSearch("");

    const currentMemberIds = allMembers
      .filter((m) => {
        const projs = Array.isArray(m.projects) ? m.projects : [];
        return projs.includes(p.title) || projs.includes(p.id);
      })
      .map((m) => m.id);
    setSelectedMemberIds(currentMemberIds);
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

    if (!editing.title?.trim()) {
      setSaving(false);
      return setFormErr("Title is required.");
    }
    if (!editing.category?.trim()) {
      setSaving(false);
      return setFormErr("Category is required.");
    }
    if (!editing.short_description?.trim()) {
      setSaving(false);
      return setFormErr("Short Description is required.");
    }
    if (!editing.description?.trim()) {
      setSaving(false);
      return setFormErr("Long Description is required.");
    }
    if (!editing.launch_date?.trim()) {
      setSaving(false);
      return setFormErr("Launch Date is required.");
    }
    if (!editing.team_size?.trim()) {
      setSaving(false);
      return setFormErr("Team Size is required.");
    }
    if (!editing.tech || editing.tech.length === 0) {
      setSaving(false);
      return setFormErr(
        "At least one technology is required in the Tech Stack.",
      );
    }

    const payload = {
      title: editing.title,
      description: editing.description,
      short_description: editing.short_description,
      tech: editing.tech ?? [],
      status: editing.status,
      category: editing.category,
      github_url: editing.github_url,
      live_url: editing.live_url,
      image_url: editing.image_url,
      tiktok_url: editing.tiktok_url,
      linkedin_url: editing.linkedin_url,
      twitter_url: editing.twitter_url,
      launch_date: editing.launch_date,
      team_size: editing.team_size,
      in_development: editing.in_development ?? true,
    };

    const { data: savedProj, error } = isNew
      ? await (supabase.from("projects") as any)
          .insert(payload)
          .select()
          .single()
      : await (supabase.from("projects") as any)
          .update(payload)
          .eq("id", editing.id!)
          .select()
          .single();

    if (error) {
      setFormErr(error.message);
      setSaving(false);
      return;
    }

    const projectObj = savedProj as Project;
    const projectTitle = projectObj.title;
    const projectId = projectObj.id;

    try {
      for (const member of allMembers) {
        const isSelected = selectedMemberIds.includes(member.id);
        const memberProjects = Array.isArray(member.projects)
          ? member.projects
          : [];

        const hasTitle = memberProjects.includes(projectTitle);
        const hasId = memberProjects.includes(projectId);

        if (isSelected) {
          if (!hasTitle && !hasId) {
            const updated = [...memberProjects, projectTitle];
            await supabase
              .from(member.table)
              .update({ projects: updated })
              .eq("id", member.id);
          }
        } else {
          if (hasTitle || hasId) {
            const updated = memberProjects.filter(
              (p: any) => p !== projectTitle && p !== projectId,
            );
            await supabase
              .from(member.table)
              .update({ projects: updated })
              .eq("id", member.id);
          }
        }
      }
    } catch (dbErr: any) {
      console.warn("Project linked member update error:", dbErr);
    }

    setSaving(false);
    setIsNew(false);
    setSaved(true);
    load();
    setTimeout(close, 1000);
  };

  const confirmDelete = async (id: string) => {
    const { error } = await (supabase.from("projects") as any)
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

  const set = (key: keyof Project) => (val: any) =>
    setEditing((prev) => (prev ? { ...prev, [key]: val } : prev));

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filtered = projects.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8">
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
            Projects
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            {projects.length} total
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-input"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              width: "180px",
            }}
          />
          <button
            onClick={openNew}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              background: "#A3D045",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Add Project
          </button>
        </div>
      </div>

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
                {["Project", "Category", "Status", "Tech", "Actions"].map(
                  (h) => (
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "rgba(255,255,255,0.02)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "transparent")
                  }
                >
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
                          padding: p.image_url ? "0" : "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: p.image_url
                            ? "transparent"
                            : "rgba(255,255,255,0.02)",
                        }}
                      >
                        {p.image_url ? (
                          <img
                            src={p.image_url}
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
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: "18px",
                              fontWeight: 700,
                            }}
                          >
                            {p.title ? p.title.charAt(0).toUpperCase() : "P"}
                          </span>
                        )}
                      </div>
                      <span style={{ color: "inherit", fontWeight: 600 }}>
                        {p.title ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#94a3b8" }}>
                    {p.category ?? "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background:
                          p.status === "Completed"
                            ? "rgba(163,208,69,0.15)"
                            : "rgba(251,191,36,0.15)",
                        color: p.status === "Completed" ? "#A3D045" : "#fbbf24",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>
                    {(p.tech ?? []).slice(0, 3).join(", ")}
                    {(p.tech ?? []).length > 3 ? "…" : ""}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "transparent",
                          color: "#94a3b8",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(p.id)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(239,68,68,0.3)",
                          background: "transparent",
                          color: "#f87171",
                          fontSize: "12px",
                          cursor: "pointer",
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
          {filtered.length === 0 && (
            <p
              style={{ color: "#475569", textAlign: "center", padding: "32px" }}
            >
              No projects found.
            </p>
          )}
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 lg:left-[260px] z-[9999] flex items-center justify-center p-4"
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
                Delete project?
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
          className="fixed inset-0 lg:left-[260px] z-[9000] flex items-center justify-center p-4 pt-[80px] lg:pt-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="min-card p-6 sm:p-8"
            style={{
              width: "100%",
              maxWidth: "560px",
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
                {isNew ? "Add Project" : "Edit Project"}
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
            <form onSubmit={handleSave}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <AvatarUploader
                  currentUrl={editing.image_url ?? null}
                  onUploaded={(url: string | null) =>
                    setEditing((prev) =>
                      prev ? { ...prev, image_url: url } : prev,
                    )
                  }
                  bucketName="projects"
                />
              </div>

              <AdminInput
                label="Title"
                value={editing.title ?? ""}
                onChange={set("title")}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Category"
                  value={editing.category ?? ""}
                  onChange={set("category")}
                  placeholder="e.g. Web, Mobile, AI"
                  required
                />
                <AdminInput
                  label="Team Size"
                  value={editing.team_size ?? ""}
                  onChange={set("team_size")}
                  placeholder="e.g. 5 or Nil"
                  required
                />
              </div>
              <AdminInput
                label="Short Description"
                value={editing.short_description ?? ""}
                onChange={set("short_description")}
                placeholder="e.g. Discover events and hangout spots around you"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Launch Date"
                  value={editing.launch_date ?? ""}
                  onChange={set("launch_date")}
                  placeholder="e.g. May 15, 2026"
                  required
                />
                <AdminInput
                  label="Live URL (Website)"
                  value={editing.live_url ?? ""}
                  onChange={set("live_url")}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="GitHub URL"
                  value={editing.github_url ?? ""}
                  onChange={set("github_url")}
                />
                <AdminInput
                  label="LinkedIn URL"
                  value={editing.linkedin_url ?? ""}
                  onChange={set("linkedin_url")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Twitter/X URL"
                  value={editing.twitter_url ?? ""}
                  onChange={set("twitter_url")}
                />
                <AdminInput
                  label="TikTok URL"
                  value={editing.tiktok_url ?? ""}
                  onChange={set("tiktok_url")}
                />
              </div>
              <AdminTextarea
                label="Long Description"
                value={editing.description ?? ""}
                onChange={set("description")}
                rows={4}
                required
              />
              <TagEditor
                label="Tech Stack"
                tags={editing.tech ?? []}
                onChange={set("tech")}
                placeholder="e.g. React, Node.js"
                required
              />

              <div style={{ marginBottom: "24px" }}>
                <label className="admin-label">
                  Project Builders / Team Members{" "}
                  <span
                    style={{
                      color: "#ef4444",
                      marginLeft: "3px",
                      fontWeight: "normal",
                      fontSize: "12px",
                      textTransform: "none",
                    }}
                  >
                    (Shows Members Only)
                  </span>
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {allMembers
                    .filter((m) => selectedMemberIds.includes(m.id))
                    .map((m) => (
                      <div
                        key={m.id}
                        className="min-input"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        {m.name}
                        <button
                          type="button"
                          onClick={() => toggleMember(m.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "0 2px",
                            lineHeight: 1,
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
                <input
                  type="text"
                  placeholder="Search members to add..."
                  className="min-input"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    marginBottom: "8px",
                    boxSizing: "border-box",
                  }}
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
                {memberSearch.length > 0 && (
                  <div
                    className="min-input"
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      padding: "8px",
                      borderRadius: "8px",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {allMembers
                      .filter(
                        (m) =>
                          m.name
                            .toLowerCase()
                            .includes(memberSearch.toLowerCase()) &&
                          !selectedMemberIds.includes(m.id),
                      )
                      .map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            toggleMember(m.id);
                            setMemberSearch("");
                          }}
                          className="min-button"
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                            display: "block",
                            width: "100%",
                            boxSizing: "border-box",
                            border: "none",
                          }}
                        >
                          {m.name}
                        </button>
                      ))}
                    {allMembers.filter(
                      (m) =>
                        m.name
                          .toLowerCase()
                          .includes(memberSearch.toLowerCase()) &&
                        !selectedMemberIds.includes(m.id),
                    ).length === 0 && (
                      <div
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          color: "#94a3b8",
                        }}
                      >
                        No members found matching "{memberSearch}".
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="admin-label">Status</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status")(s)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        border: "1px solid",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        borderColor:
                          editing.status === s
                            ? "#A3D045"
                            : "rgba(255,255,255,0.1)",
                        background:
                          editing.status === s
                            ? "rgba(163,208,69,0.12)"
                            : "transparent",
                        color: editing.status === s ? "#A3D045" : "#64748b",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <AdminToggle
                label="In Development"
                description="Shows 'In Development' badge on project card"
                checked={editing.in_development ?? true}
                onChange={set("in_development")}
              />
              <SaveBar saving={saving} saved={saved} error={formErr} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
