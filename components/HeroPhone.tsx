export default function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="absolute -left-10 top-16 h-48 w-48 rounded-full bg-[#f2a23a]/25 blur-3xl" />
      <div className="absolute -right-8 bottom-10 h-56 w-56 rounded-full bg-[#4D7CFE]/15 blur-3xl" />

      <div className="relative rotate-[-2deg] rounded-[3.25rem] border border-black/10 bg-[#15120f] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.28)]">
        <div className="rounded-[2.75rem] bg-[#f7f2e9] p-6">
          <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-black/10" />

          <div className="rounded-[2.2rem] bg-[#15120f] p-5 text-white">
            <p className="text-sm font-bold text-white/45">Today</p>
            <h3 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.055em]">
              Probably not.
            </h3>
            <p className="mt-4 text-base leading-7 text-white/55">
              A latte now may leave caffeine active too close to your 22:30 bedtime.
            </p>

            <div className="mt-6 rounded-[1.75rem] bg-white p-5 text-[#15120f]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">Coffee Clock</p>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#eee3d3]">
                <div className="h-full w-[64%] rounded-full bg-[#f2a23a]" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a8175]">Clear around</p>
                  <p className="text-4xl font-black tracking-[-0.04em]">22:41</p>
                </div>
                <div className="rounded-full bg-[#f7f2e9] px-3 py-2 text-sm font-black">64%</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-xl shadow-black/5">
              <p className="text-xs font-black uppercase tracking-wide text-[#8a8175]">Active</p>
              <p className="mt-1 text-2xl font-black">86 mg</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-xl shadow-black/5">
              <p className="text-xs font-black uppercase tracking-wide text-[#8a8175]">Next</p>
              <p className="mt-1 text-2xl font-black">Decaf</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
