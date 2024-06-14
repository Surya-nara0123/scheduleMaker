"use client";
import pocketbase from "pocketbase";
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import snu02 from "../Components/snu-02.jpg";
import Image from "next/image";

const pb = new pocketbase("https://snuc.pockethost.io");

function Login() {
  const handleLogin = async () => {
    try {
      const record = await pb.collection("users").authWithPassword(user.email, user.password)
      console.log(record);
      window.location.href = "/timetable";
    } catch (e) {
      // toast.error("Invalid credentials")
      alert("Invalid credentials")
    }
  };
  const [user, setUser] = useState({ email: "", password: "" });
  return (
    <main className="flex w-screen h-screen items-center justify-center">
      <Image src={snu02} alt="SNU" layout="fill" objectFit="cover" />
      <div className="z-10 bg-[#054AA1] p-10 items-center flex flex-col  rounded-2xl">
        <h1>Login</h1>
        <div className="flex-col flex">
          <input
            className="m-3 rounded-md p-3"
            type="text"
            placeholder="email"
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          <input
            className="m-3 rounded-md p-3"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          <button
            type="submit"
            onClick={handleLogin}
            className="mx-auto w-fit m-3 p-3 px-6 bg-white rounded-full"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}

export default Login;
