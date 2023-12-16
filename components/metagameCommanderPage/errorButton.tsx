"use client";

export default function ErrorButton({ className }: { className?: string }) {
  return (
    <button
      className={className}
      onClick={() => location.reload()}
    >
      Try again
    </button>
  );
};
