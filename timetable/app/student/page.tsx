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
            <div className=" ml-12">
                <div className="mt-16 font-semibold ml-12 text-4xl">
                    Home
                    <div className="bg-white h-0.5 w-1/2 mt-1"></div>
                </div>
                <div className="bg-white rounded-lg ml-12 py-4 mt-6 pl-4 w-full flex"> Check out your time table by choosing your branch and section below!<SVGStar className="ml-96 h-fit w-fit"/></div>
                <div className="flex gap-8 ml-12 mt-16">
                    <select className="bg-white rounded-lg p-2">
                        <option defaultChecked>Select your branch</option>
                        <option>B.Tech CSE Cybersecurity</option>
                        <option>B.Tech AI/DS</option>
                        <option>B.Tech CSE IoT</option>
                        <option>B.Sc</option>
                        <option>M.Tech</option>
                    </select>
                    <select className="bg-white rounded-lg p-2">
                        <option defaultChecked>Select section</option>
                        <option>Cybersecurity</option>
                        <option>AI/DS A</option>
                        <option>AI/DS B</option>
                        <option>AI/DS C</option>
                        <option>IoT A</option>
                        <option>IoT B</option>
                    </select>                
                </div>
            </div>
        </div>
    </main>
  );
}
