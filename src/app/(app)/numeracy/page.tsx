/**
 * Numeracy mode — language selector.
 * Mirrors /phonics/page.tsx structure.
 */
import Link from "next/link";

export default function NumeracyPage() {
  return (
    <div className="flex flex-col gap-6 pb-10 mb-10">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-stone-800">
          Numbers & Shapes
        </h1>

        <p className="text-stone-500 text-sm mt-1">
          Pick a language to start counting!
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
        {Array.from({ length: 10 }, (_, index) => {
          const start = index * 10 + 1;
          const end = start + 9;
          const item = {
            label: "English",
            range: `${start}–${end}`,
            start,
            end,
            href: `/numeracy/english?start=${start}&end=${end}`,
            free: start <= 10,
          };

          return (
            <Link
              key={item.range}
              href={item.href}
              className="flex items-center justify-between bg-white rounded-3xl p-5 shadow-md ring-1 ring-violet-100 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇬🇧</span>

                <div>
                  <p className="font-bold text-stone-800">{item.label}</p>

                  <p className="text-xs text-stone-500">
                    Numbers {item.start}–{item.end}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  item.free
                    ? "text-green-700 bg-green-100"
                    : "text-stone-400 bg-stone-100"
                }`}
              >
                {item.free ? "Free" : "Locked"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
