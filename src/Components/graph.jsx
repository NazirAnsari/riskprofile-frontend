import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
const RADIAN = Math.PI / 180;
const data = [
  { name: "Conservative", value: 10, color: "#6fe100" },
  { name: "Moderate Conservate", value: 10, color: "#b0eb00" },
  { name: "Moderate", value: 10, color: "#f3d000" },
  { name: "Moderate Aggressive", value: 10, color: "#eb9709" },
  { name: "Aggressive", value: 10, color: "#d83039" },
];
const cx = 300;
const cy = 239;
const iR = 120;
const oR = 163.6;
const needle = (value, data, cx, cy, iR, oR) => {
  var total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 4;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle
      cx={x0}
      cy={y0}
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
  ];
};

var renderLabel = ({
  x, y, name
}) => {
  return (
    <text
      x={x}
      y={y}
      fill={x < 450 ? "#555555" : "red"}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="auto"
      position="centerBottom"
      fontWeight="bold"
    >
      {name}
    </text>
  );
};

export default function RiskGraph(props) {
  return (
    <div className="riskProfileGraphCenter">
      <h2 className="graphHeading">Your Risk Profile is {props.value[2]}</h2>
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
          innerRadius={iR}
          outerRadius={oR}
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
        {needle(props.value[1], data, cx, cy, iR, 140)}
      </PieChart>
      <hr className="horizontalLine" />
      <p className="graphfooterText">Valid upto 03-07-2106</p>
      <button className="riskProfileUpdateBtn" onClick={() => props.RenewRiskProfile()}>Renew Risk Profile</button>
    </div>
  );
}
