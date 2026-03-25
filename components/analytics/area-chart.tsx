"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { DailyMetric } from "@/lib/analytics-data";

interface AreaChartProps {
  data: DailyMetric[];
  color?: string;
  formatValue?: (v: number) => string;
  className?: string;
  showDots?: boolean;
  fillOpacity?: number;
  maxPoints?: number;
  /** If true, Y axis starts at min value instead of 0 */
  autoMin?: boolean;
}

const W = 700;
const H = 200;
const PAD = { top: 20, right: 16, bottom: 40, left: 60 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;
const Y_TICKS = 4;

function niceMax(v: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil((v * 1.08) / mag) * mag;
}
function niceMin(v: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.floor((v * 0.95) / mag) * mag;
}

/** Cardinal spline through points */
function smoothPath(pts: [number, number][], tension = 0.18): string {
  if (pts.length < 2) return "";
  const cmds: string[] = [`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    cmds.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
  }
  return cmds.join(" ");
}

export function AreaChart({
  data,
  color = "#8b5cf6",
  formatValue,
  className,
  showDots = true,
  fillOpacity = 0.15,
  maxPoints = 30,
  autoMin = false,
}: AreaChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = data.slice(-maxPoints);
  if (!display.length) return null;

  const values = display.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const minVal = autoMin ? niceMin(rawMin) : 0;
  const maxVal = niceMax(rawMax);
  const range = maxVal - minVal || 1;

  const fmtVal = formatValue ?? ((v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toLocaleString("fr-FR");
  });

  const step = CW / Math.max(display.length - 1, 1);
  const toX = (i: number) => PAD.left + step * i;
  const toY = (v: number) => PAD.top + CH * (1 - (v - minVal) / range);

  const pts = useMemo<[number, number][]>(
    () => display.map((d, i) => [toX(i), toY(d.value)]),
    [display]
  );

  const linePath = smoothPath(pts);
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1][0].toFixed(1)} ${(PAD.top + CH).toFixed(1)}` +
    ` L ${pts[0][0].toFixed(1)} ${(PAD.top + CH).toFixed(1)} Z`;

  const labelEvery = display.length > 20 ? 5 : display.length > 10 ? 3 : 1;
  const gradId = `area-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div className={cn("w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 5} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y gridlines + labels */}
        {Array.from({ length: Y_TICKS + 1 }).map((_, i) => {
          const val = minVal + (range / Y_TICKS) * (Y_TICKS - i);
          const y = toY(val);
          return (
            <g key={i}>
              <line
                x1={PAD.left} y1={y}
                x2={W - PAD.right} y2={y}
                stroke="hsl(222,47%,13%)"
                strokeWidth={i === Y_TICKS ? 1 : 0.8}
                strokeDasharray={i === Y_TICKS ? "0" : "3 5"}
              />
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10.5"
                fill="hsl(215,20%,40%)"
                fontFamily="ui-sans-serif,system-ui,sans-serif"
              >
                {fmtVal(parseFloat(val.toFixed(1)))}
              </text>
            </g>
          );
        })}

        {/* Hover vertical line */}
        {hovered !== null && (
          <line
            x1={toX(hovered)} y1={PAD.top}
            x2={toX(hovered)} y2={PAD.top + CH}
            stroke={color}
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover hitboxes + dots */}
        {display.map((d, i) => {
          const x = toX(i);
          const y = toY(d.value);
          const isH = hovered === i;
          const hitW = step;
          const hitX = x - hitW / 2;

          return (
            <g key={d.date}>
              {/* Hitbox */}
              <rect
                x={Math.max(hitX, PAD.left)}
                y={PAD.top}
                width={hitW}
                height={CH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                style={{ cursor: "crosshair" }}
              />

              {/* Dot */}
              {(showDots || isH) && (
                <circle
                  cx={x} cy={y}
                  r={isH ? 5 : display.length <= 14 ? 3 : 0}
                  fill={isH ? "white" : color}
                  stroke={isH ? color : "transparent"}
                  strokeWidth="2"
                  style={{ transition: "r 0.1s ease" }}
                />
              )}

              {/* Tooltip */}
              {isH && (() => {
                const tx = Math.min(Math.max(x - 44, PAD.left), W - PAD.right - 88);
                const ty = Math.max(y - 40, PAD.top);
                return (
                  <g>
                    <rect x={tx} y={ty} width="88" height="28" rx="6"
                      fill="hsl(222,47%,11%)" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
                    <text x={tx + 44} y={ty + 11} textAnchor="middle"
                      fontSize="10" fill="hsl(215,20%,55%)"
                      fontFamily="ui-sans-serif,system-ui,sans-serif">
                      {d.label}
                    </text>
                    <text x={tx + 44} y={ty + 23} textAnchor="middle"
                      fontSize="12" fontWeight="700" fill="white"
                      fontFamily="ui-sans-serif,system-ui,sans-serif">
                      {fmtVal(d.value)}
                    </text>
                  </g>
                );
              })()}

              {/* X label */}
              {i % labelEvery === 0 && (
                <text
                  x={x}
                  y={H - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isH ? "hsl(215,20%,65%)" : "hsl(215,20%,38%)"}
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
