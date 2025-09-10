import React from 'react'

const COLORS = [
  "#f87171", // red-400
  "#fbbf24", // amber-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#38bdf8", // sky-400
  "#fb923c", // orange-400
];
const FirstLetterProfile = ({name = ""}) => {
    
    const stringToNumber = (str) => 
    {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const colorIndex = stringToNumber(name) % COLORS.length;
    const bgColor = COLORS[colorIndex];

  return (
    <div className={` relative size-12 rounded-full`} style={{ backgroundColor: bgColor }}>
        <p className={`absolute top-1/2 left-1/2 -translate-1/2 text-lg font-bold `}>{name[0].toUpperCase()}</p>
    </div>
  )
}

export default FirstLetterProfile