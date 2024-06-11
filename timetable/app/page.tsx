'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "./Components/Sidebar";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <Sidebar />
    </main>
  );
}
