"use client";
import React from "react";
import { Input } from "@/components/ui/form/Input"; 

export default function InputForm(props) {
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);

  const isPassword = props.type === "password";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Input
        placeholder={props.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={isPassword ? (show ? "text" : "password") : props.type || "text"}
        style={props.style}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#2563eb",
          }}
          onClick={() => setShow((prev) => !prev)}
        ></button>
      )}
    </div>
  );
}
