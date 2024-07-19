// Import statements
import { NextRequest, NextResponse } from 'next/server';
const pg = require('pg');

type Timetable = {
    [key: string]: string[][];
}
export async function GET(request: Request) {
    try {
        const client = new pg.Client({
            user: "postgres",
            password: "",
            host: "localhost",
            port: 5432,
            database: "schedule1"
        });

        const response = await client.connect();
        console.log("connected");

        let query = `SELECT * FROM timetable`;
        const result = await client.query(query);
        let query2 = `SELECT * FROM course_details`;
        const result2 = await client.query(query2);
        query2 = `SELECT * FROM prof_short`;
        const result3 = await client.query(query2);

        // console.log(
        //     result.rows, result2.rows, result3.rows
        // )
        console.log(result.rows.length);
        let timetables: Timetable = {};
        for (let i = 0; i < result.rows.length; i++) {
            if(!timetables[result.rows[i].class_name]){
                timetables[result.rows[i].class_name] = [[], [], [], [], []];
            }
            try {
                if (result.rows[i].course_code == "") {
                    timetables[result.rows[i].class_name][result.rows[i].day].push("Self-Learning");
                    continue;
                }
            } catch (error) {
                console.error("Error1:", error);
                console.log(timetables[result.rows[i].class_name]);
                break;
            }
            try {
                if (result.rows[i].course_code == "Break" || result.rows[i].course_code == "Lunch") {
                    timetables[result.rows[i].class_name][result.rows[i].day].push(result.rows[i].course_code);
                    continue;
                }
            } catch (error) {
                console.error("Error2:", error);
                break;
            }
            try {
                if (result.rows[i].is_lab) {
                    timetables[result.rows[i].class_name][result.rows[i].day].push(result.rows[i].course_code + " " + result.rows[i].prof_short + " " + result.rows[i].lab_no);
                    continue;
                }
            } catch (error) {
                console.error("Error3:", error);
                break;
            }
            try {
                timetables[result.rows[i].class_name][result.rows[i].day].push(result.rows[i].course_code + " " + result.rows[i].prof_short);

            } catch (error) {
                console.error("Error4:", error);
                break;
            }
        }
        console.log(timetables);

        return NextResponse.json({ timetables }, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            }
        })


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
