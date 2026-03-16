"use client";

import { ReactNode } from "react";

export function SharePreview({ visible, children }: { visible: boolean; children: ReactNode }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
