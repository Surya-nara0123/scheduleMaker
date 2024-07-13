// setting up client side rendering
"use client";

// Importing the necessary modules
import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
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
import { Input } from "@/components/ui/input"
import { SelectLabel } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// importing local modules
import { cn } from "../../lib/utils";
import Sidebar from "../Components/Sidebar";

// setting up the pocketbase
const pb = new PocketBase("https://snuc.pockethost.io");

// Home page component
export default function Home() {

  // state variables
  const [proffTimetable, setProffTimetable] = useState([]);
  const [currentProff, setCurrentProff] = useState("proff1");
  const [loggedin, setLoggedin] = React.useState(false);
  const [course, setCourse] = useState([]);
  const [currentCourse, setCurrentCourse] = useState("");
  const [comments, setComments] = useState([]);

  // state variables for the comments themseleves
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [course1, setCourse1] = useState(null);
  const [proff, setProff] = useState(null);
  const [class1, setClass1] = useState(null);

  // constant variables
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

  // function to post all comments
  const postComments = async () => {
    console.log(proff, course1, class1, date, time, syllabus);
    try {
      const result = await getComments();
      console.log(result);
      if (result != null) {
        console.log("hiii");
        let flag = false;
        for (let i = 0; i < result.length; i++) {
          if (result[i].professor_name == proff) {
            console.log(result[i].comments[class1], class1);
            flag = true;
            if (Object.keys(result[i].comments).includes(class1)) {
              console.log("hiii");
              console.log(result[i]);
              if (result[i].comments[class1].length == 30) return;
              result[i].comments[class1].push({
                date: date,
                time: time,
                syllabus: syllabus,
                course: course1,
              })
              const record = await pb.collection("proff_comments").update(result[i].id, result[i]);
              return;
            }
          }
        }
        if (!flag) {
          let temp = {}
          temp[class1] = [{
            date: date,
            time: time,
            syllabus: syllabus,
            course: course1,
          }]
          const record = await pb.collection("proff_comments").create({
            "professor_name": proff,
            "comments":
              temp,
          });
          console.log(record);
        }
        return;
      }
      let temp = {}
      temp[class1] = [{
        date: date,
        time: time,
        syllabus: syllabus,
        course: course1,
      }]
      const record = await pb.collection("proff_comments").create({
        "professor_name": proff,
        "comments":
          temp
      });
      console.log(record);
      await getComments();
      setComments([...comments, record]);
      return;
    }
    catch (e) {
      console.log(e);
    }
  }

  // function to get comments
  const getComments = async () => {
    try {
      const record = await pb.collection("proff_comments").getFullList();
      console.log(record);
      setComments(record);
      return record;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }

  // function to get all courses of a proff
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

  // function to fetch all proffessor's timetables
  const fetchTimetable = async () => {
    try {
      const record = await pb.collection("timetable").getFullList();
      setProffTimetable(record[1].timetable)
    } catch (e) { }
  }

  // useEffect hook to load all data needed for the page
  useEffect(() => {
    fetchTimetable();
    getComments();
    // console.log(pb.authStore.model.isStudent);
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

  const splitCourse = (course) => {
    let temp = course.split(" ");
    let year2 = temp[0] + " " + temp[1] + " " + temp[2];
    let temp2 = course.replace(year2, "").trim();
    let class1 = temp2.replace("Cyber Security", "").trim()
    class1 = class1.replace("IoT Section A", "").trim()
    class1 = class1.replace("IoT Section B", "").trim()
    class1 = class1.replace("AIDS Section A", "").trim()
    class1 = class1.replace("AIDS Section B", "").trim()
    class1 = class1.replace("AIDS Section C", "").trim();
    let classCourse = course.replace(year2, "").replace(class1, "").trim();
    return [year2, class1, classCourse];
  }


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
              <ScrollArea className="w-[200px] h-[600px]">
                <div className="flex flex-col ml-12 font-mono border-x-[1px] border-t-[1px]">
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
                <ScrollBar />
              </ScrollArea>

              <div className="w-full h-full bg-[#B4D2E7] p-4">
                <ScrollArea className="w-[1200px] border px-2">
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
                              style={{
                                width: "300px",
                                fontSize: "0.8rem"
                              }}
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
                              style={{
                                width: "300px",
                                fontSize: "0.8rem"
                              }}
                              onClick={() => {
                                setCurrentCourse(course1);
                              }}
                            >
                              {course1}
                            </div>
                          ))
                    }
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {currentCourse != "" && currentProff != "" && (
                  <>
                    <div>
                      {comments.map((comment, index) => {
                        if (comment.professor_name == currentProff) {
                          if (Object.keys(comment.comments).includes(splitCourse(currentCourse)[0] + " " + splitCourse(currentCourse)[2])) {
                            return comment.comments[splitCourse(currentCourse)[0] + " " + splitCourse(currentCourse)[2]].map((comment1, index) => (
                              <div className="flex flex-col gap-4 bg-[#f8f8f8] bg-opacity-25 p-4 m-4">
                                <div className="flex gap-4">
                                  <div className="font-semibold">Date:</div>
                                  <div>{comment1.date}</div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="font-semibold">Time:</div>
                                  <div>{comment1.time}</div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="font-semibold">Syllabus Covered:</div>
                                  <div>{comment1.syllabus}</div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="font-semibold">Course:</div>
                                  <div>{comment1.course}</div>
                                </div>
                              </div>
                            ))
                          }
                        }
                      })}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center justify-center bg-[#B4D2E7] text-white rounded-full p-2"
                          onClick={() => {
                            // console.log(comments[0].comments["Cyber Security"]);
                            const [classYear, courseCode, classCourse] = splitCourse(currentCourse);
                            setProff(currentProff);
                            setClass1(classYear + " " + classCourse);
                            setCourse1(courseCode);
                          }}>
                          <Plus size={40} className="bg-[#B4D2E7]" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#B4D2E7]">
                        <DialogHeader>
                          <DialogTitle className="font-mono font-black">Course Details</DialogTitle>
                          <DialogDescription className="font-mono pb-0">
                            <div className="flex gap-2 mt-5">
                              <div className="flex flex-col mr-2 justify-center items-left gap-1 w-[130px] h-[100px]">
                                <div className="flex w-[150px] h-[50px]">
                                  <div className="font-semibold">Professor:</div>
                                  <div className="ml-2">{currentProff}</div>
                                </div>
                                <div className="flex w-[150px] h-[100px]">
                                  <div className="font-semibold">Course:</div>
                                  <div className="ml-2">{splitCourse(currentCourse)[1]} </div>
                                </div>
                              </div>
                              <div className="flex flex-col ml-4 justify-center items-left gap-4">
                                <div className="flex w-[290px] h-[100px]">
                                  <div className="font-semibold">Class:</div>
                                  <div className="ml-2">{
                                    splitCourse(currentCourse)[0] + " " + splitCourse(currentCourse)[2]
                                  }
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogTitle className="text-black font-black"> Class Details</DialogTitle>
                            <div className="flex flex-col gap-2 mt-5">
                              <div className="flex items-center m-0 p-0">
                                <div className="font-semibold m-0 p-0">Date:</div>
                                <div className="ml-2 m-0 p-0">
                                  <Popover className="m-0 p-0">
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className=""
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
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover></div>
                              </div>
                              <div className="flex items-center">
                                <div className="font-semibold">Time:</div>
                                <div className="ml-2">
                                  <Select className="h-1/2" onValueChange={(e) => {
                                    console.log(e);
                                    setTime(e);
                                  }}>
                                    <SelectTrigger className="h-1/2">
                                      <SelectValue placeholder="pick a time slot" />
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
                                    value={syllabus}
                                    onChange={(e) => {
                                      setSyllabus(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogClose>
                          <Button asChild>
                            <div onClick={postComments}>
                              Submit
                            </div>
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </>
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