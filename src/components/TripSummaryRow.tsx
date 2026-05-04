import type { LineBadge } from "@/types/display";

interface TripSummaryRowProps {
  depTime: string;
  arrTime: string;
  fromName: string;
  toName: string;
  badges: LineBadge[];
  meta?: React.ReactNode;
}

export function TripSummaryRow({ depTime, arrTime, fromName, toName, badges, meta }: TripSummaryRowProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="text-center shrink-0">
        <div className="text-2xl font-bold text-gray-900">{depTime}</div>
        <div className="text-xs text-gray-500">{fromName}</div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {badges.map((b, i) => (
            <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${b.bg} ${b.text}`}>
              {b.label}
            </span>
          ))}
        </div>
        {meta && <div className="text-xs text-gray-400">{meta}</div>}
      </div>
      <div className="text-center shrink-0">
        <div className="text-2xl font-bold text-gray-900">{arrTime}</div>
        <div className="text-xs text-gray-500">{toName}</div>
      </div>
    </div>
  );
}
