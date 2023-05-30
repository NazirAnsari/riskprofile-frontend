import React from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
const RADIAN = Math.PI / 180
const data = [
  { name: "Conservative", value: 10, color: "#6fe100" },
  { name: "Moderate Conservate", value: 10, color: "#b0eb00" },
  { name: "Moderate", value: 10, color: "#f3d000" },
  { name: "Moderate Aggressive", value: 10, color: "#eb9709" },
  { name: "Aggressive", value: 10, color: "#d83039" },
]
const horizontalAxis = 300
const verticalAxis = 239
const innerRadius = 120
const outerRadius = 163.6
const needle = (value, data, horizontalAxis, verticalAxis, innerRadius, outerRadius) => {
  let total = 0
  data.forEach((values) => {
    total += values.value
  })
  const angle = 180.0 * (1 - value / total)
  const length = (innerRadius + 2 * outerRadius) / 4
  const sin = Math.sin(-RADIAN * angle)
  const cos = Math.cos(-RADIAN * angle)

  const xba = horizontalAxis + 5 + 5 * sin
  const xbb = horizontalAxis + 5 - 5 * sin
  const xp = horizontalAxis + 5 + length * cos
  const yba = verticalAxis + 5 - 5 * cos
  const ybb = verticalAxis + 5 + 5 * cos
  const yp = verticalAxis + 5 + length * sin

  return [
    <circle
      cx={horizontalAxis + 5}
      cy={verticalAxis + 5}
      r={100 * 0.1}
      strokeWidth="5"
      fill="orange"
      stroke="orange"
    />,
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="black"
      fill="black"
      r={100 * 0.1}
      strikethroughPosition="top"
      strokeLinecap="round"
    />,
  ]
}
let renderLabel = ({
  x, y, name
}) => {
  return (
    <text
      x={x}
      y={y}
      fill={x < 450 ? "#555555" : "red"}
      textAnchor={x > horizontalAxis ? "start" : "end"}
      dominantBaseline="auto"
      position="centerBottom"
      fontWeight="bold"
    >
      {name}
    </text>
  )
}
export default function RiskGraph(props) {
  return (
    <div className="riskProfileGraphCenter">
      <h2 className="graphHeading">Your Risk Profile is {props.value.result.riskLabel}</h2>
      <PieChart width={600} height={400}>
        <Pie
          isAnimationActive={false}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          value={data.name}
          cx={300}
          cy={250}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          stroke="none"
          paddingAngle={2}
          label={renderLabel}
          labelLine={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        {needle(props.value.result.sum, data, horizontalAxis, verticalAxis, innerRadius, 140)}
      </PieChart>
      <hr className="horizontalLine" />
      <p className="graphfooterText">Valid upto 03-07-2106</p>
      <button className="riskProfileUpdateBtn" onClick={() => window.location.reload()}>Renew Risk Profile</button>
    </div>
  )
}
