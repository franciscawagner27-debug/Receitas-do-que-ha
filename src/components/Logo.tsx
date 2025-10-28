import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="Receitas do que há"></div>
  );
}
