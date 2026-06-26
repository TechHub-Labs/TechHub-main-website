/**
 * AdminLayout.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useTheme } from "../../landing/domain/useTheme";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { supabase } from "../../../core/supabase/client";

const NAV_ITEMS = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: "▣",
    roles: ["member", "executive", "super_admin"],
  },
  {
    path: "/admin/profile",
    label: "Create Profile",
    icon: "👤",
    roles: ["member"],
  },
  {
    path: "/admin/exec-profile",
    label: "Create Profile",
    icon: "👤",
    roles: ["executive"],
  },
  {
    path: "/admin/request-edit",
    label: "Request Edit",
    icon: "📝",
    roles: ["member", "executive"],
  },
  {
    path: "/admin/messages",
    label: "Messages",
    icon: "📬",
    roles: ["super_admin"],
  },
  {
    path: "/admin/members",
    label: "Members",
    icon: "👥",
    roles: ["super_admin"],
  },
  {
    path: "/admin/executives",
    label: "Executives",
    icon: "🏛",
    roles: ["super_admin"],
  },
  {
    path: "/admin/projects",
    label: "Projects",
    icon: "🚀",
    roles: ["super_admin"],
  },
] as const;

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  executive: "Executive",
  super_admin: "Super Admin",
};
const ROLE_COLORS: Record<string, string> = {
  member: "#38bdf8",
  executive: "#a78bfa",
  super_admin: "#A3D045",
};

import { ToastContainer } from "../../../shared/components/Toast";

export function AdminLayout() {
  const { role, logout, user } = useAuth();
  const { dark, setDark, colors } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (role !== "super_admin") return;

    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("admin_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      setUnreadMessages(count ?? 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel("admin_messages_sidebar")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_messages" },
        () => {
          fetchUnreadCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  const visibleNav = NAV_ITEMS.filter(
    (item) => role !== null && (item.roles as readonly string[]).includes(role),
  );

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link to="/" style={{ display: "block", marginBottom: "16px" }}>
          <img
            src="/images/Logo.png"
            alt="TechHub"
            style={{ height: "40px" }}
          />
        </Link>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: dark
              ? "var(--min-bg-dark)"
              : role === "super_admin"
                ? "rgba(163,208,69,0.18)"
                : role === "executive"
                  ? "rgba(167,139,250,0.18)"
                  : "rgba(56,189,248,0.18)",
            borderRadius: "8px",
            padding: "6px 14px",
            border: dark ? "1px solid var(--min-border)" : "none",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: ROLE_COLORS[role ?? "member"],
              boxShadow: `0 0 8px ${ROLE_COLORS[role ?? "member"]}`,
            }}
          />
          <span
            style={{
              color: dark
                ? ROLE_COLORS[role ?? "member"]
                : role === "super_admin"
                  ? "#4d7c0f"
                  : role === "executive"
                    ? "#6d28d9"
                    : "#0284c7",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {ROLE_LABELS[role ?? "member"]}
          </span>
        </div>
        <p
          style={{
            color: "#64748b",
            fontSize: "11px",
            marginTop: "6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user?.email}
        </p>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px", overflow: "hidden" }}>
        {visibleNav.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                paddingLeft: isActive ? "13px" : "16px",
                borderLeft: isActive
                  ? dark
                    ? "3px solid #A3D045"
                    : "3px solid #4f46e5"
                  : "3px solid transparent",
                borderRadius: "8px",
                marginBottom: "4px",
                color: isActive
                  ? dark
                    ? "#A3D045"
                    : "#4f46e5"
                  : colors.textMuted,
                background: isActive
                  ? dark
                    ? "rgba(163,208,69,0.1)"
                    : "rgba(79,70,229,0.08)"
                  : "transparent",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = dark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)";
                  (e.currentTarget as HTMLAnchorElement).style.color = dark
                    ? "#f1f5f9"
                    : "#111827";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    colors.textMuted;
                }
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.path === "/admin/messages" && unreadMessages > 0 && (
                <span
                  style={{
                    background: "#fbbf24",
                    color: "#0f172a",
                    fontSize: "11px",
                    fontWeight: 800,
                    borderRadius: "999px",
                    padding: "2px 8px",
                    boxShadow: "0 0 8px rgba(251,191,36,0.35)",
                    animation: "adminFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingBottom: "32px",
        }}
      >
        <button
          onClick={() => setDark(!dark)}
          className="min-button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--min-border)",
            background: "transparent",
            color: dark ? "#f1f5f9" : "#111827",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--min-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          <span>{dark ? "☀️" : "🌙"}</span> {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="min-button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--min-border)",
            background: "transparent",
            color: "#ef4444",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(239,68,68,0.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        fontFamily: "'Inter', 'Geist', sans-serif",
        background: "transparent",
        transition: "background 0.2s ease",
        position: "relative",
      }}
      className="admin-layout-root"
    >
      <ToastContainer />

      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <WebsiteBackground isDark={dark} bgColor={colors.bg} opacity={0.6} />
      </div>

      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          background: dark
            ? "var(--min-surface-dark)"
            : "var(--min-surface-light)",
          borderRight: "1px solid var(--min-border)",
          height: "100dvh",
          display: "none",
          zIndex: 10,
        }}
        className="lg:!block"
      >
        <SidebarContent />
      </aside>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          zIndex: 100,
          background: colors.bg,

          borderBottom: "1px solid var(--min-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
        className="lg:!hidden"
      >
        <img
          src="/images/Logo.png"
          alt="TechHub"
          style={{ height: "32px", filter: !dark ? "invert(1)" : "none" }}
        />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: colors.text,
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 101,
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "260px",
              height: "100dvh",
              background: dark
                ? "var(--min-surface-dark)"
                : "var(--min-surface-light)",
              borderRight: "1px solid var(--min-border)",
              zIndex: 102,
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "40px",
        }}
        className="lg:!pt-0 pt-20"
      >
        <Outlet />
      </main>

      <style>{`
        :root {
          --min-bg-light: ${colors.bg};
          --min-surface-light: rgba(255, 255, 255, 0.7);

          --min-bg-dark: ${colors.bg};
          --min-surface-dark: ${colors.nav};
        }

        ${
          !dark
            ? `
          :root {
            --min-border: rgba(79,70,229,0.12);
            --min-hover: rgba(79,70,229,0.04);
            --min-surface-light: #f3f6fc;
          }
          .admin-layout-root { color: #0d1340 !important; }
          .admin-layout-root h1, .admin-layout-root h2 { color: #0d1340 !important; }
          .admin-layout-root p { color: #4a5180 !important; }
          .admin-layout-root label, .admin-label { color: #4a5180 !important; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
          .admin-layout-root img[src="/images/Logo.png"] { filter: none !important; }
          .min-card { background: #ffffff !important; border: 1px solid rgba(79, 70, 229, 0.12); border-radius: 12px; box-shadow: 0 8px 32px rgba(79, 70, 229, 0.08); }
          .min-button { background: #ffffff !important; border: 1px solid rgba(79, 70, 229, 0.2); border-radius: 8px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.05); transition: all 0.15s; color: #4f46e5 !important; font-weight: 600; }
          .min-button:active { background: var(--min-hover) !important; transform: scale(0.98); }
          .min-button:hover { background: rgba(79, 70, 229, 0.04) !important; border-color: rgba(79, 70, 229, 0.4); }
          .min-input { background: #ffffff !important; color: #0d1340 !important; border: 1px solid rgba(79, 70, 229, 0.35) !important; border-radius: 12px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.05); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .min-input:hover { border-color: rgba(79, 70, 229, 0.6) !important; }
          .min-input:focus { border-color: #4f46e5 !important; outline: none; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2) !important; }
          .min-input::placeholder { color: #64748b !important; opacity: 1 !important; }
        `
            : `
          :root {
            --min-border: rgba(255,255,255,0.1);
            --min-hover: rgba(255,255,255,0.05);
            --min-surface-dark: ${colors.nav};
          }
          .admin-layout-root { color: #ffffff !important; }
          .min-card { background: var(--min-surface-dark); backdrop-filter: blur(16px); border: 1px solid var(--min-border); border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
          .min-button { background: rgba(255,255,255,0.05); border: 1px solid var(--min-border); border-radius: 6px; box-shadow: none; transition: all 0.15s; }
          .min-button:active { background: var(--min-hover); transform: scale(0.98); }
          .min-button:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); box-shadow: 0 0 12px rgba(255,255,255,0.05); }
          .min-input { background: rgba(13, 19, 64, 0.4) !important; color: #ffffff !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
          .min-input:hover { border-color: rgba(163, 208, 69, 0.5) !important; }
          .min-input:focus { border-color: #A3D045 !important; outline: none; box-shadow: 0 0 0 3px rgba(163, 208, 69, 0.25) !important; }
          .min-input::placeholder { color: #94a3b8 !important; opacity: 0.7 !important; }
          .admin-label { color: #94a3b8; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
        `
        }
        /* Make scrollbars look nice in admin panel */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(163,208,69,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(163,208,69,0.7); }
      `}</style>
    </div>
  );
}
