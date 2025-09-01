
import { useRef, useEffect, useState } from "react";
import CustomButton from "./CostomButton"

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";

import RegisterSelectProfile from "../components/RegisterSelectProfile.jsx";


const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register({ setLogin, Logged }) {
  const { setAuth, setToken } = useAuth();
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [img, setImg] = useState("user.png");
  const [err, setErr] = useState("");

  const validName = USER_REGEX.test(user);
  const validPwd = PWD_REGEX.test(pwd);
  const validEmail = EMAIL_REGEX.test(email);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErr("");
  }, [user, email, pwd]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd || !validEmail) {
      setErr("Invalid input format.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user,
          email: email,
          password: pwd,
          img: img || "user.png",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const roles = data.role;
      const id = data.id;

      setErr("");
      setToken(data.Access_token);

      const userData = { user, roles, id, img };
      setAuth(userData);
      localStorage.setItem("auth", JSON.stringify(userData));

      Logged();
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <section className="w-full flex justify-center bg-bg text-white px-3">
      <div className="flex flex-col items-start w-full py-8 px-6 space-y-8 rounded-xl">
        {err && (
          <p ref={errRef} className="text-red-500 text-center">
            {err}
          </p>
        )}

        <div className="space-y-2 w-full">
          <h1 className="font-semibold text-3xl">Create an account</h1>
          <div className="flex gap-1 text-sm">
            <p className="text-gray-400">Already have an account?</p>
            <button
              type="button"
              onClick={() => setLogin(true)}
              className="text-light hover:underline"
            >
              Login
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          {/* Profile Picker */}
          <div className="w-full flex justify-center">
            <RegisterSelectProfile setImg={setImg} />
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? "false" : "true"}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"}
          />

          <CustomButton
            disable={!validName || !validPwd || !validEmail}
            label="Sign Up"
          />
        </form>
      </div>
    </section>
  );
}

export default Register;
