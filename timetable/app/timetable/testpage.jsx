"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar.js";
import SVGStar from "../Components/star.jsx";
import { generatePDF } from "./print.jsx";
import { startProcess } from "./algo.jsx";
const data = {
  "1st Year B_Tech AIDS Section A": [
    [
      "ENG101 CMP ",
      "CSE102 T PWR ",
      "Break",
      "Self-Learning 2 NON ",
      "PHY102 T RJS ",
      "Lunch",
      "Self-Learning 5 NON ",
      "ENG101 CMP ",
      "Break",
      "MTH101 VGP ",
    ],
    [
      "ENV101 VSL ",
      "PHY101 PTN ",
      "Break",
      "Self-Learning 6 NON ",
      "CSE101 PDV ",
      "Lunch",
      "Self-Learning 3 NON ",
      "ENV101 VSL ",
      "Break",
      "PHY101 PTN ",
    ],
    [
      "ECE101 T ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 RJS PWR ",
      "Lunch",
      "PHY102 CSE102 PHYLAB1 CSELAB6 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 RJS PWR ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 RJS PWR ",
    ],
    [
      "ECE101 ECELAB1 ANY ",
      "ECE101 ECELAB1 ANY ",
      "Break",
      "Self-Learning 8 NON ",
      "MTH101 VGP ",
      "Lunch",
      "ENG101 CMP ",
      "Self-Learning 4 NON ",
      "Break",
      "PHY101 PTN ",
    ],
    [
      "Self-Learning 1 NON ",
      "MTH101 VGP ",
      "Break",
      "Self-Learning 7 NON ",
      "CSE101 PDV ",
      "Lunch",
      "CSE101 PDV ",
      "ECE101 T ANY ",
      "Break",
      "MTH101 VGP ",
    ],
  ],
  "1st Year B_Tech AIDS Section B": [
    [
      "ENV101 VSL ",
      "Self-Learning 3 NON ",
      "Break",
      "Self-Learning 4 NON ",
      "MTH101 DVD ",
      "Lunch",
      "CSE101 SMW ",
      "MTH101 DVD ",
      "Break",
      "PHY102 T RJS ",
    ],
    [
      "Self-Learning 7 NON ",
      "ECE101 ECELAB1 ANY ",
      "ECE101 ECELAB1 ANY ",
      "ECE101 ECELAB1 ANY ",
      "PHY101 PTN ",
      "Lunch",
      "Self-Learning 1 NON ",
      "MTH101 DVD ",
      "Break",
      "ENG101 CMP ",
    ],
    [
      "CSE101 SMW ",
      "ECE101 T ANY ",
      "ECE101 T ANY ",
      "ECE101 T ANY ",
      "ENV101 VSL ",
      "Lunch",
      "Self-Learning 2 NON ",
      "MTH101 DVD ",
      "Break",
      "CSE101 SMW ",
    ],
    [
      "Self-Learning 8 NON ",
      "PHY101 PTN ",
      "Break",
      "Self-Learning 5 NON ",
      "CSE102 T SMW ",
      "Lunch",
      "PHY102 CSE102 PHYLAB1 CSELAB9 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB9 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB9 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB9 RJS SMW ",
    ],
    [
      "ENG101 CMP ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 RJS SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 RJS SMW ",
      "Lunch",
      "ENG101 CMP ",
      "Self-Learning 6 NON ",
      "Break",
      "PHY101 PTN ",
    ],
  ],
  "1st Year B_Tech AIDS Section C": [
    [
      "CSE102 T SMW ",
      "PHY101 SDT ",
      "Break",
      "CSE101 SMW ",
      "ENV101 VSL ",
      "Lunch",
      "ENG101 NBD ",
      "CSE101 SMW ",
      "Break",
      "CSE101 SMW ",
    ],
    [
      "PHY102 CSE102 PHYLAB1 CSELAB1 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB1 SDT SMW ",
      "ECE101 T ANY ",
      "Lunch",
      "Self-Learning 4 NON ",
      "Self-Learning 5 NON ",
      "Break",
      "ENV101 VSL ",
    ],
    [
      "Self-Learning 1 NON ",
      "Self-Learning 2 NON ",
      "Break",
      "PHY102 T SDT ",
      "PHY101 SDT ",
      "Lunch",
      "MTH101 DVD ",
      "ECE101 ECELAB1 ANY ",
      "ECE101 ECELAB1 ANY ",
    ],
    [
      "PHY102 CSE102 PHYLAB1 CSELAB3 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB3 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB3 SDT SMW ",
      "PHY102 CSE102 PHYLAB1 CSELAB3 SDT SMW ",
      "Self-Learning 7 NON ",
      "Lunch",
      "MTH101 DVD ",
      "ECE101 T ANY ",
      "Break",
      "Self-Learning 8 NON ",
    ],
    [
      "ENG101 NBD ",
      "PHY101 SDT ",
      "Break",
      "MTH101 DVD ",
      "ENG101 NBD ",
      "Lunch",
      "MTH101 DVD ",
      "Self-Learning 3 NON ",
      "Break",
      "Self-Learning 6 NON ",
    ],
  ],
  "1st Year B_Tech IoT Section A": [
    [
      "Self-Learning 2 NON ",
      "CSE102 CSELAB1 CSELAB3 DYL ",
      "CSE102 CSELAB1 CSELAB3 DYL ",
      "CSE102 CSELAB1 CSELAB3 DYL ",
      "CSE102 CSELAB1 CSELAB3 DYL ",
      "Lunch",
      "Self-Learning 10 NON ",
      "ECE104 T VSM ",
      "Break",
      "ENG101 NBD ",
    ],
    [
      "MTH101 PRN ",
      "Self-Learning 6 NON ",
      "Break",
      "Self-Learning 4 NON ",
      "MTH101 PRN ",
      "Lunch",
      "ENG101 NBD ",
      "PHY103 SMW ",
      "Break",
      "MTH101 PRN ",
    ],
    [
      "CSE101 DYL ",
      "PHY103 SMW ",
      "Break",
      "Self-Learning 1 NON ",
      "ECE103 VSM ",
      "Lunch",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
    ],
    [
      "Self-Learning 9 NON ",
      "Self-Learning 8 NON ",
      "Break",
      "ENG101 NBD ",
      "CSE102 T DYL ",
      "Lunch",
      "CSE101 DYL ",
      "ENV101 VSL ",
      "Break",
      "ENV101 VSL ",
    ],
    [
      "PHY103 SMW ",
      "Self-Learning 3 NON ",
      "Break",
      "Self-Learning 7 NON ",
      "CSE101 DYL ",
      "Lunch",
      "ECE103 VSM ",
      "ECE103 VSM ",
      "ECE103 VSM ",
      "Self-Learning 5 NON ",
    ],
  ],
  "1st Year B_Tech IoT Section B": [
    [
      "ECE104 T VSM ",
      "ENV101 VSL ",
      "Break",
      "Self-Learning 9 NON ",
      "Self-Learning 4 NON ",
      "Lunch",
      "CSE102 T PWR ",
      "ENG101 NBD ",
      "Break",
      "ECE103 VSM ",
    ],
    [
      "Self-Learning 3 NON ",
      "Self-Learning 8 NON ",
      "Break",
      "ECE103 VSM ",
      "CSE101 PWR ",
      "Lunch",
      "CSE102 CSELAB2 CSELAB9 PWR ",
      "CSE102 CSELAB2 CSELAB9 PWR ",
      "CSE102 CSELAB2 CSELAB9 PWR ",
      "CSE102 CSELAB2 CSELAB9 PWR ",
    ],
    [
      "ENV101 VSL ",
      "Self-Learning 10 NON ",
      "Break",
      "ECE103 VSM ",
      "Self-Learning 1 NON ",
      "Lunch",
      "ENG101 NBD ",
      "ENG101 NBD ",
      "ENG101 NBD ",
      "MTH101 DVD ",
    ],
    [
      "Self-Learning 5 NON ",
      "CSE101 PWR ",
      "Break",
      "Self-Learning 6 NON ",
      "MTH101 DVD ",
      "Lunch",
      "CSE101 PWR ",
      "MTH101 DVD ",
      "Break",
      "Self-Learning 7 NON ",
    ],
    [
      "Self-Learning 2 NON ",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
      "ECE104 ECELAB1 VSM ",
      "Lunch",
      "PHY103 SMW ",
      "PHY103 SMW ",
      "PHY103 SMW ",
      "PHY103 SMW ",
    ],
  ],
  "1st Year B_Tech Cyber Security": [
    [
      "CSE201 PWR ",
      "CSE101 ANY ",
      "Break",
      "CSE201 PWR ",
      "Self-Learning 2 NON ",
      "Lunch",
      "PHY102 CSE102 PHYLAB1 CSELAB6 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB6 SDT ANY ",
    ],
    [
      "MTH101 VGP ",
      "ECE101 T DYL ",
      "Break",
      "Self-Learning 3 NON ",
      "PHY101 SDT ",
      "Lunch",
      "PHY102 CSE102 PHYLAB1 CSELAB5 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 SDT ANY ",
      "PHY102 CSE102 PHYLAB1 CSELAB5 SDT ANY ",
    ],
    [
      "PHY102 T SDT ",
      "Self-Learning 6 NON ",
      "ECE101 ECELAB1 DYL ",
      "ECE101 ECELAB1 DYL ",
      "Lunch",
      "ENG101 CMP ",
      "Self-Learning 4 NON ",
      "Break",
      "MTH101 VGP ",
    ],
    [
      "Self-Learning 1 NON ",
      "ENG101 CMP ",
      "Break",
      "MTH101 VGP ",
      "ENG101 CMP ",
      "Lunch",
      "Self-Learning 5 NON ",
      "MTH101 VGP ",
      "Break",
      "CSE101 ANY ",
    ],
    [
      "PHY101 SDT ",
      "CSE201 PWR ",
      "CSE201 PWR ",
      "CSE201 PWR ",
      "CSE101 ANY ",
      "Lunch",
      "PHY101 SDT ",
      "ECE101 T DYL ",
      "Break",
      "CSE102 T ANY ",
    ],
  ],
  "2nd Year B_Tech AIDS Section A": [
    [
      "CSE207 CSELAB4 CSELAB9 SDK ",
      "CSE207 CSELAB4 CSELAB9 SDK ",
      "CSE207 CSELAB4 CSELAB9 SDK ",
      "Break",
      "PSY201 NGR ",
      "CSE202 KSY ",
      "Lunch",
      "Self-Learning 7 NON ",
      "Break",
      "PSY201 NGR ",
    ],
    [
      "Self-Learning 6 NON ",
      "CSE203 T PDV ",
      "CSE204 SNT ",
      "Break",
      "CSE206 T KSY ",
      "CSE204 SNT ",
      "Lunch",
      "CSE203 CSELAB7 CSELAB8 PDV ",
      "CSE203 CSELAB7 CSELAB8 PDV ",
    ],
    [
      "Self-Learning 2 NON ",
      "CSE206 CSELAB2 CSELAB7 KSY ",
      "CSE206 CSELAB2 CSELAB7 KSY ",
      "CSE206 CSELAB2 CSELAB7 KSY ",
      "CSE206 CSELAB2 CSELAB7 KSY ",
      "CSE202 KSY ",
      "Lunch",
      "Self-Learning 4 NON ",
      "Break",
      "CSE203 T PDV ",
    ],
    [
      "CSE203 T PDV ",
      "Self-Learning 5 NON ",
      "Self-Learning 1 NON ",
      "Break",
      "CSE202 KSY ",
      "CSE204 SNT ",
      "Lunch",
      "MTH201 MRN ",
      "Break",
      "MTH201 MRN ",
    ],
    [
      "Self-Learning 8 NON ",
      "CSE205 SDK ",
      "CSE207 T SDK ",
      "Break",
      "MTH201 MRN ",
      "CSE205 SDK ",
      "Lunch",
      "MTH201 MRN ",
      "Break",
      "Self-Learning 3 NON ",
    ],
  ],
  "2nd Year B_Tech AIDS Section B": [
    [
      "PSY201 NGR ",
      "CSE202 KSY ",
      "CSE202 KSY ",
      "Break",
      "CSE206 T KSY ",
      "MTH201 VMB ",
      "Lunch",
      "CSE203 CSELAB4 CSELAB6 PDV ",
      "CSE203 CSELAB4 CSELAB6 PDV ",
    ],
    [
      "CSE206 CSELAB7 CSELAB9 KSY ",
      "CSE206 CSELAB7 CSELAB9 KSY ",
      "CSE206 CSELAB7 CSELAB9 KSY ",
      "Break",
      "Self-Learning 6 NON ",
      "CSE202 KSY ",
      "Lunch",
      "Self-Learning 1 NON ",
      "Break",
      "CSE205 SDK ",
    ],
    [
      "CSE204 SNT ",
      "Self-Learning 8 NON ",
      "PSY201 NGR ",
      "Break",
      "Self-Learning 3 NON ",
      "CSE204 SNT ",
      "Lunch",
      "CSE203 T PDV ",
      "Break",
      "CSE207 T SDK ",
    ],
    [
      "Self-Learning 5 NON ",
      "Self-Learning 7 NON ",
      "CSE207 CSELAB2 CSELAB9 SDK ",
      "CSE207 CSELAB2 CSELAB9 SDK ",
      "CSE207 CSELAB2 CSELAB9 SDK ",
      "CSE207 CSELAB2 CSELAB9 SDK ",
      "Lunch",
      "MTH201 VMB ",
      "Break",
      "CSE205 SDK ",
    ],
    [
      "CSE204 SNT ",
      "MTH201 VMB ",
      "CSE203 T PDV ",
      "CSE203 T PDV ",
      "CSE203 T PDV ",
      "MTH201 VMB ",
      "Lunch",
      "Self-Learning 4 NON ",
      "Break",
      "Self-Learning 2 NON ",
    ],
  ],
  "2nd Year B_Tech AIDS Section C": [
    [
      "Self-Learning 1 NON ",
      "Self-Learning 5 NON ",
      "PSY201 NGR ",
      "CSE203 CSELAB2 CSELAB4 PDV ",
      "CSE203 CSELAB2 CSELAB4 PDV ",
      "Lunch",
      "CSE207 T SDK ",
      "Break",
      "MTH201 VMB ",
    ],
    [
      "CSE207 CSELAB4 CSELAB8 SDK ",
      "CSE207 CSELAB4 CSELAB8 SDK ",
      "CSE207 CSELAB4 CSELAB8 SDK ",
      "Break",
      "Self-Learning 8 NON ",
      "MTH201 VMB ",
      "Lunch",
      "CSE206 T KSY ",
      "Break",
      "Self-Learning 6 NON ",
    ],
    [
      "Self-Learning 3 NON ",
      "CSE204 SNT ",
      "CSE203 T PDV ",
      "Break",
      "Self-Learning 7 NON ",
      "CSE203 T PDV ",
      "Lunch",
      "CSE204 SNT ",
      "Break",
      "CSE204 SNT ",
    ],
    [
      "MTH201 VMB ",
      "MTH201 VMB ",
      "CSE203 T PDV ",
      "Break",
      "Self-Learning 2 NON ",
      "PSY201 NGR ",
      "Lunch",
      "CSE205 SDK ",
      "Break",
      "Self-Learning 4 NON ",
    ],
    [
      "CSE206 CSELAB6 CSELAB9 KSY ",
      "CSE206 CSELAB6 CSELAB9 KSY ",
      "CSE206 CSELAB6 CSELAB9 KSY ",
      "Break",
      "CSE205 SDK ",
      "CSE202 KSY ",
      "Lunch",
      "CSE202 KSY ",
      "Break",
      "CSE202 KSY ",
    ],
  ],
  "2nd Year B_Tech IoT Section A": [
    [
      "Self-Learning 8 NON ",
      "Self-Learning 10 NON ",
      "MTH201 VMB ",
      "Break",
      "CSE210 T VRM ",
      "CSE202 ASP ",
      "Lunch",
      "MTH201 VMB ",
      "Break",
      "CSE212 PDB ",
    ],
    [
      "CSE202 ASP ",
      "CSE210 CSELAB6 CSELAB3 VRM ",
      "CSE210 CSELAB6 CSELAB3 VRM ",
      "CSE210 CSELAB6 CSELAB3 VRM ",
      "CSE210 CSELAB6 CSELAB3 VRM ",
      "CSE211 VDS ",
      "Lunch",
      "Self-Learning 11 NON ",
      "Break",
      "Self-Learning 2 NON ",
    ],
    [
      "Self-Learning 7 NON ",
      "CSE211 VDS ",
      "Self-Learning 6 NON ",
      "Break",
      "CSE212 PDB ",
      "CSE212 PDB ",
      "Lunch",
      "MTH201 VMB ",
      "Break",
      "CSE208 VRM ",
    ],
    [
      "Self-Learning 1 NON ",
      "CSE206 CSELAB8 CSELAB5 VDS ",
      "CSE206 CSELAB8 CSELAB5 VDS ",
      "CSE206 CSELAB8 CSELAB5 VDS ",
      "CSE206 CSELAB8 CSELAB5 VDS ",
      "Self-Learning 4 NON ",
      "Lunch",
      "CSE206 T VDS ",
      "Break",
      "MTH201 VMB ",
    ],
    [
      "Self-Learning 9 NON ",
      "CSE202 ASP ",
      "Self-Learning 5 NON ",
      "Break",
      "CSE208 VRM ",
      "CSE208 VRM ",
      "Lunch",
      "CSE211 VDS ",
      "Break",
      "Self-Learning 3 NON ",
    ],
  ],
  "2nd Year B_Tech IoT Section B": [
    [
      "CSE210 CSELAB2 CSELAB5 VRM ",
      "CSE210 CSELAB2 CSELAB5 VRM ",
      "CSE210 CSELAB2 CSELAB5 VRM ",
      "Break",
      "Self-Learning 4 NON ",
      "Self-Learning 10 NON ",
      "Lunch",
      "CSE210 T VRM ",
      "Break",
      "CSE208 VRM ",
    ],
    [
      "CSE206 CSELAB2 CSELAB5 VDS ",
      "CSE206 CSELAB2 CSELAB5 VDS ",
      "CSE206 CSELAB2 CSELAB5 VDS ",
      "Break",
      "Self-Learning 5 NON ",
      "Self-Learning 3 NON ",
      "Lunch",
      "CSE208 VRM ",
      "Break",
      "CSE208 VRM ",
    ],
    [
      "MTH201 MRN ",
      "Self-Learning 11 NON ",
      "CSE212 PDB ",
      "Break",
      "Self-Learning 9 NON ",
      "MTH201 MRN ",
      "Lunch",
      "CSE202 ASP ",
      "Break",
      "CSE206 T VDS ",
    ],
    [
      "CSE212 PDB ",
      "Self-Learning 7 NON ",
      "CSE212 PDB ",
      "Break",
      "Self-Learning 6 NON ",
      "CSE211 VDS ",
      "Lunch",
      "CSE202 ASP ",
      "Break",
      "CSE211 VDS ",
    ],
    [
      "MTH201 MRN ",
      "MTH201 MRN ",
      "CSE202 ASP ",
      "Break",
      "Self-Learning 1 NON ",
      "CSE211 VDS ",
      "Lunch",
      "Self-Learning 8 NON ",
      "Break",
      "Self-Learning 2 NON ",
    ],
  ],
  "2nd Year B_Tech Cyber Security": [
    [
      "CSE209 DVY ",
      "CSE210 CSELAB8 CSELAB6 DVS ",
      "CSE210 CSELAB8 CSELAB6 DVS ",
      "CSE210 CSELAB8 CSELAB6 DVS ",
      "CSE210 CSELAB8 CSELAB6 DVS ",
      "Self-Learning 8 NON ",
      "Lunch",
      "CSE208 DVS ",
      "Break",
      "Self-Learning 5 NON ",
    ],
    [
      "Self-Learning 2 NON ",
      "PSY201 NGR ",
      "MTH201 SJT ",
      "CSE203 CSELAB9 CSELAB4 STN ",
      "CSE203 CSELAB9 CSELAB4 STN ",
      "Lunch",
      "Self-Learning 3 NON ",
      "Break",
      "MTH201 SJT ",
    ],
    [
      "Self-Learning 7 NON ",
      "CSE206 CSELAB8 CSELAB9 ASP ",
      "CSE206 CSELAB8 CSELAB9 ASP ",
      "CSE206 CSELAB8 CSELAB9 ASP ",
      "CSE206 CSELAB8 CSELAB9 ASP ",
      "Self-Learning 6 NON ",
      "Lunch",
      "MTH201 SJT ",
      "Break",
      "CSE209 DVY ",
    ],
    [
      "CSE202 ASP ",
      "Self-Learning 1 NON ",
      "CSE208 DVS ",
      "Break",
      "CSE210 T DVS ",
      "CSE202 ASP ",
      "Lunch",
      "PSY201 NGR ",
      "Break",
      "Self-Learning 4 NON ",
    ],
    [
      "CSE206 T ASP ",
      "CSE208 DVS ",
      "Self-Learning 9 NON ",
      "Break",
      "CSE203 T STN ",
      "CSE203 T STN ",
      "Lunch",
      "CSE203 T STN ",
      "Break",
      "CSE202 ASP ",
    ],
  ],
};

const data2 = {
  "1st Year B.Tech CyberSecurity": [
    [
      "MA1002\nVV",
      "CS1004\n SVM",
      "b",
      "Self-learning",
      "Special Class",
      "l",
      "CS1804T\nKVA",
      "",
      "",
    ],
    [
      "CS1008\nSBS",
      "Self-learning/\nSpecial Class",
      "b",
      "CS1004\nSVM",
      "EN1002\nCMP",
      "l",
      "CS1002\nAR",
      "CS1002(T)\nAR",
      "CS1006T\nKVA",
    ],
    ["EN1002\nCMP", "", "b", "", "", "l", "Mentoring", "", ""],
    [
      "CS1066T\nKVA",
      "EN1002\nCMP",
      "b",
      "MA1002\nVV",
      "CS1004\nSVM",
      "l",
      "CS1002\nAR",
      "Self-learning/\nSpecial Class",
      "CS1008\nSBS",
    ],
    [
      "MA1002\nVV",
      "CS1008\nSBS",
      "b",
      "Self-learning",
      "CS1007\nKVA",
      "l",
      "",
      "",
      "",
    ],
  ],
};
export default function Table() {
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [year1, setYear1] = useState([
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
  ]);
  const [timetableData, setTimetableData] = useState(data);

  const generateTimeTable = () => {
    if (year == "1st") {
      setYear1([
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
      ]);
    } else {
      setYear1([
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
      ]);
    }
    console.log(data);
    console.log(year, section);
  };
  const printOutput = async () => {
    let a = await startProcess();
    setTimetableData(a);
  };
  const genPDF = () => {
    // startProcess();
    // console.log();
    // console.log(data2);
    let temp = {
      "1st Year B_Tech IoT Section A": data["1st Year B_Tech IoT Section A"],
    };
    console.log(temp);
    generatePDF(data);
  };
  return (
    <main className="min-h-screen bg-[#B4D2E7]">
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="mt-16 font-semibold ml-12 text-4xl">Time Table</div>
          <div className="bg-white h-0.5 w-1/2 mt-1"></div>
          <div className="m-5 items-center justify-center p-3 ml-10">
            {/* <select
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
            </select> */}
            <button
              className="bg-green-500 justify-center items-center rounded-lg p-2"
              onClick={printOutput}
            >
              Generate timetable
            </button>
          </div>
          {Object.keys(timetableData).map((dataa, index) => (
          <div className="mt-12 ml-12 flex flex-col items-center bg-white p-4 rounded-lg">
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
                {year1.map((slot, index) => (
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
                        {timetableData[data][rowIndex][
                          colIndex
                        ] != "b" &&
                        timetableData[data][rowIndex][
                          colIndex
                        ] != "l" ? (
                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                            {
                              timetableData[data][rowIndex][
                                colIndex
                              ]
                            }
                          </div>
                        ) : timetableData[data][rowIndex][
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
                    ))}
                  </>
                ))}
              </div>
            </div>
            <button
              className="bg-blue-500 p-3 rounded-lg ml-auto mt-3 mr-2"
              onClick={printOutput}
            >
              Output
            </button>
            <button
              className="bg-blue-500 p-3 rounded-lg ml-auto mt-3 mr-2"
              onClick={genPDF}
            >
              PRINT
            </button>
          </div>
          )
          </div
        </div>
      </div>
    </main>
  );
}
