import React, { useState, useRef, useEffect, useCallback } from "react";

const EditableText = ({ text, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsEditing(false);
        onTextChange(value);
      }
    },
    [onTextChange, value]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      onTextChange(value);
    }
  };

  return isEditing ? (
    <textarea
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      rows="3"
      className="border-b-2 border-blue-500 focus:outline-none rounded-md"
    />
  ) : (
    <span className="w-40" onClick={() => setIsEditing(true)}>
      {text ? text : "Click to edit"}
    </span>
  );
};

export default EditableText;
