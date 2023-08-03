import React from "react";

export default function Divider() {
  return (
    <div
      style={{
        height: "100%",
        width: "1px",
        backgroundColor: "var(--gray)",
        marginLeft: "20px",
        marginRight: "20px",
        opacity: 0.1,
      }}
    ></div>
  );
}
