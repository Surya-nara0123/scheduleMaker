import React from "react";
import Sidebar from "../Components/Sidebar";

export default function ProffessorRoute() {
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
            <select className="bg-white rounded-lg p-2">
              <option defaultChecked>Select your class or course</option>
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
            <button
              className="bg-green-500 justify-center items-center rounded-lg p-2"
              // onClick={fetchTimetable}
            >
              Show Timetable
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
