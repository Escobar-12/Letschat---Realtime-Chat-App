import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

const Logout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogOut = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-[1240px] mx-auto my-10 px-4 md:px-8 space-y-10">
      <div className="w-full lg:w-1/2 flex flex-col gap-5">
        <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-primary)]">
          Click Here To Log Out
        </h1>
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            onClick={handleLogOut}
            className="flex items-center justify-center gap-2 px-5 py-3 text-md xl:text-lg font-semibold rounded-md bg-[var(--color-primary)] text-[var(--text-color)] hover:bg-[var(--color-accent)] transition-colors duration-200"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-5 py-3 text-md xl:text-lg font-semibold rounded-md bg-[var(--color-primary)] text-[var(--text-color)] hover:bg-[var(--color-accent)] transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
