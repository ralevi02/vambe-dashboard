import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = "", title }: CardProps) {
  return (
    <div
      className={`bg-[#111111] rounded-xl border border-[#1f1f1f] p-6 ${className}`}
    >
      {title && (
        <h3 className="text-xs font-bold text-[#555] uppercase tracking-widest mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
