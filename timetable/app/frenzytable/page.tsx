import Image from "next/image";
import Link from "next/link";
import React from "react";
import Sidebar from "../Components/Sidebar";
import SVGStar from "../Components/star";

export default function Table() {
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <div className="flex">
        <Sidebar />
        <div className="">
          <div className="mt-16 font-semibold ml-12 text-4xl">
            Time Table
            <div className="bg-white h-0.5 w-1/2 mt-1"></div>
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
                {["1", "2", "3", "4", "Break", "5", "6", "7"].map(
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 flex items-center justify-center border bg-[#bfc0c0] rounded-lg mb-1"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-8 grid-rows-6 rounded-lg gap-1">
                {Array.from({ length: 6 }).map((_, rowIndex) => (
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
