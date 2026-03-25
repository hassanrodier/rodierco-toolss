"use client";

import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

function buildPath(pts: [number, number][], close = false): string {
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return close ? d + ` L ${pts[pts.length - 1][0].toFixed(1)} ${(pts[0][1] + 100).toFixed(1)} L 0 ${(pts[0][1] + 100).toFixed(1)} Z` : d;
}

export function Sparkline({ data, width = 80, height = 28, className }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;

  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - pad - ((v - min) / range) * (height - pad * 2),
  ]);

  const linePath = buildPath(pts);
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1][0].toFixed(1)} ${height} L 0 ${height} Z`;

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? "#34d399" : "#f87171";
  const gradId = `spk-${isUp ? "up" : "dn"}-${width}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2"
        fill={color}
      />
    </svg>
  );
}
