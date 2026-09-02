const motifs = [
  ["M12 78 48 22l39 22v56L49 156 12 134Z", "M48 22v56m0 0 39-22M48 78l-36 22m36-22v78"],
  ["M12 38h76v100H12z", "M12 64h76M36 38v100M64 38v100M12 98h76"],
  ["M10 126 38 48l25 45 27-69", "M8 142h84M18 116h16M57 102h18M68 49h22"],
];

export default function BlogCover({
  index,
  category,
  className = "",
}: {
  index: number;
  category: string;
  className?: string;
}) {
  const motif = motifs[index % motifs.length];

  return (
    <div
      className={`relative isolate overflow-hidden bg-ink-700 ${className}`}
      aria-hidden="true"
    >
      <div className="blueprint-grid absolute inset-0 opacity-35" />
      <div className="bloom -right-20 -top-24 h-64 w-64 opacity-25" />
      <span className="absolute left-5 top-5 font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
        {category}
      </span>
      <span className="absolute bottom-2 right-4 font-display text-[clamp(4.5rem,12vw,8rem)] font-black leading-none tracking-[-0.08em] text-bone/[0.045]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <svg
        viewBox="0 0 100 170"
        className="absolute bottom-[-8%] right-[10%] h-[92%] w-auto text-accent/55"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        <path d={motif[0]} />
        <path d={motif[1]} />
        <circle cx="48" cy="78" r="3" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

