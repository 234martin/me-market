import React from "react";

/**
 * CyberBackground
 * - full-screen animated grid + subtle noise overlay
 * - use on auth pages only (keeps performance good)
 */
export default function CyberBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      {/* animated gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071028] via-[#0b1020] to-[#0a0520] opacity-95" />

      {/* moving grid */}
      <div className="absolute inset-0 transform-gpu">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.06" />
              <stop offset="50%" stopColor="#9b59ff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.06" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* CSS grid via pseudo-element style in styles.css */}
      <div className="absolute inset-0 grid-layer" />
      <div className="absolute inset-0 noise-layer" />
    </div>
  );
}
