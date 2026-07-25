import React from "react";
import Link from "next/link";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 hover:opacity-95 transition-opacity ${className}`}>
      <img
        src="/images/novamarket-logo.png"
        alt="NovaMarket Logo"
        className="h-7 w-auto object-contain shrink-0"
      />
    </Link>
  );
};
