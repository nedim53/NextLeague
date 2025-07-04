"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"

export default function SpiderChart({ chartData }) {
  const data = [
    {
      subject: "Napad",
      A: chartData.napad,
      fullMark: 20,
    },
    {
      subject: "Odbrana",
      A: chartData.odbrana,
      fullMark: 20,
    },
    {
      subject: "Brzina",
      A: chartData.brzina,
      fullMark: 20,
    },
    {
      subject: "Snaga",
      A: chartData.snaga,
      fullMark: 20,
    },
    {
      subject: "Izdržljivost",
      A: chartData.izdrzljivost,
      fullMark: 20,
    },
    {
      subject: "Dodavanja",
      A: chartData.dodavanja,
      fullMark: 20,
    },
  ]
  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <div className="bg-[#031716] rounded-lg border border-[#0c969c]/20 p-6">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data}>
              <PolarGrid stroke="#0a7075" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#6ba3be', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 20]} 
                tick={false} 
              />
              <Radar 
                name="Igrač" 
                dataKey="A" 
                stroke="#0c969c" 
                fill="#0c969c" 
                fillOpacity={0.3} 
                strokeWidth={2} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 