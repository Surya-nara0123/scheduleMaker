#!/usr/bin/python3
import time
import random
import pprint
import copy

def leftover_check(leftover):
    for i,j in zip(leftover.keys(), leftover.values()):
        if j != []:
            return True
    return False

def is_free(timetable_professors, day, slot, prof):
    return timetable_professors[prof][day][slot] == ""

def make_random():
    current_time_ns = time.time_ns()
    random.seed(current_time_ns)
    return random.random() * 100000000

def update_timetable_1(req_classes, timetable_classes, timetable_professors, clas, day, slot):
    if timetable_classes[clas][day][slot] != "":
        return
    if not req_classes:
        return

    free = [y for y in req_classes if is_free(timetable_professors, day, slot, y[3])]
    if not free:
        return

    rand = int((make_random() // 1) % len(free))
    timetable_classes[clas][day][slot] = free[rand][0]
    pos = next(z for z in range(len(req_classes)) if free[rand] == req_classes[z])
    req_classes[pos][1] -= 1
    timetable_professors[req_classes[pos][3]][day][slot] = clas
    if req_classes[pos][1] == 0:
        req_classes.pop(pos)

def update_timetable_2(proffs, req_classes, timetable_classes, timetable_professors, clas, day, slot):
    available = [j for j in proffs if is_free(timetable_professors, day, slot, j)]

    if not available:
        return
    
    for proff in available:
        for a in range(len(timetable_professors[proff])):
            for b in range(len(timetable_professors[proff][a])):
                if(timetable_professors[proff][a][b] == clas):
                    for z in range(len(req_classes)):
                        if(is_free(timetable_professors, a, b, req_classes[z][3])):
                            timetable_classes[clas][day][slot] = timetable_classes[clas][a][b]
                            timetable_classes[clas][a][b] = req_classes[z][0]
                            timetable_professors[proff][day][slot] = clas
                            timetable_professors[proff][a][b] = ""
                            timetable_professors[req_classes[z][3]][a][b] = clas
                            req_classes[z][1] -= 1
                            req_classes[:] = [z for z in req_classes if z[1] > 0]
                            return

def find_free_slots(timetable_professors, professor):
    free_slots = []
    for day in range(len(timetable_professors[professor])):
        for slot in range(len(timetable_professors[professor][day])):
            if timetable_professors[professor][day][slot] == "":
                free_slots.append((day, slot))
    return free_slots

def update_timetable_3(class_courses, leftover, timetable_classes, timetable_professors):
    changed = copy.deepcopy(leftover)
    for i,j in zip(changed.keys(), changed.values()):
        proffs = [z[3] for z in j if z != []]
        for proff in proffs:
            print(proff)
            free_slots = find_free_slots(timetable_professors, proff)
            print(free_slots)
            if(free_slots == []):
                pprint.pprint(timetable_professors[proff])
                exit(0)
            pos = int((make_random() // 1) % len(free_slots))
            day, slot = free_slots[pos]
            print(free_slots[pos], day, slot)
            if(timetable_classes[i][day][slot] == ""):
                for k in leftover[i]:
                    if k[3] == proff:
                        k[1] -= 1
                        timetable_classes[i][day][slot] = k[0]
                        print(k, "--")
                        print(timetable_classes[i][day][slot])
                        leftover[i][:] = [l for l in leftover[i] if l[1] > 0]
                        timetable_professors[proff][day][slot] = i
                        return
            target = ""
            temp = ""
            cou = copy.deepcopy(class_courses[i])
            for z in cou:
                print(z)
                print(timetable_classes[i][day][slot])
                if z[0] == timetable_classes[i][day][slot]:
                    target = z[3]
                    temp = z[2]
                    break
            tmp = [timetable_classes[i][day][slot], 1, temp, target]
            
            for k in leftover[i]:
                if k[3] == proff:
                    k[1] -= 1
                    timetable_classes[i][day][slot] = k[0]
                    print(k, "--")
                    print(timetable_classes[i][day][slot])
                    break
            leftover[i].append(tmp)
            leftover[i][:] = [l for l in leftover[i] if l[1] > 0]

            timetable_professors[target][day][slot] = ""
            timetable_professors[proff][day][slot] = i

            print(leftover)
            print("---------------")
    print(leftover)
    print("????????????????????????????????")

def swap_classes(timetable_classes, timetable_professors, class1, day1, slot1, class2, day2, slot2, prof1, prof2):
    # Swap the classes in the class timetable
    timetable_classes[class1][day1][slot1], timetable_classes[class2][day2][slot2] = \
        timetable_classes[class2][day2][slot2], timetable_classes[class1][day1][slot1]

    # Update the professor timetable
    timetable_professors[prof1][day1][slot1], timetable_professors[prof2][day2][slot2] = \
        class2, class1

def update_timetable_4(leftover, timetable_classes, timetable_professors, class_courses):
    for clas, req_classes in leftover.items():
        for req_class in req_classes:
            course_code, hours, course_type, prof = req_class
            free_slots = find_free_slots(timetable_professors, prof)

            if req_class[1] > 0:
                for j in range(len(timetable_classes[clas])):
                    for k in range(len(timetable_classes[clas][j])):
                        if timetable_classes[clas][j][k] == "":
                            for y in timetable_classes.keys():
                                if y != clas:
                                    for z in range(len(timetable_classes[y])):
                                        for x in range(len(timetable_classes[y][z])):
                                            if timetable_classes[y][z][x] == course_code:
                                                if z < len(class_courses[y]) and x < len(class_courses[y][z]):
                                                    existing_prof = class_courses[y][z][x][3]
                                                    if timetable_professors[existing_prof][j][k] == "":
                                                        swap_classes(timetable_classes, timetable_professors, clas, j, k, y, z, x, prof, existing_prof)
                                                        req_class[1] -= 1
                                                        if req_class[1] == 0:
                                                            break
                                    if req_class[1] == 0:
                                        break
                            if req_class[1] == 0:
                                break

def verify_timetable(class_courses, timetable_classes, timetable_professors):
    # Verify that all classes get their required lectures every week
    for clas, req_classes in class_courses.items():
        for req_class in req_classes:
            course_code, hours, course_type, prof = req_class

            # Count the number of times the course is scheduled for the class
            scheduled_hours = sum(row.count(course_code) for row in timetable_classes[clas])

            if scheduled_hours != hours:
                print(f"Class {clas} does not have the correct number of hours for course {course_code}. Expected: {hours}, Found: {scheduled_hours}")
                pprint.pprint(timetable_classes[clas])
                return False

            # Verify that the professor is correctly assigned
            for day in range(len(timetable_classes[clas])):
                for slot in range(len(timetable_classes[clas][day])):
                    if timetable_classes[clas][day][slot] == course_code:
                        if timetable_professors[prof][day][slot] != clas:
                            print(f"Professor {prof} is not correctly assigned to class {clas} for course {course_code} on day {day} slot {slot}.")
                            return False

    # Verify that professors are assigned correctly
    for prof, schedule in timetable_professors.items():
        for day in range(len(schedule)):
            for slot in range(len(schedule[day])):
                clas = schedule[day][slot]
                if clas == "Lunch":
                    continue
                if clas != "":
                    found = False
                    for req_class in class_courses[clas]:
                        course_code, hours, course_type, required_prof = req_class
                        if required_prof == prof and timetable_classes[clas][day][slot] == course_code:
                            found = True
                            break
                    if not found:
                        print(f"Professor {prof} is assigned to class {clas} on day {day} slot {slot} incorrectly.")
                        return False


    print("All classes have their required lectures, and all professors are correctly assigned.")
    return True

professors = ["Proff" + str(i) for i in range(1, 31)]

class_courses = {
    "1st Year B_Tech AIDS Section A": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 3, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 2, "L", professors[4]],     # Programming in C L
        ["PHY102", 2, "L", professors[2]]      # Engineering Physics L
    ],
    "1st Year B_Tech AIDS Section B": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 3, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 2, "L", professors[4]],     # Programming in C L
        ["PHY102", 2, "L", professors[2]]      # Engineering Physics L
    ],
    "1st Year B_Tech IoT Section A": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 3, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 2, "L", professors[4]],     # Programming in C L
        ["PHY102", 2, "L", professors[2]]      # Engineering Physics L
    ],
    "1st Year B_Tech IoT Section B": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["ENV101", 2, "T", professors[3]],  # Environmental Science and Engineering
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 3, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 2, "L", professors[4]],     # Programming in C L
        ["PHY102", 2, "L", professors[2]]      # Engineering Physics L
    ],
    "1st Year B_Tech Cyber Security": [
        ["ENG101", 3, "T", professors[0]],  # Communicative English
        ["MTH101", 4, "T", professors[1]],  # Linear Algebra
        ["PHY101", 3, "T", professors[2]],  # Engineering Physics
        ["CSE201", 4, "T", professors[6]],  # Cyber Security Essentials
        ["CSE101", 3, "T", professors[4]],  # Programming in C
        ["ECE101", 3, "LT", professors[5]],     # Digital Design + L
        ["CSE102", 2, "L", professors[4]],     # Programming in C L
        ["PHY102", 2, "L", professors[2]]      # Engineering Physics L
    ],
    "2nd Year B_Tech AIDS Section A": [
        ["MTH201", 4, "T", professors[7]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[8]],  # Object Oriented Programming
        ["CSE203", 4, "LT", professors[9]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[10]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[11]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[12]], # Cognitive Psychology
        ["CSE206", 2, "L", professors[8]],     # Object Oriented Programming L
        ["CSE207", 2, "L", professors[11]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech AIDS Section B": [
        ["MTH201", 4, "T", professors[7]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[8]],  # Object Oriented Programming
        ["CSE203", 4, "LT", professors[9]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[10]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[11]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[12]], # Cognitive Psychology
        ["CSE206", 2, "L", professors[8]],     # Object Oriented Programming L
        ["CSE207", 2, "L", professors[11]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech IoT Section A": [
        ["MTH201", 4, "T", professors[7]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[8]],  # Object Oriented Programming
        ["CSE203", 4, "LT", professors[9]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[10]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[11]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[12]], # Cognitive Psychology
        ["CSE206", 2, "L", professors[8]],     # Object Oriented Programming L
        ["CSE207", 2, "L", professors[11]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech IoT Section B": [
        ["MTH201", 4, "T", professors[7]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[8]],  # Object Oriented Programming
        ["CSE203", 4, "LT", professors[9]],     # Operating Systems + L
        ["CSE204", 3, "T", professors[10]], # Artificial Intelligence
        ["CSE205", 2, "T", professors[11]], # Exploratory Data Analysis and Data Visualization
        ["PSY201", 2, "T", professors[12]], # Cognitive Psychology
        ["CSE206", 2, "L", professors[8]],     # Object Oriented Programming L
        ["CSE207", 2, "L", professors[11]]     # Exploratory Data Analysis and Data Visualization L
    ],
    "2nd Year B_Tech Cyber Security": [
        ["MTH201", 4, "T", professors[7]],  # Discrete Mathematics
        ["CSE202", 3, "T", professors[8]],  # Object Oriented Programming
        ["CSE203", 4, "LT", professors[9]],     # Operating Systems + L
        ["CSE208", 3, "T", professors[13]], # Database Management System
        ["CSE209", 2, "T", professors[6]],  # Modern Cryptography
        ["PSY201", 2, "T", professors[12]], # Cognitive Psychology
        ["CSE206", 2, "L", professors[8]],     # Object Oriented Programming L
        ["CSE210", 2, "L", professors[13]]     # Database Management L
    ],
    "3rd Year B_Tech AIDS Section A": [
        ["CSE301", 3, "T", professors[14]], # Data Structures and Algorithms
        ["CSE302", 3, "T", professors[15]], # Machine Learning
        ["CSE303", 3, "T", professors[16]], # Data Mining
        ["CSE304", 3, "T", professors[17]], # Big Data Technologies
        ["CSE305", 3, "T", professors[18]], # Software Engineering
        ["CSE306", 2, "L", professors[15]],    # Machine Learning L
        ["CSE307", 2, "L", professors[17]],    # Big Data L
        ["CSE308", 2, "L", professors[16]]     # Data Mining L
    ],
    "3rd Year B_Tech AIDS Section B": [
        ["CSE301", 3, "T", professors[14]], # Data Structures and Algorithms
        ["CSE302", 3, "T", professors[15]], # Machine Learning
        ["CSE303", 3, "T", professors[16]], # Data Mining
        ["CSE304", 3, "T", professors[17]], # Big Data Technologies
        ["CSE305", 3, "T", professors[18]], # Software Engineering
        ["CSE306", 2, "L", professors[15]],    # Machine Learning L
        ["CSE307", 2, "L", professors[17]],    # Big Data L
        ["CSE308", 2, "L", professors[16]]     # Data Mining L
    ],
    "3rd Year B_Tech IoT Section A": [
        ["CSE301", 3, "T", professors[14]], # Data Structures and Algorithms
        ["CSE302", 3, "T", professors[15]], # Machine Learning
        ["CSE303", 3, "T", professors[16]], # Data Mining
        ["ECE301", 3, "T", professors[19]], # Embedded Systems
        ["CSE305", 3, "T", professors[18]], # Software Engineering
        ["ECE302", 2, "L", professors[19]],    # Embedded Systems L
        ["CSE307", 2, "L", professors[17]],    # Big Data L
        ["CSE308", 2, "L", professors[16]]     # Data Mining L
    ],
    "3rd Year B_Tech IoT Section B": [
        ["CSE301", 3, "T", professors[14]], # Data Structures and Algorithms
        ["CSE302", 3, "T", professors[15]], # Machine Learning
        ["CSE303", 3, "T", professors[16]], # Data Mining
        ["ECE301", 3, "T", professors[19]], # Embedded Systems
        ["CSE305", 3, "T", professors[18]], # Software Engineering
        ["ECE302", 2, "L", professors[19]],    # Embedded Systems L
        ["CSE307", 2, "L", professors[17]],    # Big Data L
        ["CSE308", 2, "L", professors[16]]     # Data Mining L
    ],
    "3rd Year B_Tech Cyber Security": [
        ["CSE301", 3, "T", professors[14]], # Data Structures and Algorithms
        ["CSE309", 3, "T", professors[20]], # Network Security
        ["CSE310", 3, "T", professors[21]], # Ethical Hacking
        ["CSE311", 3, "T", professors[22]], # Cyber Forensics
        ["CSE312", 3, "T", professors[23]], # Secure Software Development
        ["CSE313", 2, "L", professors[21]],    # Ethical Hacking L
        ["CSE314", 2, "L", professors[23]],    # Secure Software Development L
        ["CSE315", 2, "L", professors[22]]     # Cyber Forensics L
    ],
    "4th Year B_Tech AIDS Section A": [
        ["CSE401", 3, "T", professors[24]], # Advanced Machine Learning
        ["CSE402", 3, "T", professors[25]], # Deep Learning
        ["CSE403", 3, "T", professors[26]], # Natural Language Processing
        ["CSE404", 3, "T", professors[27]], # Data Analytics
        ["CSE405", 3, "T", professors[28]], # Cloud Computing
        ["CSE406", 2, "L", professors[25]],    # Deep Learning L
        ["CSE407", 2, "L", professors[27]],    # Data Analytics L
        ["CSE408", 2, "L", professors[26]]     # Natural Language Processing L
    ],
    "4th Year B_Tech AIDS Section B": [
        ["CSE401", 3, "T", professors[24]], # Advanced Machine Learning
        ["CSE402", 3, "T", professors[25]], # Deep Learning
        ["CSE403", 3, "T", professors[26]], # Natural Language Processing
        ["CSE404", 3, "T", professors[27]], # Data Analytics
        ["CSE405", 3, "T", professors[28]], # Cloud Computing
        ["CSE406", 2, "L", professors[25]],    # Deep Learning L
        ["CSE407", 2, "L", professors[27]],    # Data Analytics L
        ["CSE408", 2, "L", professors[26]]     # Natural Language Processing L
    ],
    "4th Year B_Tech IoT Section A": [
        ["CSE401", 3, "T", professors[24]], # Advanced Machine Learning
        ["CSE402", 3, "T", professors[25]], # Deep Learning
        ["ECE401", 3, "T", professors[29]], # IoT Architecture
        ["CSE404", 3, "T", professors[27]], # Data Analytics
        ["CSE405", 3, "T", professors[28]], # Cloud Computing
        ["ECE402", 2, "L", professors[29]],    # IoT Architecture L
        ["CSE407", 2, "L", professors[27]],    # Data Analytics L
        ["CSE406", 2, "L", professors[25]]     # Deep Learning L
    ],
    "4th Year B_Tech IoT Section B": [
        ["CSE401", 3, "T", professors[24]], # Advanced Machine Learning
        ["CSE402", 3, "T", professors[25]], # Deep Learning
        ["ECE401", 3, "T", professors[29]], # IoT Architecture
        ["CSE404", 3, "T", professors[27]], # Data Analytics
        ["CSE405", 3, "T", professors[28]], # Cloud Computing
        ["ECE402", 2, "L", professors[29]],    # IoT Architecture L
        ["CSE407", 2, "L", professors[27]],    # Data Analytics L
        ["CSE406", 2, "L", professors[25]]     # Deep Learning L
    ],
    "4th Year B_Tech Cyber Security": [
        ["CSE401", 3, "T", professors[24]], # Advanced Machine Learning
        ["CSE409", 3, "T", professors[29]], # Cybersecurity Law and Policy
        ["CSE410", 3, "T", professors[21]], # Penetration Testing
        ["CSE411", 3, "T", professors[22]], # Incident Response
        ["CSE412", 3, "T", professors[23]], # Secure System Design
        ["CSE413", 2, "L", professors[21]],    # Penetration Testing L
        ["CSE414", 2, "L", professors[23]],    # Secure System Design L
        ["CSE415", 2, "L", professors[22]]     # Incident Response L
    ]
}

temp_dir = copy.deepcopy(class_courses)

pp = pprint.PrettyPrinter(indent=4)

professor_courses = {prof: [] for prof in professors}

for clas, courses in class_courses.items():
    for course in courses:
        course_code, hours, course_type, professor = course
        professor_courses[professor].append([course_code, clas, hours])

timetable_classes = {clas: [["", "", "", "Lunch", "", ""] for _ in range(5)] for clas in class_courses.keys()}
timetable_professors = {clas: [["", "", "", "Lunch", "", ""] for _ in range(5)] for clas in professor_courses.keys()}

leftover = {}

for clas, req_classes in class_courses.items():
    for day in range(len(timetable_classes[clas])):
        for slot in range(len(timetable_classes[clas][day])):
            update_timetable_1(req_classes, timetable_classes, timetable_professors, clas, day, slot)
    if(req_classes == []):
        continue
    leftover[clas] = req_classes
    proffs = list(set(j[3] for j in temp_dir[clas]))
    for day in range(len(timetable_classes[clas])):
        for slot in range(len(timetable_classes[clas][day])):
            if(timetable_classes[clas][day][slot] == ""):
                update_timetable_2(proffs, req_classes, timetable_classes, timetable_professors, clas, day, slot)
    leftover[clas] = req_classes


counter = 0
while(leftover_check(leftover) and counter < 10):
    print(leftover)
    update_timetable_3(temp_dir, leftover, timetable_classes, timetable_professors)
    print(leftover)
    print("\n=====================\n")
    counter += 1

update_timetable_4(leftover, timetable_classes, timetable_professors, class_courses)

print("\n========================Final Leftover========================\n")
print(leftover)
print("\n========================Final Leftover==================================\n")

if verify_timetable(temp_dir, timetable_classes, timetable_professors):
    print("Timetable is correctly set up.")
else:
    print("There are errors in the timetable.")