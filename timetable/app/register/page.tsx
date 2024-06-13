'use client'
import Sidebar from "../Components/Sidebar";
import PocketBase from "pocketbase";
import { useState } from "react";

function RegistrationPage() {
  const pb = new PocketBase("https://snuc.pockethost.io");
  const handleSubmit: any = async() => {
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
    const record = await pb.collection('users').create(data);
  };
  const [user, setUser] = useState({
    "username": "",
    "email": "",
    "password": "",
    "name": ""
  });
  return (
    <main className="bg-[#B4D2E7] min-h-screen min-w-screen">
      <div className="flex">
        {/* <Sidebar /> */}
        <div>
            <input type="text" placeholder="Username"
            onChange={
              (e) => {
                setUser({...user, username: e.target.value});
              }
            
            } />
            <input type="password" placeholder="Password" 
            onChange={
              (e) => {
                setUser({...user, password: e.target.value});
              }
            
            } />
            <input type="text" placeholder="Email" 
            onChange={
              (e) => {
                setUser({...user, email: e.target.value});
              }
            
            } />
            <input type="text" placeholder="Name"  
            onChange={
              (e) => {
                setUser({...user, name: e.target.value});
              }
            
            }/>    
          <button
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
