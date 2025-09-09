import React from 'react';

const ThemeBox = ({ theme = {}, onClick, name="" }) => {
  console.log(theme)
  const colors = [
    theme["--color-primary"],
    theme["--color-secondary"],
    theme["--color-accent"],
    theme["--color-neutral"],
    theme["--bg-color"],
  ];

  return (
    <div className='flex flex-col items-center justify-center gap-1'>
      <div className={`flex items-center justify-between w-fit gap-1 p-1 rounded cursor-pointer`} 
          style={{backgroundColor: colors[4]}} 
          onClick={onClick}>

        {colors.slice(0,4).map((c, i) => (
          <div
            key={i}
            style={{ width: 24, height: 24, backgroundColor: c }}
            className="rounded"
          />
        ))}
      </div>
      <p className='text-lg text-[var(--color-neutral)]'>{name}</p>
    </div>
  );
};

export default ThemeBox;
