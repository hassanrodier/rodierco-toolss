"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DailyMetric } from "@/lib/analytics-data";

interface BarChartProps {
  data: DailyMetric[];
  color?: string;
  formatValue?: (v: number) => string;
  className?: string;
  maxBars?: number;
}

const W = 700;
const H = 220;
const PAD = { top: 20, right: 16, bottom: 42, left: 58 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;
const Y_TICKS = 4;

function niceMax(v: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil((v * 1.12) / mag) * mag;
}

function fmt(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString("fr-FR");
}

export function BarChart({ data, color = "#8b5cf6", formatValue, className, maxBars = 30 }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = data.slice(-maxBars);
  if (!display.length) return null;

  const fmtVal = formatValue ?? fmt;
  const maxVal = niceMax(Math.max(...display.map((d) => d.value)));
  const step = CW / display.length;
  const bw = Math.min(step * 0.55, 28);
  const bo = (step - bw) / 2;

  const toY = (v: number) => PAD.top + CH * (1 - v / maxVal);
  const toH = (v: number) => CH * (v / maxVal);

  // Show every N-th label to avoid crowding
  const labelEvery = display.length > 20 ? 5 : display.length > 10 ? 3 : 1;

  return (
    <div className={cn("w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`bg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={`bgh-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={PAD.left} y1={PAD.top + CH}
          x2={W - PAD.right} y2={PAD.top + CH}
          stroke="hsl(222,47%,16%)" strokeWidth="1"
        />

        {/* Y gridlines + labels */}
        {Array.from({ length: Y_TICKS + 1 }).map((_, i) => {
          const val = (maxVal / Y_TICKS) * (Y_TICKS - i);
          const y = toY(val);
          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={PAD.left} y1={y}
                  x2={W - PAD.right} y2={y}
                  stroke="hsl(222,47%,13%)"
                  strokeWidth="0.8"
                  strokeDasharray="3 4"
                />
              )}
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10.5"
                fill="hsl(215,20%,40%)"
                fontFamily="ui-sans-serif,system-ui,sans-serif"
              >
                {fmtVal(Math.round(val))}
              </text>
            </g>
          );
        })}

        {/* Bars + labels */}
        {display.map((d, i) => {
          const bh = Math.max(toH(d.value), 2);
          const x = PAD.left + step * i + bo;
          const y = toY(d.value);
          const isH = hovered === i;
          const gradId = isH
            ? `bgh-${color.replace("#", "")}`
            : `bg-${color.replace("#", "")}`;

          return (
            <g key={d.date}>
              {/* Hover hitbox */}
              <rect
                x={PAD.left + step * i}
                y={PAD.top}
                width={step}
                height={CH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              />

              {/* Column highlight */}
              {isH && (
                <rect
                  x={PAD.left + step * i}
                  y={PAD.top}
                  width={step}
                  height={CH}
                  fill={color}
                  fillOpacity="0.05"
                  rx="2"
                />
              )}

              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={bw}
                height={bh}
                fill={`url(#${gradId})`}
                rx="4"
                style={{ transition: "y 0.3s ease, height 0.3s ease" }}
              />

              {/* Tooltip */}
              {isH && (() => {
                const tx = Math.min(Math.max(x + bw / 2 - 44, PAD.left), W - PAD.right - 88);
                const ty = Math.max(y - 38, PAD.top);
                return (
                  <g>
                    <rect x={tx} y={ty} width="88" height="26" rx="6"
                      fill="hsl(222,47%,11%)" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
                    <text x={tx + 44} y={ty + 17} textAnchor="middle"
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
                  x={x + bw / 2}
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
