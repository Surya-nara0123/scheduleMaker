"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://snuc.pockethost.io");

export default function ProffessorRoute() {
  const [proffTimetable, setProffTimetable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const fetchTimetable = async () => {
    try {
      const record = await pb.collection("timetable").getFullList();
      console.log(record[1].timetable);
      setProffTimetable(record[1].timetable);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    try {
      fetchTimetable();
    } catch (e) {
      console.log(e);
    }
  }, []);
  const [proff, setProff] = useState({});
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <div className="flex">
        <Sidebar />
        <div className=" ml-12">
          <div className="mt-16 font-semibold ml-12 text-4xl">
            Home
            <div className="bg-white h-0.5 w-1/2 mt-1"></div>
          </div>
          <div className="flex gap-8 ml-12 mt-8">
            <select
              className="bg-white rounded-lg p-2"
              onChange={(e) => {
                let temp = {};
                temp[e.target.value] = proffTimetable[e.target.value];
                console.log(temp);
                setProff(temp);
              }}
            >
              <option defaultChecked>Select your class or course</option>
              {Object.keys(proffTimetable)
                .sort((a, b) => a.replace("Proff", "") - b.replace("Proff", ""))
                .map((key, index) => (
                  <option key={index}>{key}</option>
                ))}
            </select>
            <button
              className="bg-green-500 justify-center items-center rounded-lg p-2"
              onClick={() => {
                setShowTable(true);
              }}
            >
              Show Timetable
            </button>
          </div>
          {showTable && (
            <div className=" mt-3 flex flex-col  justify-center p-3">
              <div className="bg-white bg-fit">
                <div className="flex gap-1 mb-2">
                  <div className=" flex flex-col items-center rounded-lg">
                    <div className="md:w-24 md:h-8 w-12 h-4 flex text-[7px] md:text-sm items-center justify-center border bg-[#909090] rounded-lg mr-1">
                      Slot
                    </div>
                    <div className="md:w-24 md:h-8 w-12 h-4 flex text-[7px] md:text-sm items-center justify-center border bg-[#909090] rounded-lg mr-1">
                      Day
                    </div>
                  </div>
                  {[
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
                      className="w-12 h-8 md:w-24 md:h-16 flex items-center text-[7px] md:text-sm justify-center bg-[#bfc0c0] rounded-lg "
                    >
                      {slot}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1 rounded-lg mr-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                    <div
                      key={index}
                      className="w-12 h-8 md:w-24 md:h-16 flex text-[7px] md:text-sm items-center justify-center border bg-[#bfc0c0] rounded-lg"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
