import csv
professors = ["Proff" + str(i) for i in range(0, 31)]
class_courses = {
    "1st Year B_Tech AIDS Section A": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 4, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 4, "L", professors[6]],     # Programming in C L
        ["PHY102", 4, "L", professors[7]]      # Engineering Physics L
    ],
    "1st Year B_Tech AIDS Section B": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[8]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[9]],  # Programming in C
        ["ECE101", 4, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 4, "L", professors[9]],     # Programming in C L
        ["PHY102", 4, "L", professors[7]]      # Engineering Physics L
    ],
    "1st Year B_Tech AIDS Section C": [
        ["ENG101", 3, "T", professors[10]],  # Communicative English
        ["MTH101", 4, "T", professors[8]],  # Linear Algebra
        ["PHY101", 3, "T", professors[14]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[9]],  # Programming in C
        ["ECE101", 4, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 4, "L", professors[9]],     # Programming in C L
        ["PHY102", 4, "L", professors[14]]      # Engineering Physics L
    ],
    "1st Year B_Tech IoT Section A": [
        ["ENG101", 3, "T", professors[10]],  # Communicative English
        ["MTH101", 3, "T", professors[11]],  # Linear Algebra
        ["PHY103", 3, "T", professors[9]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[12]],  # Programming in C
        ["ECE103", 3, "T", professors[13]],     # Digital Design + L
        ["CSE102", 4, "L", professors[12]],     # Programming in C L
        ["ECE104", 4, "L", professors[13]]      # MicroProcessor Lab
    ],
    "1st Year B_Tech IoT Section B": [
        ["ENG101", 3, "T", professors[10]],  # Communicative English
        ["MTH101", 3, "T", professors[8]],  # Linear Algebra
        ["PHY103", 3, "T", professors[9]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[6]],  # Programming in C
        ["ECE103", 3, "T", professors[13]],     # Digital Design + L
        ["CSE102", 4, "L", professors[6]],     # Programming in C L
        ["ECE104", 4, "L", professors[13]]      # Engineering Physics L
    ],
    "1st Year B_Tech Cyber Security": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[14]],  # Engineering Physics
        ["CSE201", 4, "T", professors[6]],  # Cyber Security Essentials
        ["CSE101", 3, "T", professors[5]],  # Programming in C
        ["ECE101", 4, "LT", professors[12]],     # Digital Design + L
        ["CSE102", 4, "L", professors[5]],     # Programming in C L
        ["PHY102", 4, "L", professors[14]]      # Engineering Physics L
    ],
    "2nd Year B_Tech AIDS Section A": [
        ["MTH201", 4, "T", professors[15]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[16]],  # Object Oriented Programming
        ["CSE203", 5, "LT", professors[4]],   # Operating Systems L
        ["CSE204", 3, "T", professors[17]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[18]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[19]], # Cognitive Psychology
        ["CSE206", 4, "L", professors[16]],     # Object Oriented Programming L
        ["CSE207", 4, "L", professors[18]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech AIDS Section B": [
        ["MTH201", 4, "T", professors[20]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[16]],  # Object Oriented Programming
        ["CSE203", 5, "LT", professors[4]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[17]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[18]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[19]], # Cognitive Psychology
        ["CSE206", 4, "L", professors[16]],     # Object Oriented Programming L
        ["CSE207", 4, "L", professors[18]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech AIDS Section C": [
        ["MTH201", 4, "T", professors[20]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[16]],  # Object Oriented Programming
        ["CSE203", 5, "LT", professors[4]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[17]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[18]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[19]], # Cognitive Psychology
        ["CSE206", 4, "L", professors[16]],     # Object Oriented Programming L
        ["CSE207", 4, "L", professors[18]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech IoT Section A": [
        ["MTH201", 4, "T", professors[20]],  # Discrete Mathematics
        ["CSE211", 3, "T", professors[21]], # Data Structures
        ["CSE202", 3, "T", professors[22]],  # Object Oriented Programming
        ["CSE208", 3, "T", professors[23]], # Database Management System
        ["CSE212", 3, "T", professors[24]], # Software Engineering and Design
        ["CSE206", 4, "L", professors[21]],     # Data Structures L
        ["CSE210", 4, "L", professors[23]]     # Database Management L
    ],
    "2nd Year B_Tech IoT Section B": [
        ["MTH201", 4, "T", professors[15]],  # Discrete Mathematics
        ["CSE211", 3, "T", professors[21]], # Data Structures
        ["CSE202", 3, "T", professors[22]],  # Object Oriented Programming
        ["CSE208", 3, "T", professors[23]], # Database Management System
        ["CSE212", 3, "T", professors[24]], # Software Engineering and Design
        ["CSE206", 4, "L", professors[21]],     # Data Structures L
        ["CSE210", 4, "L", professors[23]]     # Database Management L
    ],
    "2nd Year B_Tech Cyber Security": [
        ["MTH201", 3, "T", professors[25]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[22]],  # Object Oriented Programming
        ["CSE208", 3, "T", professors[27]], # Database Management System
        ["CSE203", 5, "LT", professors[26]],     # Operating Systems + L
        ["CSE209", 2, "T", professors[28]],  # Modern Cryptography
        ["PSY201", 2, "T", professors[19]], # Cognitive Psychology
        ["CSE206", 4, "L", professors[22]],     # Object Oriented Programming L
        ["CSE210", 4, "L", professors[27]]    # Database Management L
    ]
}

with open('class_courses.csv', 'w', newline='') as csvfile:
  writer = csv.writer(csvfile)
  writer.writerow(["Course", "Credits", "Type", "Professor"])

  for section, courses in class_courses.items():
    writer.writerow([section])
    for course in courses:
      writer.writerow(course)

print("CSV file created successfully!")