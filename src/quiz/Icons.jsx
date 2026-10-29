const svgProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

export function CheckIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  )
}

export function CrossIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function FlameIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 2c1.6 4.2 5.2 5.6 5.2 9.2a5.2 5.2 0 0 1-10.4 0c0-2 .9-3.2 2-4.4.4 2 1.4 3 2.9 3.2-.4-3.2-.6-5.4.3-8Z" />
    </svg>
  )
}

export function TrophyIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H5a2 2 0 0 0 0 4h2M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M12 14v3M9 20h6" />
    </svg>
  )
}

export function TimerIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 2h6" />
    </svg>
  )
}

export function SparkIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.6 10.4 12.2 5 10.6 10.4 9 12 3.5Z" />
      <path d="M18.5 15.5 19.2 18l2.3.7-2.3.8-.7 2.5-.7-2.5-2.3-.8 2.3-.7.7-2.5Z" />
    </svg>
  )
}

export function BoltIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function ReplayIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

export function LayersIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  )
}

export function OfflineIcon(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" />
      <path d="M9 12h6" />
    </svg>
  )
}
