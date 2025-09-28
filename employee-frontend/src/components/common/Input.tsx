import React from "react";
// --- TYPE DEFINITIONS ---
// Defines the properties for the reusable Input component
interface InputProps {
  id: string;
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Defines the properties for the reusable Button component

// --- REUSABLE COMPONENTS ---

/**
 * A reusable, styled input field component with a label.
 */
const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-black-700 mb-2"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-input w-full rounded-lg border border-black  bg-white/50  text-gray-900 py-3 px-4 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors duration-300"
    />
  </div>
);

export default Input;
