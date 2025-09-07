import { Loader2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomButton = ({ label, to = '/', disable = false, loading = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disable && !loading) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disable}
      className={`
        relative flex items-center justify-center gap-2 rounded-md py-3 px-6 transition-colors duration-200
        ${disable
          ? "bg-[var(--color-neutral)]/70 cursor-not-allowed"
          : "bg-[var(--color-primary)] hover:bg-[var(--color-accent)] cursor-pointer"
        }
      `}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-[var(--text-color)]" />
      ) : (
        <span className="text-md lg:text-lg 3xl:text-2xl text-[var(--text-color)] font-semibold">
          {label}
        </span>
      )}

      {!disable && !loading && (
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-50 animate-pulse"
            ></div>
          ))}
        </div>
      )}
    </button>
  );
};

export default CustomButton;
