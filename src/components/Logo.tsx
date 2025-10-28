import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-olive/20 ${className}`} aria-label="Receitas do que há">
      <span aria-hidden>🍲</span>
      <span className="sr-only">Receitas do que há</span>
    </div>
  );
}
