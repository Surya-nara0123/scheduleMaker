"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import SVGStar from "../Components/star";
import { generatePDF } from "./print.jsx";
import { startProcess } from "./algo.jsx";


export default function Table() {
  const year1 = [
    "8.10-9.00",
    "9.00-9.50",
    "break",
    "10.10-11.00",
    "11.00-11.50",
    "Lunch",
    "12.50-1.40",
    "1.40-2.30",
    "break",
    "2.40-3.30",
  ];
  const [timetableData, setTimetableData] = useState([]);
  const printOutput = async () => {
    let a = await startProcess();
    setTimetableData(a);
  };
  const genPDF = (classTitle) => {
    let temp = {}
    temp[classTitle] = timetableData[classTitle];
    generatePDF(temp);
  };
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <Sidebar />
      <div className="flex ml-12">
        <div className="">
          <div className="mt-16 font-semibold ml-12 text-4xl">Time Table</div>
          <div className="bg-white h-0.5 w-1/2 mt-1 ml-12"></div>
          <div className="m-5 items-center justify-center p-3 ml-10">
          </div>
          {Object.keys(timetableData).map((dataa, index) => (
            <div className="mt-12 ml-12 flex flex-col items-center bg-white p-4 rounded-lg">
              <div className="font-black mr-auto ml-2 text-2xl">{dataa.replace("B_Tech", "B.Tech")}</div>
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
                  { index <= 5 ? year1.map((slot, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 flex items-center justify-center bg-[#bfc0c0] rounded-lg "
                    >
                      {slot}
                    </div>
                  )): [
                    "8.10-9.00",
                    "9.00-9.50",
                    "9.50-10.40",
                    "break",
                    "11.00-11.50",
                    "11.50-12.40",
                    "Lunch",
                    "1.40-2.30",
                    "break",
                    "2.40-3.30",
                  ].map((slot, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 flex items-center justify-center bg-[#bfc0c0] rounded-lg "
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col gap-1 rounded-lg mr-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                    <div
                      key={index}
                      className="w-24 h-16 flex items-center justify-center border bg-[#bfc0c0] rounded-lg"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-rows-5 rounded-lg gap-1 grid-flow-col">
                  {Array.from({ length: year1.length }).map((_, colIndex) => (
                    <>
                      {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <div
                          key={colIndex + rowIndex}
                          className="w-24 h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[10px]"
                        >
                          {timetableData[dataa][rowIndex][colIndex] != "b" &&
                          timetableData[dataa][rowIndex][colIndex] != "l" ? (
                            <div className="text-center w-full h-full items-center justify-center flex font-bold">
                              {timetableData[dataa][rowIndex][colIndex]}
                            </div>
                          ) : timetableData[dataa][rowIndex][colIndex] ==
                            "b" ? (
                            <div className="text-center w-full h-full items-center justify-center flex font-bold">
                              Break
                            </div>
                          ) : (
                            <div className="text-center w-full h-full items-center justify-center flex font-bold">
                              Lunch
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </div>
              <button
                className="bg-blue-500 p-3 rounded-lg ml-auto mt-3 mr-2"
                onClick={() => {
                  genPDF(dataa);
                }}
              >
                PRINT
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
