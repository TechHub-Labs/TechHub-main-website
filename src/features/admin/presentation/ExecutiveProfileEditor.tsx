/**
 * ExecutiveProfileEditor.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useState } from "react";
import { supabase } from "../../../core/supabase/client";
import { useAuth } from "../../../shared/hooks/useAuth";
import {
  AdminInput,
  AdminTextarea,
  AvatarUploader,
  SaveBar,
  TagEditor,
} from "./AdminFormComponents";

const CATEGORY_OPTIONS = ["Founding Council", "'27", "'28"];

export function ExecutiveProfileEditor() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [category, setCategory] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const toggleCategory = (cat: string) => setCategory([cat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError("");

    if (!avatarUrl) {
      setSaving(false);
      return setError("Please upload a profile picture.");
    }
    if (category.length === 0) {
      setSaving(false);
      return setError("Please select a category.");
    }
    if (!quote.trim()) {
      setSaving(false);
      return setError("Please provide a quote.");
    }
    if (skills.length === 0) {
      setSaving(false);
      return setError("At least one skill is required.");
    }
    if (!github.trim()) {
      setSaving(false);
      return setError("Please provide a GitHub/Portfolio link.");
    }

    const { error } = await supabase.from("executives").insert({
      user_id: user.id,
      name,
      role_title: roleTitle,
      quote,
      avatar_url: avatarUrl,
      github,
      linkedin,
      twitter,
      skills,
      projects: [],
      category,
      visible: false,
    });

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);

      setName("");
      setRoleTitle("");
      setQuote("");
      setAvatarUrl(null);
      setGithub("");
      setSkills([]);
      setLinkedin("");
      setTwitter("");
      setCategory([]);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: "32px", maxWidth: "560px" }}>
      <h1
        style={{
          color: "#f1f5f9",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "6px",
        }}
      >
        Create Profile
      </h1>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "28px" }}>
        Your profile will appear on the Executive Council page once marked
        visible.
      </p>

      <form onSubmit={handleSubmit}>
        <AvatarUploader
          currentUrl={avatarUrl}
          onUploaded={setAvatarUrl}
          bucketName="executives"
          required
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16px",
          }}
        >
          <AdminInput
            label="Full Name"
            value={name}
            onChange={setName}
            required
            placeholder="Ada Lovelace"
          />
          <AdminInput
            label="Role/Title"
            value={roleTitle}
            onChange={setRoleTitle}
            required
            placeholder="President"
          />
          <AdminInput
            label="GitHub/Portfolio"
            value={github}
            onChange={setGithub}
            required
            placeholder="https://github.com/..."
          />
          <AdminInput
            label="LinkedIn"
            value={linkedin}
            onChange={setLinkedin}
            placeholder="https://linkedin.com/in/..."
          />
          <AdminInput
            label="Twitter/X"
            value={twitter}
            onChange={setTwitter}
            placeholder="https://twitter.com/..."
          />
        </div>

        <AdminTextarea
          label="Quote"
          value={quote}
          onChange={setQuote}
          required
          placeholder="Your vision in one sentence…"
          rows={3}
        />

        <div style={{ marginBottom: "16px" }}>
          <TagEditor
            label="Skills"
            tags={skills}
            onChange={setSkills}
            placeholder="e.g. Leadership, Node.js"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="admin-label">
            Category{" "}
            <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleCategory(opt)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  border: "1px solid",
                  borderColor: category.includes(opt)
                    ? "#a78bfa"
                    : "rgba(255,255,255,0.1)",
                  background: category.includes(opt)
                    ? "rgba(167,139,250,0.12)"
                    : "transparent",
                  color: category.includes(opt) ? "#a78bfa" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "8px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⏳</span>
          <div>
            <div
              style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 600 }}
            >
              Pending admin approval
            </div>
            <div
              style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}
            >
              Submit your profile to notify your admin to publish it.
            </div>
          </div>
        </div>

        <SaveBar saving={saving} saved={saved} error={error} />
      </form>
    </div>
  );
}
