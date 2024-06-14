// Import statements
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Fetch data from the API endpoint
        const res = await fetch("https://snuc.pockethost.io/api/collections/timetable/records", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Check if the response is successful
        if (res.ok) {
            // Parse JSON response
            const data = await res.json();
            // console.log(data); // Log the response data

            // Return the response with JSON data
            return NextResponse.json(data["items"][0]["timetable"], {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            // Handle non-successful response
            console.error("Error:", res.status, res.statusText);

            // Return an error response
            return NextResponse.json({ message: 'Failed to fetch data' }, {
                status: res.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
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
