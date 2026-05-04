import type { ReactNode } from "react";

export const TRIP_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  MET: { bg: "bg-blue-600", text: "text-white" },
  BUS: { bg: "bg-green-600", text: "text-white" },
  TRN: { bg: "bg-red-600", text: "text-white" },
  REG: { bg: "bg-orange-500", text: "text-white" },
  UNK: { bg: "bg-gray-500", text: "text-white" },
  WAK: { bg: "bg-gray-300", text: "text-gray-700" },
};

export function getTripCategoryStyle(category?: string) {
  return category ? (TRIP_CATEGORY_COLORS[category] ?? TRIP_CATEGORY_COLORS.UNK) : TRIP_CATEGORY_COLORS.UNK;
}

export interface TripLineBadge {
  label: string;
  bg: string;
  text: string;
}

export interface TripDisplayLeg {
  badge: string;
  badgeBg: string;
  badgeText: string;
  name: string;
  direction?: string;
  fromName: string;
  toName: string;
  dep: string;
  arr: string;
  platform?: string;
  platformLabel?: string;
  operator?: string;
  isWalk?: boolean;
  buyLink?: {
    label: string;
    url: string;
  };
  buyLabel?: string;
}

interface TripDisplayCardProps {
  depTime: string;
  arrTime: string;
  fromName: string;
  toName: string;
  badges: TripLineBadge[];
  legs: TripDisplayLeg[];
  legsTitle: string;
  centerMeta?: ReactNode;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  footer?: ReactNode;
  className?: string;
}

export function TripDisplayCard({
  depTime,
  arrTime,
  fromName,
  toName,
  badges,
  legs,
  legsTitle,
  centerMeta,
  rightTop,
  rightBottom,
  expanded = true,
  onToggle,
  footer,
  className = "",
}: TripDisplayCardProps) {
  const showRightColumn = !!rightTop || !!rightBottom || !!onToggle;
  const cardClassName = [
    "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
    onToggle ? "hover:shadow-md transition-shadow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const summary = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="text-center shrink-0">
          <div className="text-2xl font-bold text-gray-900">{depTime}</div>
          <div className="text-xs text-gray-500">{fromName}</div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <div className="flex items-center gap-1 w-full justify-center flex-wrap">
            {badges.map((badge, i) => (
              <span
                key={`${badge.label}-${i}`}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
          {centerMeta && <div className="text-xs text-gray-400">{centerMeta}</div>}
        </div>
        <div className="text-center shrink-0">
          <div className="text-2xl font-bold text-gray-900">{arrTime}</div>
          <div className="text-xs text-gray-500">{toName}</div>
        </div>
      </div>

      {showRightColumn && (
        <div className="shrink-0 text-right">
          {rightTop && <div className="text-lg font-bold text-green-600">{rightTop}</div>}
          {rightBottom && <div className="text-sm text-gray-500">{rightBottom}</div>}
          {onToggle && (
            <svg
              className={`w-5 h-5 text-gray-400 mt-1 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={cardClassName}>
      {onToggle ? (
        <button onClick={onToggle} className="w-full text-left px-5 py-4">
          {summary}
        </button>
      ) : (
        <div className="px-5 py-4">{summary}</div>
      )}

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {legsTitle}
          </h3>
          <div className="space-y-2">
            {legs.map((leg, i) => (
              <div key={`${leg.name}-${i}`} className="flex gap-3 items-start">
                <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${leg.badgeBg} ${leg.badgeText}`}
                  >
                    {leg.isWalk ? "🚶" : leg.badge}
                  </span>
                  {i < legs.length - 1 && <div className="w-0.5 h-4 bg-gray-200" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between text-sm gap-3">
                    <span className="font-medium text-gray-900">
                      {leg.name}
                      {leg.direction && (
                        <span className="font-normal text-gray-500"> {leg.direction}</span>
                      )}
                    </span>
                    <span className="text-gray-500 tabular-nums whitespace-nowrap">
                      {leg.dep} → {leg.arr}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {leg.fromName}
                    {leg.platform && (
                      <span className="text-gray-400">
                        {" · "}
                        {leg.platformLabel ?? "Platform"} {leg.platform}
                      </span>
                    )}
                  </div>
                  {leg.operator && !leg.buyLink && (
                    <div className="text-xs text-gray-400 mt-0.5">{leg.operator}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    → {leg.toName} at {leg.arr}
                  </div>
                  {leg.buyLink && (
                    <a
                      href={leg.buyLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      {leg.buyLabel ? `${leg.buyLabel} · ${leg.buyLink.label}` : leg.buyLink.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {footer && <div className="pt-3 border-t border-gray-100">{footer}</div>}
        </div>
      )}
    </div>
  );
}
