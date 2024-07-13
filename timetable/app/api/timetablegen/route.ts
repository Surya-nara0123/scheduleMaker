import { NextRequest, NextResponse } from 'next/server';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://snuc.pockethost.io');

export async function POST(request: NextRequest) {
    try {
        // Parse the incoming request body
        console.log(request.body);
        const timetabl = await request.json();

        // Fetch data from the API endpoint
        const data = {
          timetable: timetabl[0],
        };
        const data1 = {
          timetable: timetabl[1],
        };
        const record1 = await pb
          .collection("timetable")
          .update("gmivv6jb0cqo2m5", data1);
    
        const record = await pb
          .collection("timetable")
          .update("wizw6h9iga918ub", data);
    

        // Check if the response is successful
        }
        catch (error) {
        // Handle errors
        console.error("Error:", error);

        // Return an error response
        return NextResponse.json({ message: 'Internal Server Error' }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
