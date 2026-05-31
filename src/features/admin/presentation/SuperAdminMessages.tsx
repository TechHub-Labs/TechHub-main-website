/**
 * SuperAdminMessages.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../core/supabase/client";
import { useTheme } from "../../landing/domain/useTheme";

interface AdminMessage {
  id: string;
  sender_name: string;
  role: string;
  request_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

type FilterTab = "all" | "unread" | "member" | "executive";

const ROLE_COLOR: Record<string, string> = {
  member: "#38bdf8",
  executive: "#a78bfa",
};

const TYPE_COLOR: Record<string, string> = {
  "Profile Update": "#fbbf24",
  "Project Link Update": "#34d399",
  "General Question": "#f472b6",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function SuperAdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { dark } = useTheme();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data ?? []) as AdminMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
    );
    await supabase
      .from("admin_messages")
      .update({ is_read: true })
      .eq("id", id);
  };

  const markUnread = async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: false } : m)),
    );
    await supabase
      .from("admin_messages")
      .update({ is_read: false })
      .eq("id", id);
  };

  const markAllRead = async () => {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (!unreadIds.length) return;
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    await Promise.all(
      unreadIds.map((id) =>
        supabase.from("admin_messages").update({ is_read: true }).eq("id", id),
      ),
    );
  };

  const deleteMsg = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("admin_messages").delete().eq("id", id);
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "member") return m.role === "member";
    if (filter === "executive") return m.role === "executive";
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: messages.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "member",
      label: "Members",
      count: messages.filter((m) => m.role === "member").length,
    },
    {
      key: "executive",
      label: "Executives",
      count: messages.filter((m) => m.role === "executive").length,
    },
  ];

  const textColor = dark ? "#ffffff" : "#0d1340";
  const textMuted = dark ? "#94a3b8" : "#4a5180";
  const subtextColor = dark ? "#475569" : "#64748b";
  const accent = dark ? "#A3D045" : "#4f46e5";
  const borderCol = dark ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.12)";

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              color: textColor,
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            📬 Messages Inbox
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#fbbf24",
                  color: "#0f172a",
                  fontSize: "12px",
                  fontWeight: 800,
                  borderRadius: "999px",
                  padding: "2px 10px",
                }}
              >
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: textMuted, fontSize: "13px" }}>
            Edit requests and messages from members & executives
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="min-button"
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              color: accent,
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ✓ Mark all read
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const isSelected = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="min-button"
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                background: isSelected
                  ? dark
                    ? "rgba(163,208,69,0.15)"
                    : "rgba(79,70,229,0.08)"
                  : "transparent",
                color: isSelected ? accent : textMuted,
                boxShadow: isSelected
                  ? `inset 0 0 0 1px ${dark ? "rgba(163,208,69,0.4)" : "rgba(79,70,229,0.2)"}`
                  : "none",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: isSelected
                      ? dark
                        ? "rgba(163,208,69,0.25)"
                        : "rgba(79,70,229,0.15)"
                      : dark
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(0,0,0,0.04)",
                    borderRadius: "999px",
                    padding: "1px 7px",
                    color: isSelected ? accent : dark ? "#94a3b8" : "#4a5180",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-card"
              style={{
                padding: "24px",
                opacity: 0.4,
                height: "80px",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 0",
            color: subtextColor,
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontSize: "15px", fontWeight: 600 }}>No messages here</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>
            {filter === "unread"
              ? "All caught up!"
              : "Nothing to show for this filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <div
                key={m.id}
                className="min-card"
                style={{
                  padding: "0",
                  borderRadius: "12px",
                  borderLeft: !m.is_read
                    ? "3px solid #fbbf24"
                    : "3px solid transparent",
                  opacity: m.is_read ? 0.75 : 1,
                  transition: "all 0.2s",
                }}
              >
                <div
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    borderRadius: isOpen ? "12px 12px 0 0" : "12px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: m.is_read ? "transparent" : "#fbbf24",
                      boxShadow: m.is_read ? "none" : "0 0 6px #fbbf24",
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "14px",
                          color: textColor,
                        }}
                      >
                        {m.sender_name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: `${ROLE_COLOR[m.role] ?? "#94a3b8"}20`,
                          color: ROLE_COLOR[m.role] ?? "#94a3b8",
                          textTransform: "capitalize",
                        }}
                      >
                        {m.role}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: `${TYPE_COLOR[m.request_type] ?? "#94a3b8"}20`,
                          color: TYPE_COLOR[m.request_type] ?? "#94a3b8",
                        }}
                      >
                        {m.request_type}
                      </span>
                    </div>
                    <p
                      style={{
                        color: textMuted,
                        fontSize: "12px",
                        marginTop: "3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isOpen ? "normal" : "nowrap",
                        maxWidth: "480px",
                      }}
                    >
                      {m.message}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        color: subtextColor,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {timeAgo(m.created_at)}
                    </span>
                    <span
                      style={{
                        color: subtextColor,
                        fontSize: "12px",
                        transition: "transform 0.2s",
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      borderTop: `1px solid ${borderCol}`,
                    }}
                  >
                    <p
                      style={{
                        color: textColor,
                        fontSize: "14px",
                        lineHeight: 1.8,
                        paddingTop: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      {m.message}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: subtextColor,
                          fontSize: "11px",
                          flex: 1,
                        }}
                      >
                        Received: {new Date(m.created_at).toLocaleString()}
                      </span>
                      {m.is_read ? (
                        <button
                          onClick={() => markUnread(m.id)}
                          className="min-button"
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            color: textMuted,
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Mark Unread
                        </button>
                      ) : (
                        <button
                          onClick={() => markRead(m.id)}
                          className="min-button"
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            color: accent,
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteMsg(m.id)}
                        className="min-button"
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          background: "rgba(239,68,68,0.08)",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
