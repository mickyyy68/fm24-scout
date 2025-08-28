import { useMemo } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { Player } from '@/types'
import { useTheme } from '@/components/theme-provider'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type AttrKey =
  | 'Acc' | 'Pac' | 'Str' | 'Agi' | 'Bal' | 'Jum' | 'Sta'
  | 'Dri' | 'Fin' | 'Hea' | 'Pas' | 'Tec' | 'Cro' | 'Mar' | 'Tck' | 'Pos' | 'Vis' | 'Com' | 'Cnt' | 'Dec' | 'Det' | 'Wor' | 'Fir' | 'Lon' | 'Cor' | 'Ant' | 'Bra' | 'Ldr' | 'OtB'

export type AttributeSet = 'Physical' | 'Technical' | 'Mental' | 'Custom'

const SETS: Record<Exclude<AttributeSet, 'Custom'>, { label: string; keys: AttrKey[] }> = {
  Physical: {
    label: 'Physical',
    keys: ['Acc','Pac','Sta','Str','Agi','Bal','Jum']
  },
  Technical: {
    label: 'Technical',
    keys: ['Dri','Fin','Pas','Tec','Cro','Hea','Fir','Lon']
  },
  Mental: {
    label: 'Mental',
    keys: ['Ant','Com','Cnt','Dec','Det','Ldr','OtB','Pos','Vis','Wor']
  },
}

// Colors now come from CSS variables --chart-1..--chart-4

export interface RadarChartProps {
  players: Player[]
  attributeSet?: AttributeSet
  customKeys?: AttrKey[]
  height?: number
}

export function RadarChart({ players, attributeSet = 'Physical', customKeys, height = 320 }: RadarChartProps) {
  const keys = attributeSet === 'Custom' ? (customKeys ?? SETS.Physical.keys) : SETS[attributeSet].keys
  const { theme } = useTheme()

  const cssColors = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        border: 'rgba(0,0,0,0.1)',
        angle: 'rgba(0,0,0,0.1)',
        labels: '#000',
        datasets: [
          { bg: 'rgba(99,102,241,0.2)', bd: 'rgba(99,102,241,1)' },
          { bg: 'rgba(34,197,94,0.2)', bd: 'rgba(34,197,94,1)' },
          { bg: 'rgba(239,68,68,0.2)', bd: 'rgba(239,68,68,1)' },
          { bg: 'rgba(234,179,8,0.2)', bd: 'rgba(234,179,8,1)' },
        ],
      }
    }
    const root = document.documentElement
    const get = (name: string) => getComputedStyle(root).getPropertyValue(name).trim()
    const toAlpha = (hsl: string, alpha: number) => hsl.endsWith(')') ? hsl.replace(')', ` / ${alpha})`) : hsl

    const dsVars = ['--chart-1','--chart-2','--chart-3','--chart-4']
    const datasets = dsVars.map(v => {
      const c = get(v) || 'hsl(240 5% 50%)'
      return { bg: toAlpha(c, 0.2), bd: c }
    })

    return {
      border: toAlpha(get('--border') || 'hsl(240 5% 84%)', 0.4),
      angle: toAlpha(get('--border') || 'hsl(240 5% 84%)', 0.4),
      labels: get('--muted-foreground') || '#888',
      datasets,
    }
  }, [theme])

  const data = useMemo(() => {
    const labels = keys
    return {
      labels,
      datasets: players.slice(0, 4).map((p, i) => ({
        label: p.Name,
        data: labels.map((k) => Number((p as any)[k]) || 0),
        backgroundColor: cssColors.datasets[i % cssColors.datasets.length].bg,
        borderColor: cssColors.datasets[i % cssColors.datasets.length].bd,
        borderWidth: 2,
        pointBackgroundColor: cssColors.datasets[i % cssColors.datasets.length].bd,
        pointRadius: 2,
        fill: true,
      })),
    }
  }, [players, keys, cssColors])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 20,
        ticks: { stepSize: 5, color: cssColors.labels, showLabelBackdrop: false },
        grid: { color: cssColors.border },
        angleLines: { color: cssColors.angle },
        pointLabels: { color: cssColors.labels, font: { size: 11 } },
      },
    },
  }), [cssColors])

  return (
    <div style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  )
}
