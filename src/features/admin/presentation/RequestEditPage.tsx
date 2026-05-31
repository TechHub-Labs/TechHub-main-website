/**
 * RequestEditPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "../../../core/supabase/client";
import { useAuth } from "../../../shared/hooks/useAuth";
import { AdminTextarea } from "./AdminFormComponents";
import { useTheme } from "../../landing/domain/useTheme";
import { toast } from "../../../shared/components/Toast";

function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  dark,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder: string;
  required?: boolean;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeTextVal = dark ? "#ffffff" : "#0d1340";
  const placeholderTextVal = dark ? "#94a3b8" : "#4a5180";
  const openBorderVal = dark ? "#A3D045" : "#4f46e5";

  const borderVal = dark
    ? hovered
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(255,255,255,0.15)"
    : hovered
      ? "1px solid rgba(79,70,229,0.5)"
      : "1px solid rgba(79,70,229,0.28)";

  const openShadowVal = dark
    ? "0 0 12px rgba(163,208,69,0.2)"
    : "0 0 0 3px rgba(79, 70, 229, 0.18)";
  const bgVal = dark
    ? open
      ? "rgba(13,19,64,0.4)"
      : "rgba(13,19,64,0.2)"
    : "#ffffff";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          boxSizing: "border-box",
          background: bgVal,
          border: open ? `1px solid ${openBorderVal}` : borderVal,
          color: value ? activeTextVal : placeholderTextVal,
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: open ? openShadowVal : "none",
        }}
      >
        <span>{value || placeholder}</span>
        <span
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            color: value ? activeTextVal : placeholderTextVal,
            fontSize: "11px",
            opacity: 0.8,
          }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div
          className="min-card"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            maxHeight: "240px",
            overflowY: "auto",
            zIndex: 50,
            background: dark ? "#0d1340" : "#ffffff",
            borderColor: openBorderVal,
            boxShadow: dark
              ? "0 12px 32px rgba(0,0,0,0.4)"
              : "0 12px 32px rgba(79,70,229,0.08)",
            padding: "8px 0",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            border: `1px solid ${openBorderVal}`,
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: dark ? "#f1f5f9" : "#0d1340",
                fontSize: "14px",
                background:
                  value === opt
                    ? dark
                      ? "rgba(163,208,69,0.1)"
                      : "rgba(79,70,229,0.08)"
                    : "transparent",
                borderLeft:
                  value === opt
                    ? `4px solid ${openBorderVal}`
                    : "4px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = dark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(79,70,229,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  value === opt
                    ? dark
                      ? "rgba(163,208,69,0.1)"
                      : "rgba(79,70,229,0.08)"
                    : "transparent")
              }
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RequestEditPage() {
  const { user, role } = useAuth();
  const { dark } = useTheme();
  const [names, setNames] = useState<string[]>([]);
  const [loadingNames, setLoadingNames] = useState(true);

  const [senderName, setSenderName] = useState("");
  const [requestType, setRequestType] = useState("Profile Update");
  const [message, setMessage] = useState("");

  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const fetchNames = async () => {
      setLoadingNames(true);
      if (role === "member") {
        const { data } = await supabase
          .from("members")
          .select("name")
          .order("name");
        setNames(data?.map((d) => d.name).filter(Boolean) || []);
      } else if (role === "executive") {
        const { data } = await supabase
          .from("executives")
          .select("name")
          .order("name");
        setNames(data?.map((d) => d.name).filter(Boolean) || []);
      }
      setLoadingNames(false);
    };
    if (role) fetchNames();
  }, [role]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!senderName) {
      toast.warning("Please select your name.");
      setMessageError("Please select your name.");
      return;
    }

    setSendingMessage(true);
    setMessageSent(false);
    setMessageError("");

    const { error } = await supabase.from("admin_messages").insert({
      user_id: user.id,
      sender_name: senderName,
      role: role ?? "unknown",
      request_type: requestType,
      message,
    });

    if (!error) {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
          {
            to_name: "Super Admin",
            from_name: senderName,
            name: senderName, // matches {{name}} in user's From Name and body
            from_role: role ?? "unknown",
            request_type: requestType,
            title: requestType, // matches {{title}} in user's Subject
            message: message,
            reply_to: user.email ?? "",
            email: user.email ?? "", // matches {{email}} in user's Reply To
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
        );
      } catch (emailErr) {
        console.warn("Email notification failed:", emailErr);
      }
    }

    setSendingMessage(false);
    if (error) {
      toast.error(`Failed to submit request: ${error.message}`);
      setMessageError(error.message);
    } else {
      toast.success("Edit request submitted successfully!");
      setMessageSent(true);
      setSenderName("");
      setMessage("");
      setTimeout(() => setMessageSent(false), 8000);
    }
  };

  if (!user) return null;

  return (
    <div
      style={{ padding: "32px", maxWidth: "680px" }}
      className="admin-fade-in"
    >
      <div
        className="min-card"
        style={{
          padding: "32px",
          animation: "adminFadeIn 0.8s",
          background: dark
            ? "var(--min-surface-dark)"
            : "rgba(255, 255, 255, 0.88)",
          border: dark
            ? "1px solid var(--min-border)"
            : "1px solid rgba(79, 70, 229, 0.12)",
          borderRadius: "16px",
          boxShadow: dark
            ? "0 4px 24px rgba(0,0,0,0.2)"
            : "0 8px 32px rgba(79, 70, 229, 0.03)",
          backdropFilter: "blur(16px)",
        }}
      >
        <h1
          style={{
            color: dark ? "#f1f5f9" : "#0d1340",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Request an Edit
        </h1>
        <p
          style={{
            color: dark ? "#94a3b8" : "#4a5180",
            fontSize: "14px",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Select your name and the type of request. The Super Admin will review
          your message and make the changes.
        </p>

        <form
          onSubmit={handleSendMessage}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Your Name
              <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
            </label>
            <CustomSelect
              value={senderName}
              options={names}
              onChange={setSenderName}
              placeholder={
                loadingNames ? "Loading names..." : "Select your name"
              }
              required
              dark={dark}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Request Type
              <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
            </label>
            <CustomSelect
              value={requestType}
              options={[
                "Profile Update",
                "Project Link Update",
                "General Question",
              ]}
              onChange={setRequestType}
              placeholder="Select Request Type"
              required
              dark={dark}
            />
          </div>

          <AdminTextarea
            label="Message"
            value={message}
            onChange={setMessage}
            required
            placeholder="e.g. Please update my quote..."
            rows={4}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "12px",
            }}
          >
            <button
              type="submit"
              disabled={sendingMessage || messageSent}
              className={sendingMessage || messageSent ? "" : "min-button"}
              style={{
                padding: "14px 32px",
                borderRadius: "12px",
                background:
                  sendingMessage || messageSent
                    ? "#334155"
                    : dark
                      ? "#A3D045"
                      : "#4f46e5",
                color:
                  sendingMessage || messageSent
                    ? "#94a3b8"
                    : dark
                      ? "#0f172a"
                      : "#ffffff",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                border: "none",
                cursor:
                  sendingMessage || messageSent ? "not-allowed" : "pointer",
              }}
            >
              {sendingMessage
                ? "Sending…"
                : messageSent
                  ? "Sent"
                  : "Send Request"}
            </button>
            {messageSent && (
              <span
                style={{
                  color: dark ? "#A3D045" : "#4f46e5",
                  fontSize: "14px",
                  fontWeight: 600,
                  animation: "adminFadeIn 0.3s",
                }}
              >
                ✓ Message delivered! We will process it shortly.
              </span>
            )}
            {messageError && (
              <span style={{ color: "#f87171", fontSize: "14px" }}>
                {messageError}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
