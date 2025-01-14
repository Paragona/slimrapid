export function PlaceholderImage({
  width = 64,
  height = 64,
  className,
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#F3F4F6" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize={Math.min(width, height) / 4}
      >
        {width}x{height}
      </text>
    </svg>
  )
}
