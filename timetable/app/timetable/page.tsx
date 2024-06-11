"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import SVGStar from "../Components/star";

export default function Table() {
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

  const generateTimeTable = () => {
    console.log(year, section);
  };
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <div className="flex">
        <Sidebar />
        <div className="">
          <div className="mt-16 font-semibold ml-12 text-4xl">
            Time Table
            <div className="bg-white h-0.5 w-1/2 mt-1"></div>
          </div>
          <div className="m-5 items-center justify-center p-3 ml-10">
            <select
              className="bg-white rounded-lg p-2 mr-2"
              onChange={(e) => {
                setYear(e.target.value);
              }}
            >
              <option defaultChecked>Select year</option>
              <option>1st</option>
              <option>2nd</option>
            </select>
            <select
              className="bg-white rounded-lg p-2 mr-2"
              onChange={(e) => {
                setSection(e.target.value);
              }}
            >
              <option defaultChecked>Select section</option>
              <option>Cybersecurity</option>
              <option>AI/DS A</option>
              <option>AI/DS B</option>
              <option>AI/DS C</option>
              <option>IoT A</option>
              <option>IoT B</option>
              <option>Bcom PA</option>
              <option>Bcom</option>
            </select>
            <button className="bg-green-500 justfiy-center items-center rounded-lg p-2" onClick={generateTimeTable}>
              Generate timetable
            </button>
          </div>
          <div className="mt-12 ml-12 flex flex-col items-center bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-4 rounded-lg px-2">
              <div className=" flex flex-col items-center rounded-lg">
                <div className="w-24  h-8 flex items-center justify-center border bg-[#909090] rounded-lg mr-1">
                  Slot
                </div>
                <div className="w-24  h-8 flex items-center justify-center border bg-[#909090] rounded-lg mr-1">
                  Day
                </div>
              </div>
              <div className="flex gap-1">
                {["1", "2", "Break", "3", "4", "Lunch", "5", "6", "7"].map(
                  (slot, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 flex items-center justify-center bg-[#bfc0c0] rounded-lg "
                    >
                      {slot}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col gap-1 rounded-lg mr-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                  <div
                    key={index}
                    className="w-24 h-16 flex items-center justify-center border bg-[#bfc0c0] rounded-lg mb-1"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-8 grid-rows-6 rounded-lg gap-1">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {Array.from({ length: 8 }).map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="w-24 h-16 bg-[#dfdfdf] rounded-lg "
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}