export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-green animate-spin" />
      </div>
      <span className="font-display text-xs uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}
