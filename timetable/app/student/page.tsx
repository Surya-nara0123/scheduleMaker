import Image from "next/image";
import Link from "next/link";
import React from "react";
import Sidebar from "../Components/Sidebar";
import SVGStar from "../Components/star";
export default function Home() {

  return (
    <main className="min-h-screen bg-[#B4D2E7]">
        <div className="flex">
            <Sidebar />
            
        </div>
    </main>
  );
}
