import { NextRequest, NextResponse } from 'next/server';
const pg = require('pg');

export async function POST(request: NextRequest) {
  try {
    const client = new pg.Client({
      user: "postgres",
      password: "",
      host: "localhost",
      port: 5432,
      database: "schedule1"
    })
    // console.log(client);
    const response = await client.connect();
    console.log("connected");

    const body1 = await request.json();
    const body = body1[0];
    const profTable = body1[1];
    // console.log(body);
    const keys = Object.keys(body);
    for (let i = 0; i < keys.length; i++) { // keys
      for (let j = 0; j < body[keys[i]].length; j++) { // days
        for (let k = 0; k < body[keys[i]][j].length; k++) { // slots
          const class_name = keys[i];
          const day = j;
          const slot = k;
          let course_code, prof_short, is_lab, lab_no, is_self_learning;
          if ((body[keys[i]][j][k] == "Break") || (body[keys[i]][j][k] == "Lunch")) {
            // console.log(body[keys[i]][j][k]);
            course_code = body[keys[i]][j][k];
            prof_short = '';
            is_lab = false;
            lab_no = "";
            is_self_learning = false;
          } else if (body[keys[i]][j][k] == "Self-Learning") {
            // console.log(body[keys[i]][j][k]);
            course_code = '';
            prof_short = '';
            is_lab = false;
            lab_no = "";
            is_self_learning = true;
          } else {
            let list = body[keys[i]][j][k].split(" ");
            // console.log(list);
            course_code = list[0];
            prof_short = list[1];
            if (list.length == 5) {
              is_lab = true;
              lab_no = list[2] + "/" + list[3];
              is_self_learning = false;
            }
            else {
              is_lab = false;
              lab_no = "";
              is_self_learning = false;
            }

          }

          // console.log(class_name, day, slot, course_code, prof_short, is_lab, lab_no, is_self_learning);
          const query = `INSERT INTO timetable (class_name, day, slot, course_code, prof_short, is_lab, lab_no, is_self_learning) VALUES ('${class_name}', ${day}, ${slot}, '${course_code}', '${prof_short}', ${is_lab}, '${lab_no}', ${is_self_learning})`;
          try { client.query(query); }
          catch (error) {
          }
        }
      }
    }

    

    return NextResponse.json({ message: "success" }, {
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
  // try {
  //   const client = new pg.Client({
  //     user:"postgres",
  //     password:"",
  //     host:"localhost",
  //     port:5432,
  //     database:"timetable"
  //   });
  //     // Parse the incoming request body
  //     console.log(request.body);
  //     const timetabl = await request.json();

  //     // Fetch data from the API endpoint
  //     const data = {
  //       timetable: timetabl[0],
  //     };
  //     const data1 = {
  //       timetable: timetabl[1],
  //     };
  //     const record1 = await pb
  //       .collection("timetable")
  //       .update("gmivv6jb0cqo2m5", data1);

  //     const record = await pb
  //       .collection("timetable")
  //       .update("wizw6h9iga918ub", data);


  //     // Check if the response is successful
  //     }
  //     catch (error) {
  //     // Handle errors
  //     console.error("Error:", error);

  //     // Return an error response
  //     return NextResponse.json({ message: 'Internal Server Error' }, {
  //         status: 500,
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //     });
  // }
}
