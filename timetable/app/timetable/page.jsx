"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import SVGStar from "../Components/star";
import { generatePDF } from "./print.jsx";
import { startProcess } from "./algo.jsx";
import Papa from 'papaparse';

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
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const createDictionary_class = (data) => {
    const dictionary = {};
    let currentSection = '';
    let check = true;

    data.forEach(row => {
      if (row.length === 1) {
        currentSection = row[0].trim();
        dictionary[currentSection] = [];
      } else if (row.length === 4) {
        if (row[0] === "Course" && row[1] === "Credits" && row[2] === "Type" && row[3] === "Professor") {
          return;
        }
        dictionary[currentSection].push([row[0].trim(), parseInt(row[1]), row[2].trim(), row[3].trim()]);
      } else {
        check = false;
        return;
      }
    });
    if(!check){
      return {}
    }
    return dictionary;
  };

  const createList_labs = (data) => {
    const labs = [];
    let check = true;
    data.forEach(row => {
      if(row.length != 1){
        check = false
        return;
      }
      labs.push(row[0])
    })
    if(!check){
      return [];
    }
    return labs;
  }

  const creatDictionary_proff = (data) => {
    const proffs_to_short = {}
    let check = true;
    data.forEach(row => {
      if(row.length != 2){
        check = false
        return;
      }
      proffs_to_short[row[0]] = row[1]
    })
    if(!check){
      return {}
    }
    return proffs_to_short;
  }

  const createList_proffs = (data) => {
    const proffs_names = []
    let check = true
    data.forEach(row => {
      if(row.length != 1){
        check = false
        return;
      }
      proffs_names.push(row[0]);
    })
    if(!check){}
    return proffs_names;
  }

  const printOutput = async () => {
    if (file1 && file2 && file3 && file4) {
      let index = 0
      const processFiles = [file1, file2, file3, file4];
      let done_files = []
      let results = []
      for (const file of processFiles) {
        let file_name = file.name;
        if (done_files.includes(file_name)) {
          alert("Repeating Files!!");
          return
        } else {
          done_files.push(file_name);
        }
        const result = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            const text = e.target.result;
            Papa.parse(text, {
              header: false,
              skipEmptyLines: true,
              complete: function (results) {
                const data = results.data;
                let dictionary = {}
                if (index === 0) {
                  dictionary = createDictionary_class(data);
                } else if (index === 1) {
                  dictionary = createList_labs(data);
                } else if (index === 2) {
                  dictionary = createList_proffs(data);
                } else {
                  dictionary = creatDictionary_proff(data);
                }
                resolve(dictionary);
              }
            });
          };
          reader.readAsText(file);
        });
        if ((Array.isArray(result) && result.length === 0) || result == {}) {
          alert("Improper File = " + file_name);
          return;
        }
        results.push(result);
        index += 1
      }
      let class_courses = {};
      let professors = [];
      let proffs_names_to_short = {};
      let labs = [];

      for (const index in results) {
        let thing = results[index];
        if (typeof thing === 'object' && !Array.isArray(thing)) {
          let keys = Object.keys(thing);
          if (keys[0].includes("Year")) {
            class_courses = JSON.parse(JSON.stringify(thing));
          } else {
            proffs_names_to_short = JSON.parse(JSON.stringify(thing));
          }
        } else if (Array.isArray(thing)) {
          if (thing[0].includes("LAB")) {
            labs = JSON.parse(JSON.stringify(thing));
          } else {
            professors = JSON.parse(JSON.stringify(thing));
          }
        }
      }
      let a = await startProcess(class_courses, professors, proffs_names_to_short, labs);
      setTimetableData(a);
    } else {
      alert("Please upload all 4 CSV files.");
    }
  };

  const genPDF = (classTitle) => {
    let temp = {}
    temp[classTitle] = timetableData[classTitle];
    generatePDF(temp);
  };

  return (
    <main className="w-fit md:w-full min-h-screen bg-[#B4D2E7]">
      <Sidebar/>
      <div className="flex md:ml-12 p-2">
        <div className="">
          <div className="mt-16 font-semibold ml-12 text-4xl">Time Table</div>
          <div className="bg-white h-0.5 w-1/2 mt-1 ml-12"></div>
          <div className="m-5 items-center justify-center p-3 ml-10">
            <div className="mt-8 flex flex-wrap w-full">
              <div className="w-full md:w-auto mb-4">
                <label className="block mb-2">Class to Courses</label>
                <input
                  className="rounded-lg p-2 w-full"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, setFile1)}
                />
              </div>
              <div className="w-full md:w-auto mb-4">
                <label className="block mb-2">Labs</label>
                <input
                  className="rounded-lg p-2 w-full"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, setFile2)}
                />
              </div>
              <div className="w-full md:w-auto mb-4">
                <label className="block mb-2">Professors Names</label>
                <input
                  className="rounded-lg p-2 w-full"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, setFile3)}
                />
              </div>
              <div className="w-full md:w-auto mb-4">
                <label className="block mb-2">Professor's Shortform</label>
                <input
                  className="rounded-lg p-2 w-full"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, setFile4)}
                />
              </div>
            </div>
            <button className="bg-green-500 justify-center items-center rounded-lg p-2" onClick={printOutput}>Generate Timetable</button>
          </div>
          {Object.keys(timetableData).map((dataa, index) => (
            <div className="md:mt-12 md:ml-12 flex flex-col items-center bg-white p-4 rounded-lg">
              <div className="font-black mr-auto ml-2 text-2xl mb-3">{dataa.replace("B_Tech", "B.Tech")}</div>
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
                  {index <= 5 ? year1.map((slot, index) => (
                    <div
                      key={index}
                      className="md:w-24 md:h-16 flex items-center w-12 h-8 text-[7px] md:text-sm justify-center bg-[#bfc0c0] rounded-lg "
                    >
                      {slot}
                    </div>
                  )) : [
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
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                    <div
                      key={index}
                      className="w-12 h-8 md:w-24 md:h-16 flex text-[7px] md:text-sm items-center justify-center border bg-[#bfc0c0] rounded-lg"
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
                          className="w-12 h-8 md:w-24 md:h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
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
