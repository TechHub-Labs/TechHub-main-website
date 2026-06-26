/**
 * AdminDashboard.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../core/supabase/client";
import { useAuth } from "../../../shared/hooks/useAuth";

interface Stats {
  members: number;
  executives: number;
  projects: number;
}

const StatBox = ({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number | string;
  icon: string;
  color: string;
}) => (
  <div
    className="min-card"
    style={{
      padding: "24px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      animation: "adminFadeIn 0.5s",
    }}
  >
    <div
      className="min-card"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          color: "#94a3b8",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginTop: "4px",
          color: "inherit",
        }}
      >
        {count}
      </div>
    </div>
  </div>
);

function QuickLink({
  to,
  label,
  description,
  icon,
  color,
}: {
  to: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="min-button"
      style={{
        padding: "20px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        animation: "adminFadeIn 0.8s",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontSize: "24px" }}>{icon}</div>
        <div style={{ fontWeight: 700, fontSize: "15px", color }}>{label}</div>
      </div>
      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {description}
      </div>
    </Link>
  );
}

export function AdminDashboard() {
  const { role, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    members: 0,
    executives: 0,
    projects: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [{ count: m }, { count: e }, { count: p }] = await Promise.all([
        (supabase.from("members") as any).select("*", {
          count: "exact",
          head: true,
        }),
        (supabase.from("executives") as any).select("*", {
          count: "exact",
          head: true,
        }),
        (supabase.from("projects") as any).select("*", {
          count: "exact",
          head: true,
        }),
      ]);
      setStats({ members: m ?? 0, executives: e ?? 0, projects: p ?? 0 });
    };
    load();
  }, []);

  const roleGreeting: Record<string, string> = {
    member:
      "Update your member profile below. Once your admin marks it visible, it'll appear on the Members page.",
    executive:
      "Update your executive profile below. Once marked visible, it'll appear on the Executive Council page.",
    super_admin:
      "Full control: manage members, executives, and projects from the sidebar.",
  };

  return (
    <div
      style={{ maxWidth: "1000px" }}
      className="admin-fade-in p-5 md:p-10"
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome back 👋
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>
          {user?.email} <span style={{ opacity: 0.5 }}>·</span>{" "}
          {role ? roleGreeting[role] : "Determining your access level…"}
        </p>
      </div>

      {role === "super_admin" && (
        <>
          <h2
            style={{
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "16px",
            }}
          >
            Overview
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <StatBox
              title="Total Members"
              count={stats.members}
              icon="👥"
              color="#38bdf8"
            />
            <StatBox
              title="Executives"
              count={stats.executives}
              icon="🏛"
              color="#a78bfa"
            />
            <StatBox
              title="Projects"
              count={stats.projects}
              icon="🚀"
              color="#A3D045"
            />
          </div>
        </>
      )}

      <h2
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "16px",
        }}
      >
        Resources
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {role === "member" && (
          <QuickLink
            to="/admin/profile"
            label="Add your profile"
            description="Update your photo, bio, skills and socials"
            icon="👤"
            color="#38bdf8"
          />
        )}
        {role === "executive" && (
          <QuickLink
            to="/admin/exec-profile"
            label="Add your profile"
            description="Update your photo, role and quote"
            icon="👤"
            color="#a78bfa"
          />
        )}
        {role === "super_admin" && (
          <>
            <QuickLink
              to="/admin/members"
              label="Manage Members"
              description="Add, edit or remove member profiles"
              icon="👥"
              color="#38bdf8"
            />
            <QuickLink
              to="/admin/executives"
              label="Manage Executives"
              description="Add, edit or remove executive profiles"
              icon="🏛"
              color="#a78bfa"
            />
            <QuickLink
              to="/admin/projects"
              label="Manage Projects"
              description="Add, edit or remove projects"
              icon="🚀"
              color="#A3D045"
            />
            <QuickLink
              to="/"
              label="Live Website"
              description="Exit dashboard and view the Babcock TechHub public site"
              icon="↗"
              color="#f59e0b"
            />
          </>
        )}
      </div>
    </div>
  );
}
