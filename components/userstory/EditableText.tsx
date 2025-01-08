import React, { useState } from "react";

interface EditableTextProps {
  text: string;
  onTextChange: (newText: string) => void;
  className?: string;
}

export default function EditableText({ text, onTextChange, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleSave = () => {
    onTextChange(value);
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === "Enter" && handleSave()}
      className={`border rounded p-1 ${className}`}
      autoFocus
    />
  ) : (
    <span onClick={() => setIsEditing(true)} className={`cursor-pointer ${className} `}>
      {text}
    </span>
  );
}