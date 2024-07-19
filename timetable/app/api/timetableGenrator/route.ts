import { NextRequest, NextResponse } from "next/server";
import { randomize } from "./algo";


export async function POST(request: NextRequest) {
    try {
        // Parse the incoming request body
        // console.log(request.body);
        const body = await request.json();
        // console.log(body);
        const class_courses = body[0];
        const professors = body[1];
        const proffs_names_to_short = body[2];
        const labs = body[3];
        const parameter = body[4];
        const lockedClasses = body[5];
        const timetableProfessors = body[6];
        const timetableClasses = body[7];
        const timetableLabs = body[8];

        // console.log(class_courses, professors, proffs_names_to_short, labs, parameter, lockedClasses, timetableProfessors, timetableClasses, timetableLabs);
        const result = randomize(class_courses, professors, proffs_names_to_short, labs, parameter, lockedClasses, timetableProfessors, timetableClasses, timetableLabs, [["Mr.Prawin Raj", [2, 3], [0, 1, 2, 3, 4, 6, 7]]]);
        // console.log(result);
        return NextResponse.json({ result }, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
