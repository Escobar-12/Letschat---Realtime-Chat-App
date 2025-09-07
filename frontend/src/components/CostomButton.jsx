import { Loader2 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CustomButton = ({ label, to = '/', disable = false, loading = false }) => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   if (!disable && !loading) {
  //     navigate(to);
  //   }
  // };

  return (
    <button
      disabled={disable} //onClick={handleClick}
      className={`
        ${disable ? "bg-neutral-200/70 cursor-not-allowed" : "c-button bg-white cursor-pointer"}
        rounded-md py-[12px] transition-colors duration-150 flex items-center justify-center gap-2 `}>
      
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <p className="c-button__text text-md lg:text-lg 3xl:text-2xl">{label}</p>
      )}

      <div className={`${disable ? "hidden" : "c-button__blobs"}`}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
    
    </button>
  );
};

export default CustomButton;
