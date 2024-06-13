"use client";
import Sidebar from "../Components/Sidebar";
import PocketBase from "pocketbase";
import { useState } from "react";
import snu02 from "../Components/snu-02.jpg";
import Image from "next/image";

function RegistrationPage() {
  const pb = new PocketBase("https://snuc.pockethost.io");
  const handleSubmit: any = async () => {
    const user1 = user.username;
    const mail = user.email;
    const password = user.password;
    const namee = user.name;
    const data = {
      username: user1,
      email: mail,
      emailVisibility: true,
      password: password,
      passwordConfirm: password,
      name: namee,
    };
    const record = await pb.collection("users").create(data);
  };
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  return (
    <main className="flex w-screen h-screen items-center justify-center">
      <Image src={snu02} alt="SNU" layout="fill" objectFit="cover" />
      <div className="z-10 bg-[#054AA1] p-10 items-center flex flex-col  rounded-2xl">
        <h1>Register</h1>
        <div className="flex-col flex">
          <input
            type="text"
            placeholder="Username"
            className="m-3 rounded-md p-3"
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="m-3 rounded-md p-3"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Email"
            className="m-3 rounded-md p-3"
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Name"
            className="m-3 rounded-md p-3"
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
            }}
          />
          <button
            className="mx-auto w-fit m-3 p-3 px-6 bg-white rounded-full"
            onClick={() => {
              handleSubmit();
            }}
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}

export default RegistrationPage;
