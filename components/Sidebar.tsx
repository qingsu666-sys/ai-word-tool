"use client";

import { BookOpen, Headphones } from "lucide-react";

const navItems = [
  { id: "vocab", label: "词汇变形", icon: BookOpen },
];

interface SidebarProps {
  activeItem: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ activeItem, onSelect }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "#fff",
        borderRight: "1px solid #E8EDF5",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        boxShadow: "2px 0 12px rgba(0,82,255,0.04)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #E8EDF5",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #0052FF 0%, #3B7BFF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Headphones size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.2 }}>
            AI听力助手
          </div>
          <div style={{ fontSize: 11, color: "#8A96B0", marginTop: 2 }}>词汇工具箱</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#A0AABE", padding: "6px 10px 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          功能列表
        </div>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "#0052FF" : "#4A5568",
                background: active ? "#EBF1FF" : "transparent",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#F4F6FB";
                  e.currentTarget.style.color = "#1A1A2E";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4A5568";
                }
              }}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.5 : 2}
                color={active ? "#0052FF" : "currentColor"}
              />
              {label}
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#0052FF",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #E8EDF5" }}>
        <div style={{ fontSize: 11, color: "#B0BAD0", textAlign: "center" }}>
          Powered by DeepSeek
        </div>
      </div>
    </aside>
  );
}
