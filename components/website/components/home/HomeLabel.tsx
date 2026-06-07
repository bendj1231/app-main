export function HomeLabel() {
  return (
    <div className="md:hidden absolute top-16 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 px-4">
      <div className="rounded-3xl border border-white/25 bg-slate-950/95 px-4 py-3 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <h3
          className="text-lg font-light text-white"
          style={{
            fontFamily: 'Georgia, "Helvetica Neue", Arial, sans-serif',
            opacity: 1
          }}
        >
          Home
        </h3>
      </div>
    </div>
  );
}
