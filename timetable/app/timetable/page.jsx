"use client";

import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import Sidebar from "../Components/Sidebar";

const pb = new PocketBase("https://snuc.pockethost.io");

export default function Home() {
  const [proffTimetable, setProffTimetable] = useState([]);
  const [currentTab, setCurrentTab] = useState("Student");
  const [classYear, setClassYear] = React.useState("");
  const [timetableData, setTimetable] = React.useState([]);
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

  const fetchTimetable = async () => {
    try {
      const record = await pb.collection("timetable").getFullList();
      console.log(record[0].timetable[classYear]);
      setTimetable(record[0].timetable);
      setProffTimetable(record[1].timetable);
    } catch (e) {}
  };

  const [loggedin, setLoggedin] = React.useState(false);

  useEffect(() => {
    fetchTimetable();
    const model = pb.authStore.model;
    if (!model) {
      setLoggedin(false);
    } else {
      setLoggedin(true);
      if (model.isStudent == true) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    }
  }, []);

  const [proff, setProff] = useState({});

  return (
    <main className="min-h-screen bg-[#B4D2E7] select-none">
      {loggedin ? (
        <div className="flex">
          <Sidebar />
          <div className=" ml-12">
            <div className="mt-16 font-semibold ml-12 text-4xl">
              Home
              <div className="bg-white h-0.5 w-1/2 mt-1"></div>
            </div>
            <div className="flex ml-12 font-mono mt-3">
              {currentTab == "Student" ? (
                <div
                  className={
                    "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                  }
                  onClick={() => setCurrentTab("Student")}
                >
                  Student
                </div>
              ) : (
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setCurrentTab("Student")}
                >
                  Student
                </div>
              )}
              {currentTab == "Professor" ? (
                <div
                  className={
                    "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                  }
                  onClick={() => setCurrentTab("Professor")}
                >
                  Professor
                </div>
              ) : (
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setCurrentTab("Professor")}
                >
                  Professor
                </div>
              )}
            </div>
            {currentTab == "Student" ? (
              <>
                <div className="flex gap-8 ml-12 mt-8">
                  <select
                    className="bg-white rounded-lg p-2"
                    onChange={(e) => {
                      setClassYear(e.target.value);
                    }}
                  >
                    <option defaultChecked>Select your branch</option>
                    <option>1st Year B_Tech AIDS Section A</option>
                    <option>1st Year B_Tech AIDS Section B</option>
                    <option>1st Year B_Tech AIDS Section C</option>
                    <option>1st Year B_Tech IoT Section A</option>
                    <option>1st Year B_Tech IoT Section B</option>
                    <option>1st Year B_Tech Cyber Security</option>
                    <option>2st Year B_Tech AIDS Section A</option>
                    <option>2st Year B_Tech AIDS Section B</option>
                    <option>2st Year B_Tech AIDS Section C</option>
                    <option>2st Year B_Tech IoT Section A</option>
                    <option>2st Year B_Tech IoT Section B</option>
                    <option>2st Year B_Tech Cyber Security</option>
                  </select>
                </div>
                {Object.keys(timetableData).map(
                  (dataa, index) =>
                    dataa == classYear && (
                      <div className="md:mt-6 md:ml-14 flex flex-col items-center bg-white p-4 rounded-lg">
                        <div className="font-black mr-auto ml-2 text-2xl mb-3">
                          {dataa.replace("B_Tech", "B.Tech")}
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
                            {index <= 5
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
                        </div>
                        <div className="flex">
                          <div className="flex flex-col gap-1 rounded-lg mr-1">
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map(
                              (day, index) => (
                                <div
                                  key={index}
                                  className="w-12 h-8 md:w-24 md:h-16 flex text-[7px] md:text-sm items-center justify-center border bg-[#bfc0c0] rounded-lg"
                                >
                                  {day}
                                </div>
                              ),
                            )}
                          </div>
                          <div className="grid grid-rows-5 rounded-lg gap-1 grid-flow-col">
                            {Array.from({ length: year1.length }).map(
                              (_, colIndex) => (
                                <>
                                  {Array.from({ length: 5 }).map(
                                    (_, rowIndex) => (
                                      <div
                                        key={colIndex + rowIndex}
                                        className="w-12 h-8 md:w-24 md:h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                      >
                                        {timetableData[dataa][rowIndex][
                                          colIndex
                                        ] != "b" &&
                                        timetableData[dataa][rowIndex][
                                          colIndex
                                        ] != "l" ? (
                                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                            {
                                              timetableData[dataa][rowIndex][
                                                colIndex
                                              ]
                                            }
                                          </div>
                                        ) : timetableData[dataa][rowIndex][
                                            colIndex
                                          ] == "b" ? (
                                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                            Break
                                          </div>
                                        ) : (
                                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                            Lunch
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                )}
              </>
            ) : (
              <>
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
                      .sort(
                        (a, b) =>
                          a.replace("Proff", "") - b.replace("Proff", ""),
                      )
                      .map((key, index) => (
                        <option key={index}>{key}</option>
                      ))}
                  </select>
                </div>
                {Object.keys(proffTimetable).map(
                  (dataa, index) =>
                    dataa == Object.keys(proff)[0] && (
                      <div
                        className="md:mt-6 md:ml-14 flex flex-col items-center bg-white p-4 rounded-lg"
                        key={index}
                      >
                        <div className="font-black mr-auto ml-2 text-2xl mb-3">
                          {dataa.replace("B_Tech", "B.Tech")}
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
                            {proff[dataa][0][2] == "Break"
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
                        </div>
                        <div className="flex">
                          <div className="flex flex-col gap-1 rounded-lg mr-1">
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map(
                              (day, index) => (
                                <div
                                  key={index}
                                  className="w-12 h-8 md:w-24 md:h-16 flex text-[7px] md:text-sm items-center justify-center border bg-[#bfc0c0] rounded-lg"
                                >
                                  {day}
                                </div>
                              ),
                            )}
                          </div>
                          <div className="grid grid-rows-5 rounded-lg gap-1 grid-flow-col">
                            {Array.from({ length: year1.length }).map(
                              (_, colIndex) => (
                                <>
                                  {Array.from({ length: 5 }).map(
                                    (_, rowIndex) => (
                                      <div
                                        key={colIndex + rowIndex}
                                        className="w-12 h-8 md:w-24 md:h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                      >
                                        {proff[dataa][rowIndex][colIndex] !=
                                          "b" &&
                                        proff[dataa][rowIndex][colIndex] !=
                                          "l" ? (
                                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                            {proff[dataa][rowIndex][colIndex]}
                                          </div>
                                        ) : proff[dataa][rowIndex][colIndex] ==
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
                                    ),
                                  )}
                                </>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <Sidebar />
        </>
      )}
    </main>
  );
}
