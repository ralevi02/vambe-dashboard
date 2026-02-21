export default function Header() {
  return (
    <header className="h-16 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-white tracking-tight">
          vambe<span className="text-[#00e676]">.</span>
        </span>
        <span className="text-[#333]">/</span>
        <span className="text-sm text-[#888] font-medium">
          Sales Dashboard
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-[#555]">
          {new Date().toLocaleDateString("es-CL")}
        </span>
        <div className="w-8 h-8 rounded-full bg-[#00e676] flex items-center justify-center text-black text-xs font-black">
          V
        </div>
      </div>
    </header>
  );
}
