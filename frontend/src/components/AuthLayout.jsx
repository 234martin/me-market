import React from "react";
import CyberBackground from "./CyberBackground";
import { motion } from "framer-motion";

/**
 * AuthLayout
 * Wrap auth pages, center the card, add subtle container chrome
 */
export default function AuthLayout({ children, caption }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060a] text-white relative overflow-hidden">
      <CyberBackground />

      <div className="w-full max-w-5xl px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left: branding + caption */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col items-start w-1/2 pl-6"
          >
            <div className="mb-6">
              <div className="text-4xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400">
                  ME-Broker
                </span>
              </div>
              <div className="mt-3 text-gray-300 max-w-md">
                A cyber-native marketplace UI — secure, futuristic and performant.
              </div>
            </div>

            {caption && (
              <div className="mt-6 text-sm text-gray-400">{caption}</div>
            )}
          </motion.div>

          {/* Right: auth card container */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="relative w-full max-w-md"
            >
              {/* Hologram frame */}
              <div className="absolute -inset-0.5 rounded-2xl blur-xl opacity-60 bg-clip-padding"
                   style={{ background:
                     "linear-gradient(90deg, rgba(0,255,255,0.08), rgba(155,89,255,0.06), rgba(0,255,255,0.08))" }} />
              <div className="relative rounded-2xl bg-black/60 border border-white/6 backdrop-blur-md p-8 shadow-2xl">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
