"use client";

import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import Sidebar from "../Components/Sidebar";

const pb = new PocketBase("https://snuc.pockethost.io");

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

export default function Home() {
  const [proffTimetable, setProffTimetable] = useState([]);
  const [currentProff, setCurrentProff] = useState("proff1");
  const [time, setTime] = useState();
  const [syllabusCovered, setSyllabusCovered] = useState("");
  const [course, setCourse] = useState([]);

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

  const fetchTimetable = async () => {
    try {
      const record = await pb.collection("timetable").getFullList();
      setProffTimetable(record[1].timetable);
      setCurrentProff(Object.keys(record[1].timetable)[0]);
      const courses = getAllCoursesProff(Object.keys(record[1].timetable)[0]);
      setCourse(courses);
      setCurrentCourse(courses[0]);
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

  const [currentCourse, setCurrentCourse] = useState("");

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const courses = getAllCoursesProff(currentProff);
    if (!courses) {
      return;
    }
    setCourse(courses);
    setCurrentCourse(courses[0]);
  }, [currentProff]);

  return (
    <main className="min-h-screen bg-[#B4D2E7] select-none">
      <Sidebar />
      {loggedin ? (
        <div className="flex w-full">
          <div className="w-full ml-12">
            <div className="mt-16 font-semibold ml-12 text-4xl">
              Home
              <div className="bg-white h-0.5 w-1/2 mt-1"></div>
            </div>
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
                </div>
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
            </div>
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
