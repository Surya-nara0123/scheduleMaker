'use client'
import { useState } from "react";
const Modal = ({ isOpen, onClose, selectedClasss, Slot }) => {
    // const onClose = () => {
    //     // Close the modal

    //     }
    const handleSubmit = () => {
      // Handle submission logic here (e.g., sending data to server)
      onClose();
      console.log(selectedClasss);
    };
    // const [selectedSlot, setSelectedSlot] = useState(null); // To store the selected slot data
    const [Datee, setDateValue] = useState("");
    const [Day, setDayValue] = useState("");
    // const [Slot, setSlotValue] = useState("");
    const [Course, setCourseValue] = useState("");
    const [Class, setClassValue] = useState("");
    const [Syllabus, setSyllabusValue] = useState("");

    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Enter Details</h2>
          <input
            type="date"
            value={Datee}
            onChange={(e) => setDateValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Date"
          />
          <input
            type="text"
            value={Day}
            onChange={(e) => setDayValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Day"
          />
          <input
            type="number"
            value={Slot}
            // onChange={(e) => setSlotValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Slot"
          />
           {/* <input
            type="text"
            value={Course}
            onChange={(e) => setCourseValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Course"
          /> */}
           <input
            type="text"
            value={Class}
            onChange={(e) => setClassValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Class"
          />
          <input type="text" className="border-gray-300 border rounded-lg p-2 mb-2 w-full" name="" id="" value={selectedClasss}/>
           <input
            type="text"
            value={Syllabus}
            onChange={(e) => setSyllabusValue(e.target.value)}
            className="border-gray-300 border rounded-lg p-2 mb-2 w-full"
            placeholder="Syllabus Taught"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-2"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-2 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
export default Modal;