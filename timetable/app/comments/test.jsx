"use client";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import PocketBase from "pocketbase";
import { Comment } from "../Components/Comment.jsx";
const pb = new PocketBase("https://snuc.pockethost.io");

export default function Table() {
  const year1 = [
    "8.10-9.00",
    "9.00-9.50",
    "Break",
    "10.10-11.00",
    "11.00-11.50",
    "Lunch",
    "12.50-1.40",
    "1.40-2.30",
    "Break",
    "2.40-3.30",
  ];
  const [timetableData, setTimetableData] = useState([]);
  const [proffTimetable, setProffTimetable] = useState([]);

  const [isLoggedin, setLoggedin] = useState(false);
  const [currentYear, setCurrentYear] = useState("1st Year");
  const [currentSection, setCurrentSection] = useState("AIDS Section A");
  const fetchTimetable = async () => {
    const record = await pb.collection("timetable").getFullList();
    setProffTimetable(record[1].timetable);
  };

  useEffect(() => {
    //console.log(pb.authStore.model.isStudent);
    const model = pb.authStore.model;
    if (!model) {
      setLoggedin(false);
    } else {
      setLoggedin(true);
      if (model.isAdmin == true) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    }
  }, []);

  return (
    <main className="w-fit md:w-full min-h-screen bg-[#B4D2E7]">
      <Sidebar />
      {isLoggedin ? (
        <div className="flex md:ml-12 p-2">
          <div className="">
            <div className="mt-16 font-semibold ml-12 text-4xl">
              Time Table Generator
            </div>
            <div className="bg-white h-[3px] w-[800px] mt-1 ml-12 mb-2"></div>
            <div className="m-5 items-center justify-center p-3 ml-10">
              {/* <div className="bg-white h-[3px] w-[800px] mt-1 mb-2"></div> */}
            </div>
            <div>
              <div className="flex ml-12 font-mono mt-3">
                {currentYear == "1st Year" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentYear("1st Year")}
                  >
                    1<sup>st</sup> Year
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentYear("1st Year")}
                  >
                    1<sup>st</sup> Year
                  </div>
                )}
                {currentYear == "2st Year" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentYear("2st Year")}
                  >
                    2<sup>st</sup> Year
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentYear("2st Year")}
                  >
                    2<sup>st</sup> Year
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex ml-12 font-mono mt-3">
                {currentSection == "AIDS Section A" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("AIDS Section A")}
                  >
                    AIDS Section A
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("AIDS Section A")}
                  >
                    AIDS Section A
                  </div>
                )}
                {currentSection == "AIDS Section B" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("AIDS Section B")}
                  >
                    AIDS Section B
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("AIDS Section B")}
                  >
                    AIDS Section B
                  </div>
                )}
                {currentSection == "AIDS Section C" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("AIDS Section C")}
                  >
                    AIDS Section C
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("AIDS Section C")}
                  >
                    AIDS Section C
                  </div>
                )}
                {currentSection == "IoT Section A" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("IoT Section A")}
                  >
                    IoT Section A
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("IoT Section A")}
                  >
                    IoT Section A
                  </div>
                )}
                {currentSection == "IoT Section B" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("IoT Section B")}
                  >
                    IoT Section B
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("IoT Section B")}
                  >
                    IoT Section B
                  </div>
                )}
                {currentSection == "Cyber Security" ? (
                  <div
                    className={
                      "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                    }
                    onClick={() => setCurrentSection("Cyber Security")}
                  >
                    Cyber Security
                  </div>
                ) : (
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setCurrentSection("Cyber Security")}
                  >
                    Cyber Security
                  </div>
                )}
              </div>
            </div>
            <>
              <div className="md:mt-12 md:ml-12 flex flex-col items-center bg-white p-4 rounded-lg">
                <div className="font-black mr-auto ml-2 text-2xl mb-3">
                  {(currentYear + " B_Tech " + currentSection).replace(
                    "B_Tech",
                    "B.Tech",
                  )}
                </div>
                <div className="flex items-center mb-4 rounded-lg px-2">
                  <div className=" flex flex-col items-center rounded-lg">
                    <div className="md:w-24 md:h-8 w-12 h-4 flex text-[7px] md:text-sm items-center justify-center border bg-[#909090] rounded-lg mr-1">
                      Slot
                    </div>
                    <div className="md:w-24 md:h-8 w-12 h-4 flex text-[7px] md:text-sm items-center justify-center border bg-[#909090] rounded-lg mr-1">
                      Day
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {currentYear == "1st Year"
                      ? year1.map((slot, index) => (
                          <div
                            key={index}
                            className="md:w-24 md:h-16 flex items-center w-12 h-8 text-[7px] md:text-sm justify-center bg-[#bfc0c0] rounded-lg "
                          >
                            {slot}
                          </div>
                        ))
                      : [
                          "8.10-9.00",
                          "9.00-9.50",
                          "9.50-10.40",
                          "Break",
                          "11.00-11.50",
                          "11.50-12.40",
                          "Lunch",
                          "1.40-2.30",
                          "Break",
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
                </div>
                <div className="flex">
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
                <button
                  className="bg-blue-500 p-3 rounded-lg ml-auto mt-3 mr-2"
                  onClick={fetchTimetable}
                >
                  Fetch
                </button>
              </div>
            </>
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
