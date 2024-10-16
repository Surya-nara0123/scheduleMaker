"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar.tsx";
import { generatePDF } from "./print.jsx";
import { randomize } from "./algo.jsx";
import Papa from "papaparse";
import PocketBase from "pocketbase";
import { saveAs } from 'file-saver';

let classSwaps = [];

function format_timetables(timetable_classes_, timetable_professors_, timetable_labs_, proff_to_year, proff_to_short) {
  let timetable_classes = JSON.parse(JSON.stringify(timetable_classes_));
  let timetable_professors = JSON.parse(JSON.stringify(timetable_professors_));
  let timetable_labs = JSON.parse(JSON.stringify(timetable_labs_));
  for (let clas of Object.keys(timetable_classes)) {
    if (clas.slice(0, 1) === "1") {
      for (let day = 0; day < 5; day++) {
        timetable_classes[clas][day].splice(2, 0, "Break")
        timetable_classes[clas][day].splice(8, 0, "Break")
      }
    } else {
      for (let day = 0; day < 5; day++) {
        timetable_classes[clas][day].splice(3, 0, "Break")
        timetable_classes[clas][day].splice(8, 0, "Break")
      }
    }
  }
  for (let prof of Object.keys(timetable_professors)) {
    if (proff_to_year[prof] === "1") {
      for (let day = 0; day < 5; day++) {
        timetable_professors[prof][day].splice(2, 0, "Break")
        timetable_professors[prof][day].splice(8, 0, "Break")
      }
    } else if (proff_to_year[prof] === "2") {
      for (let day = 0; day < 5; day++) {
        timetable_professors[prof][day].splice(3, 0, "Break")
        timetable_professors[prof][day].splice(8, 0, "Break")
      }
    } else {
      for (let day = 0; day < 5; day++) {
        if (timetable_professors[prof][day][2] === "") {
          timetable_professors[prof][day].splice(2, 0, "Break")
        } else if (timetable_professors[prof][day][2][1].slice(0, 1) === "1") {
          timetable_professors[prof][day].splice(2, 0, "Break")
        } else {
          timetable_professors[prof][day].splice(3, 0, "Break")
        }
        timetable_professors[prof][day].splice(8, 0, "Break")
      }
    }
  }

  for (let clas of Object.keys(timetable_classes)) {
    for (let day = 0; day < 5; day++) {
      for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
        if (typeof timetable_classes[clas][day][slot] === typeof "string") {
          continue
        } else {
          if (timetable_classes[clas][day][slot][0].includes("Self-Learning")) {
            timetable_classes[clas][day][slot] = "Self-Learning"
          } else {
            let result = ""
            for (let i of timetable_classes[clas][day][slot]) {
              if (i in proff_to_short) {
                result += proff_to_short[i];
              } else {
                result += i;
              }
              result += " "
            }
            timetable_classes[clas][day][slot] = result
          }
        }
      }
    }
  }

  for (let prof of Object.keys(timetable_professors)) {
    for (let day = 0; day < 5; day++) {
      for (let slot = 0; slot < timetable_professors[prof][day].length; slot++) {
        if (typeof timetable_professors[prof][day][slot] === typeof "string") {
          continue
        } else {
          let result = ""
          for (let i of timetable_professors[prof][day][slot]) {
            result += i
            result += " "
          }
          timetable_professors[prof][day][slot] = result
        }
      }
    }
  }

  for (let lab of Object.keys(timetable_labs)) {
    for (let day = 0; day < 5; day++) {
      for (let slot = 0; slot < timetable_labs[lab][day].length; slot++) {
        if (typeof timetable_labs[lab][day][slot] === typeof "string") {
          continue
        } else {
          let result = ""
          for (let i of timetable_labs[lab][day][slot]) {
            result += i
            result += " "
          }
          timetable_labs[lab][day][slot] = result
        }
      }
    }
  }

  return [timetable_classes, timetable_professors, timetable_labs]
}

function isSwappable(timetable_classes, timetable_professors, clas, day1, slot1, day2, slot2) {
  console.log(timetable_classes[clas][day1][slot1]);
  console.log(timetable_classes[clas][day2][slot2]);
  return ((is_free_professor(timetable_professors, timetable_classes[clas][day1][slot1][1], day2, slot2, clas)) && (is_free_professor(timetable_professors, timetable_classes[clas][day2][slot2][1], day1, slot1, clas)))
}

function is_free_professor(timetable_professors, proff, day, slot, clas) {
  if (timetable_professors[proff][day][slot] === "") {
      let clas_count = 0
      let period_count = 0;
      for (let i = 0; i < slot; i++) {
          if (typeof timetable_professors[proff][day][i] === typeof "Lunch") {
              continue;
          }
          if (timetable_professors[proff][day][i][1] === clas) {
              clas_count += 1;
          }
          period_count += 1;
      }
      return clas_count < 3 && period_count < 6;
  }
  return false
}

const pb = new PocketBase("https://snuc.pockethost.io");

export default function Table() {
  const [timetableClasses, setTimetableClasses] = useState({});
  const [timetableProfessors, setTimetableProfessors] = useState({});
  const [timetableLabs, setTimetableLabs] = useState({});
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
  const [timetablesForUsing, setAllTimetables] = useState([[], [], [], []]);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
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
  const handleEdit = (clas, c, r) => {
    document.getElementById("messages").innerHTML = ``;
    let tr = r;
    console.log(r);
    if (clas[0] != "1") {
      if (r > 2 && r < 6) {
        tr -= 1;
      } else if (r == 7) {
        tr = 6;
      } else if (r == 9) {
        tr = 7;
      }
    }
    for (let content of classSwaps) {
      if (content[0] != clas) {
        classSwaps = [];
        break;
      }
      if (content[0] == clas && content[1] == c && content[2] == tr) {
        document.getElementById("slot"+c+r).style.backgroundColor = "#dfdfdf";
        classSwaps.splice(classSwaps.indexOf(content), 1);
        return;
      }
    }
    if (timetablesForUsing[0][clas][c][tr].length > 2) {
      console.log(timetablesForUsing[0][clas][c][tr]);
      return;
    }
    console.log(timetablesForUsing[0][clas][c][tr]);
    console.log(clas, c, tr);
    if (classSwaps.length >= 2) {
      console.log(classSwaps);
      while (classSwaps.length >= 2) {
        let idkr = classSwaps[0][2];
        if (idkr >=3 && idkr <=5) {
          idkr += 1;
        } else if (idkr == 6) {
          idkr = 7;
        } else if (idkr == 7) {
          idkr = 9;
        }
        document.getElementById("slot"+classSwaps[0][1]+idkr).style.backgroundColor = "#dfdfdf";
        classSwaps = classSwaps.slice(1);
      }
    }
    document.getElementById("slot"+c+r).style.backgroundColor = "pink";
    classSwaps.push([clas, c, tr]);
    console.log(classSwaps);
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
        }
      }
    });
    let professors = Object.keys(proffs_names_to_short);
    return { class_courses, professors, proffs_names_to_short, labs };
  };

  const printOutput = async () => {
    if (!(file1 && file2 && file3)) {
      alert("Please upload all 4 CSV files.");
      return;
    }

    const processFiles = [file1, file2, file3];
    const results = await parseCSVFiles(processFiles);
    // console.log(results)

    if (!results) {
      return;
    }

    const { class_courses, professors, proffs_names_to_short, labs } = results;

    //class_courses, professors, proff_to_short, labs, initial_lectures, locked_classes, proffs_initial_timetable, classes_initial_timetable is syntax

    console.log([class_courses,
      professors,
      proffs_names_to_short,
      labs,
      parameter,
      lockedClasses,
      timetableProfessors,
      timetableClasses,
      timetableLabs]);
    const response = await fetch("/api/timetableGenrator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([class_courses,
        professors,
        proffs_names_to_short,
        labs,
        parameter,
        lockedClasses,
        timetableProfessors,
        timetableClasses,
        timetableLabs]),
    })
    const body = await response.json();
    console.log(body);
    const tables = body["result"];
    if (Object.keys(tables).length === 0) {
      alert(
        "Error in timetable generation!! Please contact the developer via the discord handle 'DrunkenCloud' or https://discord.gg/wwN64wD4 in this discord server.",
      );
      return;
    }
    await setTimetableProfessors(JSON.parse(JSON.stringify(tables[1])));
    await setTimetableClasses(JSON.parse(JSON.stringify(tables[0])));
    await setTimetableLabs(JSON.parse(JSON.stringify(tables[3])));
    let [a, b, c] = format_timetables(tables[0], tables[1], tables[3], tables[4], proffs_names_to_short);
    setTable(a);

    console.log("a: ", a);
    console.log("b: ", b);

    setProfData(b);
    setTimetableData(a);
    setAllTimetables([tables[0], tables[1], tables[3], tables[4], proffs_names_to_short]);

    setIsGenerated(true);
  };

  const convertDetails = async (classTitle) => {
    if (!(file1 && file2 && file3)) {
      alert("Please upload all 4 CSV files.");
      return;
    }

    const processFiles = [file1, file2, file3];
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
    return proffDetails;
  };
  
  const genPDF = async (classTitle) => {
    let temp = {};
    let a = await convertDetails(classTitle);
    temp[classTitle] = timetableData[classTitle];
    const pdf = await generatePDF(temp, a);
    const blob = new Blob([pdf], { type: "application/pdf" });
    saveAs(blob, classTitle + ".pdf");
  };

  const genCSV = async (classTitle) => {
    const timetable = timetableData[classTitle];
    if (!timetable) {
      alert(`No timetable found for ${classTitle}`);
      return;
    }

    const headers = Object.keys(timetable[0]);
    let csv = classTitle + '\n';
    csv += headers.join(",") + "\n";

    timetable.forEach(row => {
      csv += Object.values(row).map(value => {
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.search(/("|,|\n)/g) >= 0) value = `"${value}"`;
        }
        return value;
      }).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, classTitle + ".csv");
  };


  const genPDFall = async () => {
    function jsonToCsv(jsonObj) {
      // Extract headers
      const headers = Object.keys(jsonObj[Object.keys(jsonObj)[0]][0]);

      // Create a CSV string
      let csv = headers.join(',') + '\n';

      // Iterate over each section
      for (const section in jsonObj) {
        csv += section + '\n'
        jsonObj[section].forEach(row => {
          csv += Object.values(row).map(value => {
            // Escape commas and quotes
            if (typeof value === 'string') {
              value = value.replace(/"/g, '""');
              if (value.search(/("|,|\n)/g) >= 0) value = `"${value}"`;
            }
            return value;
          }).join(',') + '\n';
        });
      }
      console.log(csv);
      return csv;
    }

    function downloadCsv(csv, filename) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }

    let csv = jsonToCsv(timetableData);
    downloadCsv(csv, 'timetable.csv');

  };

  const saveTimeTable = async () => {
    console.log("timetable", timetableData);
    const data = {
      timetable: timetableData,
    };
    console.log(profData);
    const data1 = {
      timetable: profData,
    };
    let timetabl = [data, data1];
    try {
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timetabl),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
  };

  const swapClasses = async() => {
    if (classSwaps.length != 2) {
        return;
    }

    let class1 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]]))
    let class2 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]]))

    console.log(class1, class2);

    if (class1[0].includes("Self") && class2[0].includes("Self")) {
      document.getElementById("messages").innerHTML = `Not Funny Bro :)`;
      return;
    }

    if (class1[0].includes("Self")) {
      if (is_free_professor(
          timetablesForUsing[1],
          timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]][1], 
          classSwaps[0][1],
          classSwaps[0][2],
          classSwaps[0][0]
      )) {
          let proff1 = JSON.parse(JSON.stringify(class2[1]));
          let temp1 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]]));
          
          timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]] = temp1;
          timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]] = ["Self-Learning", "self_proff"];

          timetablesForUsing[1][proff1][classSwaps[0][1]][classSwaps[0][2]] = [temp1[0], classSwaps[1][0]];
          timetablesForUsing[1][proff1][classSwaps[1][1]][classSwaps[1][2]] = "";

          let [a, b, c] = format_timetables(
              timetablesForUsing[0], 
              timetablesForUsing[1], 
              timetablesForUsing[2], 
              timetablesForUsing[3], 
              timetablesForUsing[4]
          );
          setTable(a);
          setProfData(b);
          setTimetableData(a);
          setAllTimetables([
              timetablesForUsing[0], 
              timetablesForUsing[1], 
              timetablesForUsing[2], 
              timetablesForUsing[3], 
              timetablesForUsing[4]
          ]);
          setIsGenerated(true);
      } else {
          let busyClass = JSON.parse(JSON.stringify(timetablesForUsing[1][timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]][1]][classSwaps[0][1]][classSwaps[0][2]]));
          console.log(busyClass);
          document.getElementById("messages").innerHTML = `Professor is busy with ${busyClass[0]} for ${busyClass[1]} at the selected time.`;
      }
      return;
    }

    if (class2[0].includes("Self")) {
      if (is_free_professor(
          timetablesForUsing[1], 
          timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]][1], 
          classSwaps[1][1],
          classSwaps[1][2], 
          classSwaps[1][0]
      )) {
          let proff2 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]][1]));
          let temp2 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]]));

          timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]] = ["Self-Learning", "self_proff"];
          timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]] = temp2;

          timetablesForUsing[1][proff2][classSwaps[0][1]][classSwaps[0][2]] = "";
          timetablesForUsing[1][proff2][classSwaps[1][1]][classSwaps[1][2]] = [temp2[0], classSwaps[0][0]];

          let [a, b, c] = format_timetables(
              timetablesForUsing[0], 
              timetablesForUsing[1], 
              timetablesForUsing[2], 
              timetablesForUsing[3], 
              timetablesForUsing[4]
          );
          setTable(a);
          setProfData(b);
          setTimetableData(a);
          setAllTimetables([
              timetablesForUsing[0], 
              timetablesForUsing[1], 
              timetablesForUsing[2], 
              timetablesForUsing[3], 
              timetablesForUsing[4]
          ]);
          setIsGenerated(true);
      } else {
          let busyClass = JSON.parse(JSON.stringify(timetablesForUsing[1][timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]][1]][classSwaps[0][1]][classSwaps[0][2]]));
          console.log(busyClass);
          document.getElementById("messages").innerHTML = `Professor is busy with ${busyClass[0]} for ${busyClass[1]} at the selected time.`;
      }
      return;
    }

    if (isSwappable(
      timetablesForUsing[0], 
      timetablesForUsing[1], 
      classSwaps[0][0], 
      classSwaps[0][1],
      classSwaps[0][2], 
      classSwaps[1][1], 
      classSwaps[1][2]
    )) {
      let proff1 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[1][1]][classSwaps[1][2]][1]));
      let proff2 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]][1]));
      let temp1 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[1][1]][classSwaps[1][2]]));
      let temp2 = JSON.parse(JSON.stringify(timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]]));

      console.log(temp1);
      console.log(temp2);
      console.log(proff1);
      console.log(proff2);

      timetablesForUsing[0][classSwaps[0][0]][classSwaps[1][1]][classSwaps[1][2]] = temp2;
      timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]] = temp1;

      timetablesForUsing[1][proff1][classSwaps[0][1]][classSwaps[0][2]] = [temp1[0], classSwaps[0][0]];
      timetablesForUsing[1][proff2][classSwaps[0][1]][classSwaps[0][2]] = "";
      timetablesForUsing[1][proff1][classSwaps[1][1]][classSwaps[1][2]] = "";
      timetablesForUsing[1][proff2][classSwaps[1][1]][classSwaps[1][2]] = [temp2[0], classSwaps[0][0]];

      let [a, b, c] = format_timetables(
          timetablesForUsing[0], 
          timetablesForUsing[1], 
          timetablesForUsing[2], 
          timetablesForUsing[3], 
          timetablesForUsing[4]
      );
      setTable(a);
      setProfData(b);
      setTimetableData(a);
      setAllTimetables([
          timetablesForUsing[0], 
          timetablesForUsing[1], 
          timetablesForUsing[2], 
          timetablesForUsing[3], 
          timetablesForUsing[4]
      ]);
      console.log(timetablesForUsing);
      console.log(a);
      console.log(b);

      setIsGenerated(true);
    } else {
      let busyProf1 = timetablesForUsing[0][classSwaps[0][0]][classSwaps[0][1]][classSwaps[0][2]][1];
      let busyProf2 = timetablesForUsing[0][classSwaps[1][0]][classSwaps[1][1]][classSwaps[1][2]][1];
      
      let busyClass1 = timetablesForUsing[1][busyProf1][classSwaps[1][1]][classSwaps[1][2]];
      let busyClass2 = timetablesForUsing[1][busyProf2][classSwaps[0][1]][classSwaps[0][2]];
      
      if (busyClass1 == "" && busyClass2 != "") {
      } else if (busyClass1 != "" && busyClass2 == "") {
          document.getElementById("messages").innerHTML = `Professor ${busyProf1} is busy with ${busyClass1[0]} for ${busyClass1[1]} at the selected time.`;
      } else if (busyClass1 != "" && busyClass2 != "") {
          document.getElementById("messages").innerHTML = `Professor ${busyProf1} is busy with ${busyClass1[0]} for ${busyClass1[1]} and Professor ${busyProf2} is busy with ${busyClass2[0]} for ${busyClass2[1]} at the selected times.`;
      } else {
          document.getElementById("messages").innerHTML = "Error Found!! Please contact maintainer DrunkenCloud on discord";
      }
  }
  
  };

  const [isLoggedin, setLoggedin] = useState(false);
  const [currentYear, setCurrentYear] = useState("2nd Year");
  const [currentSection, setCurrentSection] = useState("AIDS Section A");
  const [lockedClasses, setLockedClasses] = useState([]);

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
                  <label className="block mb-2">Professors Shortforms</label>
                  <input
                    className="rounded-lg p-2 w-full"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange(e, setFile3)}
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
                <button
                  className="bg-purple-500 justify-center items-center rounded-lg p-2 ml-2"
                  onClick={() => {
                    swapClasses();
                  }}
                >
                  Swap Classes
                </button>
                <div id="messages" className="flex ml-20 font-bold font-mono text-3xl pt-2 text-red-500"></div>
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
                    {currentYear != "4th Year" ?
                      currentSection == "Cyber Security" ? (
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
                      ) : <></>}
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
                            {["8.10-9.00",
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
                                          id={"slot"+rowIndex+colIndex}
                                          onClick={()=>handleEdit(dataa, rowIndex, colIndex)}
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
                        <div className="flex mt-4 ml-auto">
                        <button className="bg-blue-400 rounded-lg p-3 mt-3 mr-2"
                        >Edit</button>
                          {!lockedClasses.includes(dataa) ?
                            <button
                              className="bg-red-500 p-3 rounded-lg mt-3 mr-2"
                              onClick={() => {
                                if (!lockedClasses.includes(dataa)) {
                                  setLockedClasses(
                                    () => [...lockedClasses, dataa],
                                  )
                                }
                                console.log(lockedClasses);
                              }}
                            >
                              Fix
                            </button> :
                            <button
                              className="bg-green-500 p-3 rounded-lg mt-3 mr-2"
                              onClick={() => {
                                if (!lockedClasses.includes(dataa)) {
                                  setLockedClasses(
                                    () => [...lockedClasses, dataa],
                                  )
                                }
                                console.log(lockedClasses);
                              }}
                            >
                              Fixed
                            </button>}
                          <button
                            className="bg-blue-500 p-3 rounded-lg mt-3 mr-2"
                            onClick={() => {
                              genPDF(currentYear + " B_Tech " + currentSection);
                            }}
                          >
                            Save as pdf
                          </button>
                          <button
                            className="bg-green-500 p-3 rounded-lg mt-3 mr-2"
                            onClick={() => {
                              genCSV(currentYear + " B_Tech " + currentSection);
                            }}
                          >
                            Save as csv
                          </button>
                        </div>
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
