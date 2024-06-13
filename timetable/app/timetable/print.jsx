import jsPDF from "jspdf";
export async function generatePDF(timetableData) {
  let id;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "cm",
    format: [23, 14],
  });
  const classname = Object.keys(timetableData)[0];
  if (classname[0] == "1") {
    id = 1;
  } else {
    id = 2;
  }
  const timeTable = timetableData[classname];
  const tablePosition = [
    [
      [
        [3.6, 3.4],
        [5.7, 3.4],
        [9.2, 3.4],
        [11.3, 3.4],
        [14.8, 3.4],
        [16.9, 3.4],
        [19 + 1.4, 3.4],
      ],
      [
        [3.6, 4.5],
        [5.7, 4.5],
        [9.2, 4.5],
        [11.3, 4.5],
        [14.8, 4.5],
        [16.9, 4.5],
        [19 + 1.4, 4.5],
      ],
      [
        [3.6, 5.6],
        [5.7, 5.6],
        [9.2, 5.6],
        [11.3, 5.6],
        [14.8, 5.6],
        [16.9, 5.6],
        [19 + 1.4, 5.6],
      ],
      [
        [3.6, 6.7],
        [5.7, 6.7],
        [9.2, 6.7],
        [11.3, 6.7],
        [14.8, 6.7],
        [16.9, 6.7],
        [19 + 1.4, 6.7],
      ],
      [
        [3.6, 7.8],
        [5.7, 7.8],
        [9.2, 7.8],
        [11.3, 7.8],
        [14.8, 7.8],
        [16.9, 7.8],
        [19 + 1.4, 7.8],
      ],
    ],
    [
      [
        [3.6, 3.4],
        [5.7, 3.4],
        [9.2 - 1.4, 3.4],
        [11.3, 3.4],
        [14.8 - 1.4, 3.4],
        [16.9, 3.4],
        [19 + 1.4, 3.4],
      ],
      [
        [3.6, 4.5],
        [5.7, 4.5],
        [9.2 - 1.4, 4.5],
        [11.3, 4.5],
        [14.8 - 1.4, 4.5],
        [16.9, 4.5],
        [19 + 1.4, 4.5],
      ],
      [
        [3.6, 5.6],
        [5.7, 5.6],
        [9.2 - 1.4, 5.6],
        [11.3, 5.6],
        [14.8 - 1.4, 5.6],
        [16.9, 5.6],
        [19 + 1.4, 5.6],
      ],
      [
        [3.6, 6.7],
        [5.7, 6.7],
        [9.2 - 1.4, 6.7],
        [11.3, 6.7],
        [14.8 - 1.4, 6.7],
        [16.9, 6.7],
        [19 + 1.4, 6.7],
      ],
      [
        [3.6, 7.8],
        [5.7, 7.8],
        [9.2 - 1.4, 7.8],
        [11.3, 7.8],
        [14.8 - 1.4, 7.8],
        [16.9, 7.8],
        [19 + 1.4, 7.8],
      ],
    ],
  ];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const title = "Shiv Nadar University Chennai Kalavakkam - 603110";
  const subTitle1 =
    "School of Engineering - Department of Computer and Engineering";
  const subTitle2 = "Timetable for II Semester 2023-2024";
  const subTitle3 = "With Effect from 22.01.2024";
  const room = "206 (Academic Block 2)";
  const classAdvisor = "Dr. Padmavathi U";
  const multiCourseCommitteeChairman = "Dr. T Nagarajan";

  doc.setFontSize(6);
  doc.setFont("Helvetica", "bold");
  doc.text(title, pageWidth / 2, 1 - 0.5, { align: "center" });
  doc.text(subTitle1, pageWidth / 2, 1.3 - 0.5, { align: "center" });
  doc.text(subTitle2, pageWidth / 2, 1.6 - 0.5, { align: "center" });
  doc.text(subTitle3, pageWidth / 2, 1.9 - 0.5, { align: "center" });

  doc.text("Class: " + classname, pageWidth / 4.5, 2.2 - 0.5, {
    align: "center",
  });
  doc.text("Room No. " + room, pageWidth / 4.5, 2.5 - 0.5, {
    align: "center",
  });
  doc.text("Class Advisor: " + classAdvisor, (3.2 * pageWidth) / 4, 2.5 - 0.5, {
    align: "center",
  });
  doc.text(
    "Multi-Course Committee Chairman: " + multiCourseCommitteeChairman,
    pageWidth / 2,
    2.8 - 0.5,
    { align: "center" }
  );

  doc.setFillColor(221, 229, 255);
  doc.setLineWidth(0.01);
  doc.rect(1.5, 2.8, 2, 0.5, "DF");
  doc.rect(1.5, 2.8 + 0.6, 2, 1, "DF");
  doc.rect(1.5, 2.8 + 0.6 + 1.1, 2, 1, "DF");
  doc.rect(1.5, 2.8 + 0.6 + 1.1 + 1.1, 2, 1, "DF");
  doc.rect(1.5, 2.8 + 0.6 + 1.1 + 1.1 + 1.1, 2, 1, "DF");
  doc.rect(1.5, 2.8 + 0.6 + 1.1 + 1.1 + 1.1 + 1.1, 2, 1, "DF");

  doc.text("Day", 2.5, 3.7 - 0.6, { align: "center" });
  doc.text("monday", 2.5, 4.55 - 0.6, { align: "center" });
  doc.text("tuesday", 2.5, 4.55 + 1.1 - 0.6, { align: "center" });
  doc.text("wednesday", 2.5, 4.55 + 1.1 + 1.1 - 0.6, { align: "center" });
  doc.text("thursday", 2.5, 4.55 + 1.1 + 1.1 + 1.1 - 0.6, {
    align: "center",
  });
  doc.text("friday", 2.5, 4.55 + 1.1 + 1.1 + 1.1 + 1.1 - 0.6, {
    align: "center",
  });

  if (id == 1) {
    doc.setFillColor(221, 229, 255);
    doc.rect(3.6, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 2.1 + 2.1, 2.8, 1.3, 1.1 + 1.1 + 1.1 + 1.1 + 1.6, "DF"); //
    doc.rect(3.6 + 1.4 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 1.4 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(
      3.6 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1,
      2.8,
      1.3,
      1.1 + 1.1 + 1.1 + 1.1 + 1.6,
      "DF"
    ); //
    doc.rect(3.6 + 1.4 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 1.4 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    //doc.setFillColor(0, 0, 0);
    doc.rect(
      3.6 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 3.5,
      2.8,
      1.3,
      1.1 + 1.1 + 1.1 + 1.1 + 1.6,
      "DF"
    );
    doc.rect(
      3.6 + 1.4 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 1.4,
      2.8,
      2,
      0.5,
      "DF"
    );

    doc.text("8.10-9.00", 4.65, 2.8 + 0.3, { align: "center" });
    doc.text("9.00-9.50", 4.65 + 2.1, 2.8 + 0.3, { align: "center" });
    doc.text("10.10-11.00", 4.65 + 3.5 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("11.00-11.50", 4.65 + 3.5 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("12.50-1.40", 4.65 + 7 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("1.40-2.30", 4.65 + 7 + 2.1 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("2.40-3.30", 4.65 + 7 + 2.1 + 2.1 + 2.1 + 2.1 + 1.4, 2.8 + 0.3, {
      align: "center",
    });

    for (let i = 0; i < timeTable.length; i++) {
      const day = timeTable[i];
      let a = 0;
      for (let j = 0; j < day.length; j++) {
        let subject = day[j];
        if (j == 2 || j == 5 || j == 8) continue;
        doc.setFillColor(221, 229, 255);
        doc.rect(
          tablePosition[id - 1][i][a][0],
          tablePosition[id - 1][i][a][1],
          2,
          1,
          "DF"
        );
        if (subject.search(" T ") != -1) {
          subject = subject.replaceAll(" T ", "(T) ");
        }
        subject = subject.replaceAll(" ", "\n");
        doc.text(
          subject,
          tablePosition[id - 1][i][a][0] + 1,
          tablePosition[id - 1][i][a][1] + 0.5,
          { align: "center" }
        );
        a++;
      }
    }
  } else {
    doc.setFillColor(221, 229, 255);
    doc.rect(3.6, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(
      3.6 + 2.1 + 2.1 + 2.1,
      2.8,
      1.3,
      1.1 + 1.1 + 1.1 + 1.1 + 1.6,
      "DF"
    );
    doc.rect(3.6 + 1.4 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    // doc.setFillColor(0, 0, 0);
    doc.rect(
      3.6 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1,
      2.8,
      1.3,
      1.1 + 1.1 + 1.1 + 1.1 + 1.6,
      "DF"
    ); //
    doc.rect(3.6 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    doc.rect(3.6 + 1.4 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1, 2.8, 2, 0.5, "DF");
    //doc.setFillColor(0, 0, 0);
    doc.rect(
      3.6 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 3.5,
      2.8,
      1.3,
      1.1 + 1.1 + 1.1 + 1.1 + 1.6,
      "DF"
    );
    doc.rect(
      3.6 + 1.4 + 1.4 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 2.1 + 1.4,
      2.8,
      2,
      0.5,
      "DF"
    );

    doc.text("8.10-9.00", 4.65, 2.8 + 0.3, { align: "center" });
    doc.text("9.00-9.50", 4.65 + 2.1, 2.8 + 0.3, { align: "center" });
    doc.text("9.50-10.40", 4.65 - 1.4 + 3.5 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("11.00-11.50", 4.65 + 3.5 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("11.50-12.40", 4.65 + 7 - 1.4 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("1.40-2.30", 4.65 + 7 + 2.1 + 2.1 + 2.1, 2.8 + 0.3, {
      align: "center",
    });
    doc.text("2.40-3.30", 4.65 + 7 + 2.1 + 2.1 + 2.1 + 2.1 + 1.4, 2.8 + 0.3, {
      align: "center",
    });

    for (let i = 0; i < timeTable.length; i++) {
      const day = timeTable[i];
      let a = 0;
      for (let j = 0; j < day.length; j++) {
        let subject = day[j];
        if (j == 3 || j == 6 || j == 8) continue;
        doc.setFillColor(221, 229, 255);
        doc.rect(
          tablePosition[id - 1][i][a][0],
          tablePosition[id - 1][i][a][1],
          2,
          1,
          "DF"
        );
        if (subject.search(" T ") != -1) {
          subject = subject.replaceAll(" T ", "(T) ");
        }
        subject = subject.replaceAll(" ", "\n");
        doc.text(
          subject,
          tablePosition[id - 1][i][a][0] + 1,
          tablePosition[id - 1][i][a][1] + 0.5,
          { align: "center" }
        );
        a++;
      }
    }
  }
  // table of faculty
  const faculty = [
    {
      EN1002: [
        "English for Engineers",
        "Dr.Cherry Mathews Philipose",
        "CMP",
        "HS",
        3,
      ],
    },
    {
      MA1002: ["Probability and Statistics", "Dr.Vembarasen", "VV", "BS", 3],
    },
    {
      CS1002: [
        "Programming in Python",
        "Dr.Anushya Racheal GladSon",
        "AR",
        "ES",
        2,
      ],
    },
    {
      CS1006T: ["Data Structures", "Dr.Kandappan V", "KVA", "PC", 3],
    },
    {
      CS1004: [
        "Computer Organization and Architecture",
        "Dr.Vegesna ",
        "SVM",
        "ES",
        3,
      ],
    },
    {
      CS1006T: ["Classical Cryptography", "Dr.Subim Sahayam B", "SBS", "ES", 3],
    },
    {
      CS1804T: ["Data Structures Lab", "Dr.Kandappan V", "KVA", "PC", 2],
    },
    { CS1802: ["Cyber Security", "Dr.Amsaprabhaa M", "AM", "ES", 2] },
  ];

  doc.setFontSize(6);
  doc.setFont("Helvetica", "bold");
  doc.text("Course Code", 4.65, 9.825 - 0.6, { align: "center" });
  doc.text("Course Title", 4.6 + 3, 9.825 - 0.6, { align: "center" });
  doc.text("Faculty", 4.65 + 6.4, 9.825 - 0.6, { align: "center" });
  doc.text("Intials", 4.55 + 8.5, 9.825 - 0.6, { align: "center" });
  doc.text("Category", 4.65 + 9.4, 9.825 - 0.6, { align: "center" });
  doc.text("Credits", 4.65 + 10.4, 9.825 - 0.6, { align: "center" });
  doc.setFont("Helvetica", "normal");

  for (let i = 0; i < faculty.length; i++) {
    const course = faculty[i];
    const key = Object.keys(course)[0];
    const value = course[key];
    doc.text(key, 4.65, 9.6 + i * 0.5, { align: "center" });
    doc.text(value[0], 4.65 + 1, 9.6 + i * 0.5, { align: "left" });
    doc.text(value[1], 4.65 + 3 + 2, 9.6 + i * 0.5, { align: "left" });
    doc.text(value[2], 4.65 + 6.4 + 2, 9.6 + i * 0.5, {
      align: "center",
    });
    doc.text(value[3], 4.65 + 8.4 + 1, 9.6 + i * 0.5, {
      align: "center",
    });
    doc.text(`${value[4]}`, 4.65 + 9.4 + 1, 9.6 + i * 0.5, {
      align: "center",
    });
  }

  // line around the table
  doc.setLineWidth(0.01);
  // title
  doc.line(3.65 + 0.26, 9, 4.65 + 10.9, 9);
  doc.line(3.65 + 0.26, 9.3, 4.65 + 10.9, 9.3);
  // coloumns
  doc.line(3.65 + 0.26, 9, 3.65 + 0.26, 13.2);
  doc.line(3.65 + 1.8, 9, 4.65 + 0.8, 13.2);
  doc.line(3.65 + 5.9, 9, 4.65 + 4.9, 13.2);
  doc.line(3.65 + 8.9, 9, 3.65 + 8.9, 13.2);
  doc.line(3.65 + 9.9, 9, 3.65 + 9.9, 13.2);
  doc.line(3.65 + 10.9, 9, 3.65 + 10.9, 13.2);
  doc.line(3.65 + 11.9, 9, 3.65 + 11.9, 13.2);
  // last line
  doc.line(3.65 + 0.26, 13.2, 4.65 + 10.9, 13.2);

  doc.setFontSize(6);
  doc.text(
    "HS-Humanities and Social Science including Management courses\nBS: Basic Science courses \nES: Engineering Science Courses\nPC: Professional core courses \nEAA : Extra Academic Activity, \nMULYA PRAVAH 2.0: Inculcation of Human Values and \n      Professional Ethics in Higher Education Instutions",
    pageWidth / 2 - 4.65 + 8.9,
    9.3,
    { align: "left" }
  );

  //save the pdf
  doc.save(`${Object.keys(timetableData)[0]}.pdf`);
}
