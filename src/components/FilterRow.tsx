export interface FilterOption {
  label: string;
  value: string;
}

interface FilterRowProps {
  title: string;
  options: readonly FilterOption[];
  param: string;
  value: string;
  buildHref: (param: string, value: string) => string;
}

export function FilterRow({ title, options, param, value, buildHref }: FilterRowProps) {
  return (
    <div className="mb-3 flex items-start gap-3 last:mb-0">
      <span className="mt-1.5 shrink-0 text-sm text-slate-500">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = (!value && !opt.value) || value === opt.value;
          return (
            <a
              key={opt.value}
              href={buildHref(param, opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {opt.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
