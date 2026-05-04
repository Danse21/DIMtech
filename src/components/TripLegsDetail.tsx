import type { DisplayLeg } from "@/types/display";

interface TripLegsDetailProps {
  legs: DisplayLeg[];
}

export function TripLegsDetail({ legs }: TripLegsDetailProps) {
  return (
    <div className="space-y-2">
      {legs.map((leg, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${leg.badgeBg} ${leg.badgeText}`}>
              {leg.isWalk ? "🚶" : leg.badge}
            </span>
            {i < legs.length - 1 && <div className="w-0.5 h-4 bg-gray-200" />}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900">{leg.name}</span>
              <span className="text-gray-500 tabular-nums text-xs">{leg.dep} → {leg.arr}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {leg.fromName}
              {leg.platform && <span className="text-gray-400"> · Platform {leg.platform}</span>}
            </div>
            {leg.operator && !leg.isWalk && (
              <div className="text-xs text-gray-400 mt-0.5">{leg.operator}</div>
            )}
            <div className="text-xs text-gray-400 mt-1">→ {leg.toName} at {leg.arr}</div>
            {leg.buyLink && (
              <a
                href={leg.buyLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {leg.buyLink.label}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
