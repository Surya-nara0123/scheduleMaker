"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar.tsx";
import { generatePDF } from "./print.jsx";
import { randomize } from "./algo.jsx";
import Papa from "papaparse";
import PocketBase from "pocketbase";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


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

  const [table, setTable] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const [timetableData, setTimetableData] = useState([]);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);
  const [profData, setProfData] = useState([]);
  const [parameter, setParameter] = useState([]);

  const handleParameterChange = (e) => {
    setParameter(e.target.value);
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const createDictionary_class = (data) => {
    const dictionary = {};
    let currentSection = "";
    let check = true;

    data.forEach((row) => {
      let count = 0;
      for (let i = 0; i < row.length; i++) {
        if (row[i] != "") {
          count++;
        }
      }
      if (count === 1) {
        currentSection = row[0].trim();
        dictionary[currentSection] = [];
      } else if (row.length === 4) {
        // console.log(row)
        if (
          row[0] === "Course" &&
          row[1] === "Credits" &&
          row[2] === "Type" &&
          row[3] === "Professor"
        ) {
          return;
        }
        dictionary[currentSection].push([
          row[0].trim(),
          parseInt(row[1]),
          row[2].trim(),
          row[3].trim(),
        ]);
      } else {
        check = false;
        return;
      }
    });
    if (!check) {
      return {};
    }
    return dictionary;
  };

  const createList_labs = (data) => {
    const labs = [];
    let check = true;
    data.forEach((row) => {
      if (row.length != 1) {
        check = false;
        return;
      }
      labs.push(row[0]);
    });
    if (!check) {
      return [];
    }
    return labs;
  };

  const creatDictionary_proff = (data) => {
    const proffs_to_short = {};
    let check = true;
    data.forEach((row) => {
      if (row.length != 2) {
        check = false;
        return;
      }
      proffs_to_short[row[0]] = row[1];
    });
    if (!check) {
      return {};
    }
    return proffs_to_short;
  };

  const createList_proffs = (data) => {
    const proffs_names = [];
    let check = true;
    data.forEach((row) => {
      if (row.length != 1) {
        check = false;
        return;
      }
      proffs_names.push(row[0]);
    });
    if (!check) {
    }
    return proffs_names;
  };

  const parseCSVFiles = async (files) => {
    let done_files = new Set();
    let results = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const file_name = file.name;

      if (done_files.has(file_name)) {
        alert("Repeating Files!!");
        return null;
      } else {
        done_files.add(file_name);
      }

      const result = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          Papa.parse(text, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
              const data = results.data;
              let dictionary = {};

              switch (index) {
                case 0:
                  dictionary = createDictionary_class(data);
                  break;
                case 1:
                  dictionary = createList_labs(data);
                  break;
                case 2:
                  dictionary = createList_proffs(data);
                  break;
                case 3:
                  dictionary = creatDictionary_proff(data);
                  break;
                default:
                  reject(new Error("Invalid index"));
              }

              resolve(dictionary);
            },
          });
        };
        reader.readAsText(file);
      });

      if (
        (Array.isArray(result) && result.length === 0) ||
        Object.keys(result).length === 0
      ) {
        alert("Improper File = " + file_name);
        return null;
      }
      results.push(result);
    }

    let class_courses = {};
    let professors = [];
    let proffs_names_to_short = {};
    let labs = [];

    results.forEach((thing) => {
      if (typeof thing === "object" && !Array.isArray(thing)) {
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
    });

    return { class_courses, professors, proffs_names_to_short, labs };
  };

  const printOutput = async () => {
    if (!(file1 && file2 && file3 && file4)) {
      alert("Please upload all 4 CSV files.");
      return;
    }

    const processFiles = [file1, file2, file3, file4];
    const results = await parseCSVFiles(processFiles);
    // console.log(results)

    if (!results) {
      return;
    }

    const { class_courses, professors, proffs_names_to_short, labs } = results;

    //class_courses, professors, proff_to_short, labs, initial_lectures, locked_classes, proffs_initial_timetable, classes_initial_timetable is syntax

    let tables = randomize(
      class_courses,
      professors,
      proffs_names_to_short,
      labs,
      parameter,
      [],
      {},
      {}
    );
    if (Object.keys(tables).length === 0) {
      alert(
        "Error in timetable generation!! Please contact the developer via the discord handle 'DrunkenCloud' or https://discord.gg/wwN64wD4 in this discord server.",
      );
      return;
    }
    let a = tables[0];
    let b = tables[1];
    setTable(a);

    console.log("a: ", a);
    console.log("b: ", b);

    setProfData(b);
    setTimetableData(a);

    setIsGenerated(true);
  };

  const convertDetails = async (classTitle) => {
    if (!(file1 && file2 && file3 && file4)) {
      alert("Please upload all 4 CSV files.");
      return;
    }

    const processFiles = [file1, file2, file3, file4];
    const results = await parseCSVFiles(processFiles);

    if (!results) {
      return;
    }

    const { class_courses, professors, proffs_names_to_short, labs } = results;

    let course = class_courses[classTitle];
    let proffDetails = [];

    for (let i = 0; i < course.length; i++) {
      let temp = {};
      temp[course[i][0]] = [
        course[i][0],
        course[i][3],
        proffs_names_to_short[course[i][3]],
        "HS",
        3,
      ];
      proffDetails.push(temp);
    }
    // console.log(proffDetails);
    return proffDetails;
  };

  const genPDF = async (classTitle) => {
    let temp = {};
    let a = await convertDetails(classTitle);
    temp[classTitle] = timetableData[classTitle];
    await generatePDF(temp, a);
  };

  const genPDFall = async () => {
    let zip = new JSZip();
    let count = 0;
    for (let key in timetableData) {
      let temp = {};
      let a = convertDetails(key);
      temp[key] = timetableData[key];
      let pdf = await generatePDF(temp, a);
      zip.file(key + ".pdf", pdf);
      count++;
    }
    if (count == 0) {
      alert("No Timetables to save");
      return;
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "Timetables.zip");
    });
  };

  const saveTimeTable = async () => {
    console.log(timetableData);
    console.log(profData);
  };

  const [isLoggedin, setLoggedin] = useState(false);
  const [currentYear, setCurrentYear] = useState("1st Year");
  const [currentSection, setCurrentSection] = useState("AIDS Section A");

  useEffect(() => {
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
              <div className="py-6">
                <h1>
                  Paramters (format :{" "}
                  <pre>
                    [[class, course code, professor, day, slot], [class, course
                    code, professor, day, slot], [class, course code, professor,
                    day, slot] etc ]
                  </pre>
                  )
                </h1>
                <input
                  type="text"
                  id="parameter"
                  placeholder="Parameters"
                  className="p-2 rounded-lg font-mono"
                ></input>
                <button
                  className="rounded-lg border p-2 ml-4 text-white font-mono"
                  onClick={handleParameterChange}
                >
                  Save Parameter
                </button>
              </div>
              <div className="bg-white h-[3px] w-[800px] mt-1 mb-2"></div>
              <div className="flex">
                <button
                  className="bg-green-500 justify-center items-center rounded-lg p-2"
                  onClick={printOutput}
                >
                  Generate Timetable
                </button>
                <button
                  className="bg-blue-500 justify-center items-center rounded-lg p-2 ml-2"
                  onClick={genPDFall}
                >
                  Save All Timetables
                </button>
                <button
                  className="bg-gray-500 justify-center items-center rounded-lg p-2 ml-2"
                  onClick={() => {
                    saveTimeTable();
                  }}
                >
                  Push to DB
                </button>
              </div>
            </div>

            {isGenerated && (
              <>
                <div>
                  <div className="flex ml-12 font-mono mt-3">
                    {currentYear == "2nd Year" ? (
                      <div
                        className={
                          "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                        }
                        onClick={() => setCurrentYear("2nd Year")}
                      >
                        2<sup>nd</sup> Year
                      </div>
                    ) : (
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setCurrentYear("2nd Year")}
                      >
                        2<sup>nd</sup> Year
                      </div>
                    )}
                    {currentYear == "3rd Year" ? (
                      <div
                        className={
                          "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                        }
                        onClick={() => setCurrentYear("2nd Year")}
                      >
                        3<sup>rd</sup> Year
                      </div>
                    ) : (
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setCurrentYear("3rd Year")}
                      >
                        3<sup>rd</sup> Year
                      </div>
                    )}
                    {currentYear == "4th Year" ? (
                      <div
                        className={
                          "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                        }
                        onClick={() => setCurrentYear("4th Year")}
                      >
                        4<sup>th</sup> Year
                      </div>
                    ) : (
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setCurrentYear("4th Year")}
                      >
                        4<sup>th</sup> Year
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
                {Object.keys(timetableData).map(
                  (dataa, index) =>
                    dataa == (currentYear + " B_Tech " + currentSection) && (
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
                                      <>
                                        {timetableData[dataa][rowIndex][
                                          colIndex
                                        ] != "Break" &&
                                          timetableData[dataa][rowIndex][
                                          colIndex
                                          ] != "Lunch" ? (
                                          <div
                                            key={colIndex + rowIndex}
                                            className="w-12 h-8 md:w-24 md:h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                          >{timetableData[dataa][rowIndex][
                                            colIndex
                                          ] != "Self-Learning" ? (
                                            <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                              {
                                                timetableData[dataa][rowIndex][
                                                colIndex
                                                ]
                                              }
                                            </div>
                                          ) : (
                                            <div className=" text-blue-700 text-center w-full h-full items-center justify-center flex font-bold">
                                              {
                                                timetableData[dataa][rowIndex][
                                                colIndex
                                                ]
                                              }
                                            </div>
                                          )}
                                          </div>
                                        ) : timetableData[dataa][rowIndex][
                                          colIndex
                                        ] == "Break" ? (
                                          <div
                                            key={colIndex + rowIndex}
                                            className="w-12 h-8 md:w-24 md:h-16 bg-[#606060] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                          >
                                            <div className="text-white text-center w-full h-full items-center justify-center flex font-bold">
                                              Break
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            key={colIndex + rowIndex}
                                            className="w-12 h-8 md:w-24 md:h-16 bg-[#606060] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                          >
                                            <div className="text-white text-center w-full h-full items-center justify-center flex font-bold">
                                              Lunch
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ),
                                  )}
                                </>
                              ),
                            )}
                          </div>
                        </div>
                        <button
                          className="bg-blue-500 p-3 rounded-lg ml-auto mt-3 mr-2"
                          onClick={() => {
                            genPDF(currentYear + " B_Tech " + currentSection);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ),
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
