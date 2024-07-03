"use client";

import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import Sidebar from "../Components/Sidebar";

const pb = new PocketBase("https://snuc.pockethost.io");

<<<<<<< HEAD
||||||| parent of e0a5f96 (lolll)
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { Calendar as CalendarIcon } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectLabel } from "@radix-ui/react-select";




=======
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";

>>>>>>> e0a5f96 (lolll)
export default function Home() {
  const [proffTimetable, setProffTimetable] = useState([]);
<<<<<<< HEAD
  const [showTable, setShowTable] = useState(true);
  const [currentTab, setCurrentTab] = useState("Professor");
  const [classYear, setClassYear] = React.useState("");
  const [timetableData, setTimetable] = React.useState([]);
  let [numcourse, setNumcourse] = useState(0);
  // let numcourse = 0;
||||||| parent of e0a5f96 (lolll)
  const [showTable, setShowTable] = useState(true);
  const [currentTab, setCurrentTab] = useState("Professor");
  const [classYear, setClassYear] = React.useState("");
  const [timetableData, setTimetable] = React.useState([]);
  let [numcourse, setNumcourse] = useState(0);
  const [currentProff, setCurrentProff] = useState("proff1");
  // let numcourse = 0;
=======
  const [currentProff, setCurrentProff] = useState("proff1");
  const [time, setTime] = useState();
  const [syllabusCovered, setSyllabusCovered] = useState("");
  const [course, setCourse] = useState([]);

>>>>>>> e0a5f96 (lolll)
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

<<<<<<< HEAD
  // ]
||||||| parent of e0a5f96 (lolll)
  // ]

  const getAllCoursesProff = (proff) => {
    let courses = [];
    const timetable = proffTimetable[proff];
    for (let i = 0; i < timetable.length; i++) {
      for (let j = 0; j < timetable[i].length; j++) {
        if (timetable[i][j] != "" && timetable[i][j] != "Break" && timetable[i][j] != "Lunch") {
          if (!courses.includes(timetable[i][j])) {
            courses.push(timetable[i][j]);
          }
        }
      }
    }
    console.log(courses);
    return courses;
  }

=======
  const year234 = [
    "8.10-9.00 ",
    "9.00-9.50 ",
    "9.50-10.40 ",
    "11.00-11.50 ",
    "11.50-12.40 ",
    "1.40-2.30 ",
    "break",
    "2.40-3.30 ",
  ];

  function handleSubmit() {
    console.log(`Date: ${date}`);
    console.log(`Proff: ${currentProff}`);
    console.log(`Course: ${currentCourse}`);
    console.log(`Time: ${time}`);
    console.log(`Syllabus Covered: ${syllabusCovered}`);
  }

  const getAllCoursesProff = (proff) => {
    let courses = [];
    const timetable = proffTimetable[proff];
    if (!timetable) {
      return;
    }

    for (let i = 0; i < timetable.length; i++) {
      for (let j = 0; j < timetable[i].length; j++) {
        if (
          timetable[i][j] != "" &&
          timetable[i][j] != "Break" &&
          timetable[i][j] != "Lunch"
        ) {
          if (!courses.includes(timetable[i][j])) {
            courses.push(timetable[i][j]);
          }
        }
      }
    }
    return courses;
  };

>>>>>>> e0a5f96 (lolll)
  const fetchTimetable = async () => {
<<<<<<< HEAD
    try{
    const record = await pb.collection("timetable").getFullList();
    console.log(record[0].timetable[classYear]);
    setTimetable(record[0].timetable);
    setProffTimetable(record[1].timetable);
  }catch(e){}}
  const addInfo = () => {
    setNumcourse(numcourse + 1);
    console.log(numcourse);
  }
||||||| parent of e0a5f96 (lolll)
    try {
      const record = await pb.collection("timetable").getFullList();
      console.log(record[0].timetable[classYear]);
      setTimetable(record[0].timetable);
      setProffTimetable(record[1].timetable);
      console.log(record[1].timetable);
      setCurrentProff(Object.keys(record[1].timetable)[0]);
      const courses = getAllCoursesProff(Object.keys(record[1].timetable)[0]);
      setCourse(courses);
      console.log(course);
      setCurrentCourse(courses[0]);
    } catch (e) { }
  }
  const addInfo = () => {
    setNumcourse(numcourse + 1);
    console.log(numcourse);
  }
=======
    try {
      const record = await pb.collection("timetable").getFullList();
      setProffTimetable(record[1].timetable);
      setCurrentProff(Object.keys(record[1].timetable)[0]);
      const courses = getAllCoursesProff(Object.keys(record[1].timetable)[0]);
      setCourse(courses);
      setCurrentCourse(courses[0]);
    } catch (e) {}
  };
>>>>>>> e0a5f96 (lolll)
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

<<<<<<< HEAD
  const isActive = () =>
    currentTab == "Student" ? "bg-[#f8f8f8] bg-opacity-25" : "";

  const [proff, setProff] = useState({});
||||||| parent of e0a5f96 (lolll)
  const isActive = () =>
    currentTab == "Student" ? "bg-[#f8f8f8] bg-opacity-25" : "";

  const [proff, setProff] = useState({});
  const [course, setCourse] = useState([]);
  const [currentCourse, setCurrentCourse] = useState("");
=======
  const [currentCourse, setCurrentCourse] = useState("");
>>>>>>> e0a5f96 (lolll)

  const [date, setDate] = useState(new Date());

<<<<<<< HEAD
||||||| parent of e0a5f96 (lolll)
  // stuff for the comments themselves
  const [date, setDate] = useState(null);

=======
  useEffect(() => {
    const courses = getAllCoursesProff(currentProff);
    if (!courses) {
      return;
    }
    setCourse(courses);
    setCurrentCourse(courses[0]);
  }, [currentProff]);

>>>>>>> e0a5f96 (lolll)
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
<<<<<<< HEAD
            <div className="flex ml-12 font-mono mt-3">
              {currentTab == "Professor" ? (
                <div
                  className={
                    "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                  }
                  onClick={() => setCurrentTab("Professor")}
                >
                  Professor
||||||| parent of e0a5f96 (lolll)
            <div className="w-full mt-3 flex">
              <div className="flex flex-col ml-12 font-mono overflow-auto"
                style={
                  {
                    height: "600px"
                  }
                }>
                {Object.keys(proffTimetable).sort(
                  (a, b) => a.replace("Proff", "") - b.replace("Proff", "")
                ).map((proff1, index) =>
                  currentProff == proff1 ?
                    (
                      <div
                        className={
                          "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                        }
                        onClick={() => {
                          setCurrentProff(proff1);
                          const courses = getAllCoursesProff(proff1);
                          setCourse(courses);
                          setCurrentCourse(courses[0]);
                        }}
                      >
                        {proff1}
                      </div>
                    ) : (
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => {
                          setCurrentProff(proff1);
                          const courses = getAllCoursesProff(proff1);
                          setCourse(courses);
                          console.log(course);
                          setCurrentCourse(courses[0]);
                        }}
                      >
                        {proff1}
                      </div>
                    ))}
              </div>

              <div className="w-full h-full bg-[#B4D2E7] p-4">
                <div className="flex">
                  {
                    course.map((course1, index) =>
                      currentCourse == course1 ?
                        (
                          <div
                            className={
                              currentCourse == course1 ?
                                "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black" :
                                "p-4 cursor-pointer"
                            }
                            onClick={() => {
                              setCurrentCourse(course1);
                            }}
                          >
                            {course1}
                          </div>
                        ) :
                        (
                          <div
                            className="p-4 cursor-pointer"
                            onClick={() => {
                              setCurrentCourse(course1);
                            }}
                          >
                            {course1}
                          </div>
                        ))
                  }
=======
            <div className="w-full mt-3 flex">
              <div
                className="flex flex-col ml-12 font-mono overflow-auto"
                style={{
                  height: "600px",
                }}
              >
                {Object.keys(proffTimetable)
                  .sort(
                    (a, b) => a.replace("Proff", "") - b.replace("Proff", ""),
                  )
                  .map((proff1, index) =>
                    currentProff == proff1 ? (
                      <div
                        className={
                          "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                        }
                        onClick={() => {
                          setCurrentProff(proff1);
                          // const courses = getAllCoursesProff(proff1);
                          // setCourse(courses);
                          // setCurrentCourse(courses[0]);
                        }}
                        key={index}
                      >
                        {proff1}
                      </div>
                    ) : (
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => {
                          setCurrentProff(proff1);
                          // const courses = getAllCoursesProff(proff1);
                          // setCourse(courses);
                          // setCurrentCourse(courses[0]);
                        }}
                      >
                        {proff1}
                      </div>
                    ),
                  )}
              </div>

              <div className="w-full h-full bg-[#B4D2E7] p-4">
                <div className="flex">
                  {course &&
                    course.map((course1, index) =>
                      currentCourse == course1 ? (
                        <div
                          key={index}
                          className={
                            currentCourse == course1
                              ? "p-4 cursor-pointer bg-[#f8f8f8] bg-opacity-25 border-b-2 border-black"
                              : "p-4 cursor-pointer"
                          }
                          onClick={() => {
                            setCurrentCourse(course1);
                          }}
                        >
                          {course1}
                        </div>
                      ) : (
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => {
                            setCurrentCourse(course1);
                          }}
                        >
                          {course1}
                        </div>
                      ),
                    )}
>>>>>>> e0a5f96 (lolll)
                </div>
<<<<<<< HEAD
              ) : (
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setCurrentTab("Professor")}
                >
                  Professor
                </div>
              )}
||||||| parent of e0a5f96 (lolll)
                {currentCourse != "" && currentProff != "" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center justify-center bg-[#B4D2E7] text-white rounded-full p-2">
                        <Plus size={40} className="bg-[#B4D2E7]" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#B4D2E7]">
                      <DialogHeader>
                        <DialogTitle>Data</DialogTitle>
                        <DialogDescription>
                          <div className="flex gap-4">
                            <div className="flex flex-col mr-2 justify-center items-left gap-4">
                              <div className="flex">
                                <div className="font-semibold">Professor:</div>
                                <div className="ml-2">{currentProff}</div>
                              </div>
                              <div className="flex">
                                <div className="font-semibold">Course:</div>
                                <div className="ml-2">{currentCourse.split(" ")[0] + " " + currentCourse.split(" ")[1] + " " + currentCourse.split(" ")[2] + "  "} </div>
                              </div>
                            </div>
                            <div className="flex flex-col ml-4 justify-center items-left gap-4">
                              <div className="flex">
                                <div className="font-semibold">Class:</div>
                                <div className="ml-2">{currentCourse.replace(currentCourse.split(" ")[0] + " " + currentCourse.split(" ")[1] + " " + currentCourse.split(" ")[2], "")}</div>
                              </div>
                              <div className="flex items-center">
                                <div className="font-semibold">Date:</div>
                                <div className="ml-2"><Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                      )}
                                    >
                                      {date ? date : <span>pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <CalendarIcon
                                      mode="single"
                                      selected={date}
                                      onSelect={(e) => {
                                        console.log(e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear());
                                        setDate(e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear());
                                        console.log(e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear());
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                              <div className="font-semibold">Time:</div>
                              <div className="ml-2">
                                <Select className="h-1/2">
                                  <SelectTrigger className="h-1/2">
                                    <SelectValue placeholder="time" />
                                  </SelectTrigger>
                                  <SelectContent className="h-1/2">
                                    <SelectGroup label="Year 1">
                                      <SelectLabel className="font-bold font-mono flex items-center justify-center">Year 1</SelectLabel>
                                      {year1.map((time, index) =>
                                        time != "break" && time != "Lunch" &&
                                        (
                                          <SelectItem key={index} value={time} className="p-0 items-center justify-center flex">{time}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectGroup label="Year 2,3,4">
                                      <SelectLabel className="font-bold font-mono flex items-center justify-center">Year 2,3,4</SelectLabel>
                                      {
                                        [
                                          "8.10-9.00 ",
                                          "9.00-9.50 ",
                                          "9.50-10.40 ",
                                          "11.00-11.50 ",
                                          "11.50-12.40 ",
                                          "1.40-2.30 ",
                                          "break",
                                          "2.40-3.30 ",
                                        ].map((time, index) => time != "break" && time != "Lunch" && (
                                          <SelectItem key={index} value={time} className="p-0 items-center justify-center flex">{time}</SelectItem>
                                        ))
                                      }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="font-semibold">Syllabus Covered:</div>
                              <div className="ml-2">
                                <Input
                                  placeholder="Syllabus Covered"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogClose>
                        <Button>Submit</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
=======
                {currentCourse != "" && currentProff != "" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center justify-center bg-[#B4D2E7] text-white rounded-full p-2">
                        <Plus size={40} className="bg-[#B4D2E7]" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#B4D2E7]">
                      <DialogHeader>
                        <DialogTitle>Data</DialogTitle>
                        <DialogDescription>
                          <div className="flex gap-4">
                            <div className="flex flex-col mr-2 justify-center items-left gap-4">
                              <div className="flex">
                                <div className="font-semibold">Professor:</div>
                                <div className="ml-2">{currentProff}</div>
                              </div>
                              <div className="flex">
                                <div className="font-semibold">Course:</div>
                                <div className="ml-2">
                                  {currentCourse.split(" ")[0] +
                                    " " +
                                    currentCourse.split(" ")[1] +
                                    " " +
                                    currentCourse.split(" ")[2] +
                                    "  "}{" "}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col ml-4 justify-center items-left gap-4">
                              <div className="flex">
                                <div className="font-semibold">Class:</div>
                                <div className="ml-2">
                                  {currentCourse.replace(
                                    currentCourse.split(" ")[0] +
                                      " " +
                                      currentCourse.split(" ")[1] +
                                      " " +
                                      currentCourse.split(" ")[2],
                                    "",
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="font-semibold">Date:</div>
                                <div className="ml-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                      ></Calendar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"></PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                              <div className="font-semibold">Time:</div>
                              <div className="ml-2">
                                <Select
                                  className="h-1/2"
                                  value={time}
                                  onValueChange={setTime}
                                >
                                  <SelectTrigger className="h-1/2">
                                    <SelectValue placeholder="time" />
                                  </SelectTrigger>
                                  <SelectContent className="h-1/2">
                                    <SelectGroup label="Year 1">
                                      <SelectLabel className="font-bold font-mono flex items-center justify-center">
                                        Year 1
                                      </SelectLabel>
                                      {year1.map(
                                        (time, index) =>
                                          time != "break" &&
                                          time != "Lunch" && (
                                            <SelectItem
                                              key={index}
                                              value={time}
                                              className="p-0 items-center justify-center flex"
                                            >
                                              {time}
                                            </SelectItem>
                                          ),
                                      )}
                                    </SelectGroup>
                                    <SelectGroup label="Year 2,3,4">
                                      <SelectLabel className="font-bold font-mono flex items-center justify-center">
                                        Year 2,3,4
                                      </SelectLabel>
                                      {year234.map(
                                        (time, index) =>
                                          time != "break" &&
                                          time != "Lunch" && (
                                            <SelectItem
                                              key={index}
                                              value={time}
                                              className="p-0 items-center justify-center flex"
                                            >
                                              {time}
                                            </SelectItem>
                                          ),
                                      )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="font-semibold">
                                Syllabus Covered:
                              </div>
                              <div className="ml-2">
                                <Input
                                  placeholder="Syllabus Covered"
                                  className="w-full"
                                  value={syllabusCovered}
                                  onChange={(e) => {
                                    setSyllabusCovered(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogClose>
                        <Button onClick={handleSubmit}>Submit</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
>>>>>>> e0a5f96 (lolll)
            </div>
            {currentTab == "Professor" ? (
              <>
                <div className="flex gap-8 ml-12 mt-8">
                </div>
                <button className="ml-12 w-8 bg-blue-400 rounded" onClick={addInfo}>+</button>
                <div className="bg-white rounded-lg ml-12">
                {
                  Array.from({ length: numcourse }).map((_, index) => (
                    <div className="md:mt-6 md:ml-6 mr-6 flex flex-col items-center bg-white p-4 rounded-lg">
                      <div className="font-black mr-auto ml-2 text-2xl mb-3">
                        </div>
                        <div className="">
                          <input className="border border-black" placeholder="date" type="text" />
                          <input className="border border-black" placeholder="day" type="text" />
                          <input className="border border-black" placeholder="slot" type="text" />
                          <input className="border border-black" placeholder="course" type="text" />
                          <input className="border border-black" placeholder="class" type="text" />
                          <input className="border border-black" placeholder="syllabus taught" type="text" />
                        </div>
                    </div>
                      
                  ))
                }
                </div>
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
                          a.replace("Proff", "") - b.replace("Proff", "")
                      )
                      .map((key, index) => (
                        <option key={index}>{key}</option>
                      ))}
                  </select>
                </div>
                {Object.keys(proffTimetable).map(
                  (dataa, index) =>
                    dataa == Object.keys(proff)[0] && (
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
                            {proff[dataa][0][2] != "b"
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
                              )
                            )}
                          </div>
                          <div className="grid grid-rows-5 rounded-lg gap-1 grid-flow-col">
                            {Array.from({ length: year1.length }).map(
                              (_, colIndex) => (
                                <>
                                  {Array.from({ length: numcourse }).map(
                                    (_, rowIndex) => (
                                      <div
                                        key={colIndex + rowIndex}
                                        className="w-12 h-8 md:w-24 md:h-16 bg-[#dfdfdf] rounded-lg justfiy-center items-center flex text-center text-[5px] md:text-[10px] overflow-auto"
                                      >
                                        {proff[dataa][rowIndex][
                                          colIndex
                                        ] != "b" &&
                                        proff[dataa][rowIndex][
                                          colIndex
                                        ] != "l" ? (
                                          <div className="text-center w-full h-full items-center justify-center flex font-bold">
                                            {
                                              proff[dataa][rowIndex][
                                                colIndex
                                              ]
                                            }
                                          </div>
                                        ) : proff[dataa][rowIndex][
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
                                    )
                                  )}
                                </>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
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