import React from "react";
import { motion } from "framer-motion";

/**
 * Reusable input with optional icon and helper text
 */
export default function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  helper,
  autoComplete,
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="text-sm text-gray-300">{label}</label>}
      <motion.div whileFocus={{ scale: 1.00 }} className="mt-1 relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="
            w-full p-3 pl-4 rounded-lg
            bg-black/30 border border-white/6 text-white
            focus:outline-none focus:ring-2 focus:ring-cyan-400/40
            transition
          "
          {...rest}
        />
        {icon && <div className="absolute right-3 top-3 text-gray-400">{icon}</div>}
      </motion.div>
      {helper && <div className="text-xs text-gray-400 mt-2">{helper}</div>}
    </div>
  );
}
