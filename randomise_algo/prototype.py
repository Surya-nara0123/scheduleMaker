#!/usr/bin/python3
import time
import random
import copy
import pprint
pp = pprint.PrettyPrinter(indent=4)

def make_random():
    current_time_ns = time.time_ns()
    random.seed(current_time_ns)
    return int((random.random() * 100000000)//1)

def isEmpty_labs(lab_classes):
    for k in lab_classes.values():
        if k != []:
            return False
    return True

def free_labs(course_code, timming, timetable_labs):
    usable = []
    for lab in timetable_labs.keys():
        if course_code[:3] == lab[:3]:
            usable.append(lab)
    temp = copy.deepcopy(usable)
    for lab in usable:
        for usages in timetable_labs[lab]:
            if(usages[0][2] != timming[2]):
                continue
            if(timming[0] > usages[0][0] and timming[0] < usages[0][1]):
                temp.remove(lab)
                break
            if(timming[1] > usages[0][0] and timming[1] < usages[0][1]):
                temp.remove(lab)
                break
            if(timming[0] == usages[0][0] and timming[1] == usages[0][1]):
                temp.remove(lab)
                break
    return temp

def is_free_proff(timming, timetable_professors, proff):
    for classes in timetable_professors[proff]:
        if(classes[0][2] != timming[2]):
            continue
        if(timming[0] > classes[0][0] and timming[0] < classes[0][1]):
            return False
        if(timming[1] > classes[0][0] and timming[1] < classes[0][1]):
            return False
        if(timming[0] == classes[0][0] and timming[1] == classes[0][1]):
            return False
    return True

def check_proff(course, clas, timing, timetable_professors, proff):
    for lecture in timetable_professors[proff]:
        if lecture[1] == clas and lecture[2] == course and lecture[0][0] <= timing[0] and lecture[0][1] >= timing[1] and lecture[0][2] == timing[2]:
            if lecture[0][1] == timing[1]:
                timetable_professors[proff].remove(lecture)
            return True
    return False

def check_lab(course, clas, timing, timetable_labs, lab):
    for usage in timetable_labs[lab]:
        if usage[1] == clas and usage[2] == course and usage[0][0] <= timing[0] and usage[0][1] >= timing[1] and usage[0][2] == timing[2]:
            if usage[0][1] == timing[1]:
                timetable_labs[lab].remove(usage)
            return True
    return False

def labs_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, classes_timings):
    classes = list(lab_classes.keys())
    random.shuffle(classes)
    for clas in classes:
        if lab_classes[clas] == []:
            continue
        for day in range(len(timetable_classes[clas])):
            for slot in range(len(timetable_classes[clas][day])):
                if(timetable_classes[clas][day][slot] != ""):
                    continue

                possible_labs = {}
                for x in lab_classes[clas]:
                    check = True
                    for i in range(x[1]):
                        if(((slot+i) >= len(timetable_classes[clas][day])) or timetable_classes[clas][day][slot + i] != "" or not is_free_proff([classes_timings[clas[:3]][slot+i][0], classes_timings[clas[:3]][slot+i][1], day], timetable_professors, x[3])):
                            check = False
                    if(check == False):
                        continue
                    temp = free_labs(x[0], [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot+(x[1]-1)][1], day], timetable_labs)
                    if temp == []:
                        continue
                    possible_labs[x[0]] = temp

                if possible_labs == {}:
                    continue

                if(make_random()%2 != 0):
                    continue

                options = list(possible_labs.keys())
                choice = options[make_random()%len(options)]
                if(((choice == "PHY102") and ("CSE102" in options)) or ((choice == "CSE102") and ("PHY102" in options))):
                    choice = "PHY102"
                    lab1 = "PHYLAB1"
                    lab2 = possible_labs["CSE102"][make_random()%len(possible_labs["CSE102"])]
                    details = []
                    phy_proff = ""
                    cpo_proff = ""
                    for course in lab_classes[clas]:
                        if(course[0] == "PHY102"):
                            phy_proff = course[3]
                            details.append(course)
                            break
                    for course in lab_classes[clas]:
                        if(course[0] == "CSE102"):
                            cpo_proff = course[3]
                            details.append(course)
                            break
                    for i in range(details[0][1]):
                        timetable_classes[clas][day][slot + i] = ["PHY102", "CSE102", lab1, lab2, phy_proff, cpo_proff]
                    for i in details:
                        if(i[0] == "PHY102"):
                            timetable_professors[i[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (i[1]-1)][1], day], clas, "PHY102"])
                            timetable_labs[lab1].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (i[1]-1)][1], day], clas, "PHY102"])
                        else:
                            timetable_professors[i[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (i[1]-1)][1], day], clas, "CSE102"])
                            timetable_labs[lab2].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (i[1]-1)][1], day], clas, "CSE102"])
                    
                    temp = copy.deepcopy(lab_classes[clas])
                    check1, check2 = False, False
                    to_remove = []
                    for course in temp:
                        if course[0] == "PHY102" and not check1:
                            to_remove.append(course)
                            check1 = True
                        elif course[0] == "CSE102" and not check2:
                            to_remove.append(course)
                            check2 = True

                    for course in to_remove:
                        lab_classes[clas].remove(course)
                    continue
                
                if(choice == "CSE102" and "IoT" in clas):
                    if(len(possible_labs[choice]) < 2):
                        continue
                    lab1 = possible_labs[choice][make_random()%len(possible_labs[choice])]
                    lab2 = possible_labs[choice][make_random()%len(possible_labs[choice])]
                    while(lab1 == lab2):
                        lab1 = possible_labs[choice][make_random()%len(possible_labs[choice])]
                        lab2 = possible_labs[choice][make_random()%len(possible_labs[choice])]
                    details = []
                    for x in range(0, len(lab_classes[clas])):
                        if(lab_classes[clas][x][0] == choice):
                            details = lab_classes[clas][x]
                    
                    for i in range(details[1]):
                        timetable_classes[clas][day][slot + i] = ["CSE102", lab1, lab2, details[3]]
                    timetable_professors[details[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                    timetable_labs[lab1].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                    timetable_labs[lab2].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                    lab_classes[clas] = [val for val in lab_classes[clas] if val[0] != choice]
                    continue
                
                if(choice == "PHY102" or choice == "CSE102"):
                    if len(options) == 1:
                        continue
                    else:
                        while(choice == "PHY102" or choice == "CSE102"):
                            choice = options[make_random()%len(options)]

                if("ECE" in choice):
                    lab1 = possible_labs[choice][make_random()%len(possible_labs[choice])]
                    details = []
                    for x in range(0, len(lab_classes[clas])):
                        if(lab_classes[clas][x][0] == choice):
                            details = lab_classes[clas][x]
                    
                    for i in range(details[1]):
                        timetable_classes[clas][day][slot + i] = [choice, lab1, details[3]]
                    timetable_professors[details[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                    timetable_labs[lab1].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                    lab_classes[clas] = [val for val in lab_classes[clas] if val[0] != choice]
                    continue

                if(len(possible_labs[choice]) < 2):
                    continue

                lab1, lab2 = 0,0
                while(lab1 == lab2):
                    lab1 = make_random()%len(possible_labs[choice])
                    lab2 = make_random()%len(possible_labs[choice])
                lab1 = possible_labs[choice][lab1]
                lab2 = possible_labs[choice][lab2]
                
                details = []
                for x in range(0, len(lab_classes[clas])):
                    if(lab_classes[clas][x][0] == choice):
                        details = lab_classes[clas][x]

                for i in range(details[1]):
                    timetable_classes[clas][day][slot + i] = [choice, lab1, lab2, details[3]]
                timetable_professors[details[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                timetable_labs[lab1].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                timetable_labs[lab2].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot + (details[1]-1)][1], day], clas, choice])
                lab_classes[clas] = [val for val in lab_classes[clas] if val[0] != choice]

def theory_insert(theory_classes, timetable_classes, timetable_professors, classes_timings):
    classes = list(theory_classes.keys())
    random.shuffle(classes)
    for clas in classes:
        for day in range(len(timetable_classes[clas])):
            for slot in range(len(timetable_classes[clas][day])):
                if timetable_classes[clas][day][slot] != "":
                    continue

                possibles = []
                for course in theory_classes[clas]:
                    if is_free_proff([classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, course[3]):
                        possibles.append(course)
                
                if not possibles:
                    continue

                choice = possibles[make_random() % len(possibles)]
                if "Self-Learning" in choice[0]:
                    count = 0
                    for i in range(slot):
                        if type(timetable_classes[clas][day][i]) == type("Lunch"):
                            continue
                        if "Self-Learning" in timetable_classes[clas][day][i][0]:
                            count += 1
                    if count >= 2:
                        for i in possibles:
                            if "Self-Learning" not in i[0]:
                                while "Self-Learning" in choice[0]:
                                    choice = possibles[make_random() % len(possibles)]
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                                timetable_professors[choice[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], clas, choice[0]])
                                break
                        else:
                            slots = []
                            for i in range(slot):
                                if(type(timetable_classes[clas][day][i]) == type("Lunch")):
                                    continue
                                if "Self-Learning" in timetable_classes[clas][day][i][0]:
                                    slots.append(i)
                            posses = []
                            for pos in slots:
                                replacements = [course for course in theory_classes[clas] if "Self-Learning" not in course[0] and is_free_proff([classes_timings[clas[:3]][pos][0], classes_timings[clas[:3]][pos][1], day], timetable_professors, course[3])]
                                if replacements:
                                    posses.append([pos, replacements])
                            if posses == []:
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                            else:
                                chosen = posses[make_random() % len(posses)]
                                subj = make_random() % len(chosen[1])
                                extra_self_temp = timetable_classes[clas][day][chosen[0]]
                                timetable_classes[clas][day][chosen[0]] = [chosen[1][subj][0], chosen[1][subj][3]]
                                timetable_professors[chosen[1][subj][3]].append([[classes_timings[clas[:3]][chosen[0]][0], classes_timings[clas[:3]][chosen[0]][1], day], clas, chosen[1][subj][0]])
                                for i in theory_classes[clas]:
                                    if i[0] == chosen[1][subj][0]:
                                        i[1] -= 1
                                        if i[1] == 0:
                                            theory_classes[clas].remove(i)
                                        break
                                theory_classes[clas].append([extra_self_temp[0], 1, "T", extra_self_temp[1]])
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                    else:
                        timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                    for i in theory_classes[clas]:
                        if i[0] == choice[0]:
                            i[1] -= 1
                            if i[1] == 0:
                                theory_classes[clas].remove(i)
                            break
                else:
                    timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                    timetable_professors[choice[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], clas, choice[0]])
                    for i in theory_classes[clas]:
                        if i[0] == choice[0]:
                            i[1] -= 1
                            if i[1] == 0:
                                theory_classes[clas].remove(i)
                            break

def theory_update(theory_classes, timetable_classes, timetable_professors, classes_timings):
    for clas in timetable_classes.keys():             
        for day in range(len(timetable_classes[clas])):
            for slot in range((len(timetable_classes[clas][day]))):
                if timetable_classes[clas][day][slot] == "":
                    for i in theory_classes[clas]:
                        if "Self-Learning" in i:
                            timetable_classes[clas][day][slot] = [i[0], i[3]]
                            break

    for clas in theory_classes.keys():
        if theory_classes[clas] == []:
            continue
        else:
            for day in range(len(timetable_classes[clas])):
                for slot in range((len(timetable_classes[clas][day]))):
                    if theory_classes[clas] == []:
                        continue

                    if(type(timetable_classes[clas][day][slot]) == type("string")):
                        continue
                    
                    if "Self-Learning" in timetable_classes[clas][day][slot][0]:
                        possibles = []
                        for x in theory_classes[clas]:
                            if(is_free_proff([classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, x[3])):
                                possibles.append(x)
                        if possibles == []:
                            continue

                        for i in range(len(timetable_classes[clas])):
                            for j in range(len(timetable_classes[clas][i])):
                                if timetable_classes[clas][i][j] == "":
                                    timetable_classes[clas][i][j] = timetable_classes[clas][day][slot]
                                    break

                        choice = possibles[make_random()%len(possibles)]
                        timetable_classes[clas][day][slot] = [choice[0], choice[3]]
                        timetable_professors[choice[3]].append([[classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], clas, choice[0]])
                        for i in theory_classes[clas]:
                            if i[0] == choice[0]:
                                i[1] -= 1
                                if i[1] == 0:
                                    theory_classes[clas].remove(i)

def verify_everything(classes_timings, timetable_classes, timetable_professors, timetable_labs, backup):
    for clas in timetable_classes.keys():
        for day in range(len(timetable_classes[clas])):
            self_count = 0
            for slot in range(len(timetable_classes[clas][day])):
                if timetable_classes[clas][day][slot] == "":
                    print("Error!!!!!! Unexpected Empty Slot in timetable for ", clas, " at (", day, slot, ")")
                    pp.pprint(timetable_classes[clas])
                    continue
                    
                if timetable_classes[clas][day][slot] == "Lunch":
                    continue

                temp = timetable_classes[clas][day][slot]

                left_courses = [course[0] for course in backup[clas]]
                if temp[0] not in left_courses:
                    print(temp, " extra within timetable ", clas, "!! ")
                    continue

                if(len(temp) == 2):
                    if "Self-Learning" in temp[0]:
                        self_count += 1
                        if(self_count > 3):
                            print("Too many self-learning classes in ", clas, " at slot (", day, slot, ")")
                        for course in backup[clas]:
                            if(course[0] == temp[0]):
                                course[1] -= 1
                                if course[1] == 0:
                                    backup[clas].remove(course)
                                break
                        continue

                    if(check_proff(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[1]) == False):
                        print("Professor ", temp[1], " doesnt have a class with ", clas, " as in timetable for course ", temp[0], " on ", day, slot)
                    for course in backup[clas]:
                        if(course[0] == temp[0]):
                            course[1] -= 1
                            if course[1] == 0:
                                backup[clas].remove(course)
                            break
                    continue

                if "CSE102" in temp:
                    if "IoT" in clas:
                        if((check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[1]) and check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[2])) == False):
                            print("Lab ", temp[1], temp[2], " is not assigned class for ", clas, " on (", day, slot, ")")
                        
                        if(check_proff(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[3]) == False):
                            print("Professor ", temp[3], " doesnt have a class with ", clas, " as in timetable for course ", temp[0], " on ", day, slot)
                        
                        for course in backup[clas]:
                            if(course[0] == "CSE102"):
                                course[1] -= 1
                                if course[1] == 0:
                                    backup[clas].remove(course)
                                break
                        continue

                    if((check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[2]) and check_lab(temp[1], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[3])) == False):
                        print("Lab ", temp[2], temp[3], " is not assigned class for ", clas, " on (", day, slot, ")")

                    if((check_proff(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[4]) and (check_proff(temp[1], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[5]))) == False):
                        print("Professor ", temp[4], temp[5], " doesnt have a class with ", clas, " as in timetable for course ", temp[0], " on ", day, slot)

                    for course in backup[clas]:
                        if(course[0] == "PHY102"):
                            course[1] -= 1
                            if course[1] == 0:
                                backup[clas].remove(course)
                            break
                    
                    for course in backup[clas]:
                        if(course[0] == "CSE102"):
                            course[1] -= 1
                            if course[1] == 0:
                                backup[clas].remove(course)
                            break
                    
                
                elif "ECE" in temp[0]:
                    if(check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[1]) == False):
                        print("Lab ", temp[1], " is not assigned class for ", clas, " on (", day, slot, ")")
                    
                    if(check_proff(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[2]) == False):
                        print("Professor ", temp[2], " doesnt have a class with ", clas, " as in timetable for course ", temp[0], " on ", day, slot)
                    
                    for course in backup[clas]:
                        if(course[0] == temp[0]):
                            course[1] -= 1
                            if course[1] == 0:
                                backup[clas].remove(course)
                            break
                else:
                    if((check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[1]) and check_lab(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_labs, temp[2])) == False):
                        print("Lab ", temp[1], temp[2], " is not assigned class for ", clas, " on (", day, slot, ")")
                    
                    if(check_proff(temp[0], clas, [classes_timings[clas[:3]][slot][0], classes_timings[clas[:3]][slot][1], day], timetable_professors, temp[3]) == False):
                        print("Professor ", temp[3], " doesnt have a class with ", clas, " as in timetable for course ", temp[0], " on ", day, slot)
                    
                    for course in backup[clas]:
                        if(course[0] == temp[0]):
                            course[1] -= 1
                            if course[1] == 0:
                                backup[clas].remove(course)
                            break
    
    for lab, usages in timetable_labs.items():
        if usages != []:
            for usage in usages:
                print("Unnexpected lab ", lab, " usage: ", usage)
    
    for proff, lectures in timetable_professors.items():
        if lectures != []:
            for lecture in lectures:
                print("Unnexpted lecture of ", proff, " at ", lecture)

professors = ["Proff" + str(i) for i in range(0, 31)]
labs = ["CSELAB1", "CSELAB2", "CSELAB3", "CSELAB4", "CSELAB5", "CSELAB6", "CSELAB7", "CSELAB8", "CSELAB9", "ECELAB1", "PHYLAB1"]

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

for i,j in zip(class_courses.keys(), class_courses.values()):
    for k in j:
        if k[2] == "LT":
            temp = [k[0]+" T", k[1] - 2, "T", k[3]]
            k[1] = 2
            k[2] = "L"
            class_courses[i].append(temp)
        elif k[2] == "L":
            k[1] = k[1] - 1
            temp = [k[0] + " T", 1, "T", k[3]]
            class_courses[i].append(temp)

backup = copy.deepcopy(class_courses)
for clas, courses in backup.items():
    sum1 = 0
    for course in courses:
        sum1 += course[1]
            
    total_self_learning = 35 - sum1
    while(total_self_learning != 0):
        class_courses[clas].append(["Self-Learning " + str(total_self_learning), 1, "T", "Proff29"])
        total_self_learning -= 1

for clas, courses in backup.items():
    for course in courses:
        if course[0] == "PHY102" or (course[0] == "CSE102" and "IoT" not in clas):
            class_courses[clas].append(course)
backup = copy.deepcopy(class_courses)

lab_classes = {clas: [course for course in courses if course[2] == "L"] for clas, courses in class_courses.items()}
theory_classes = {clas: [course for course in courses if course[2] == "T"] for clas, courses in class_courses.items()}

courses_to_labs = {}
for i,j in zip(lab_classes.keys(), lab_classes.values()):
    for k in j:
        if k[2] == "L":
            if k[0] not in courses_to_labs.keys():
                courses_to_labs[k[0]] = [x for x in labs if k[0][0:3] == x[0:3]]

professor_courses = {prof: [] for prof in professors}
for clas, courses in class_courses.items():
    for course in courses:
        course_code, hours, course_type, professor = course
        professor_courses[professor].append([course_code, clas, hours])

timetable_professors = {proff: [] for proff in professors}
timetable_classes = {clas: [] for clas in class_courses}
timetable_labs = {lab: [] for lab in labs}

classes_timings = {
    "1st" : [[810, 900, "C"], [900, 950, "C"], [950, 1100, "BC"], [1100, 1150, "C"], [1150, 1250, "L"], [1250, 1340, "C"], [1340, 1430, "C"], [1430, 1530, "C"]],
    "2nd" : [[810, 900, "C"], [900, 950, "C"], [950, 1040, "C"], [1040, 1150, "C"], [1150, 1240, "C"], [1240, 1340, "L"], [1340, 1430, "C"], [1430, 1530, "C"]]
}

for clas, val in timetable_classes.items():
    for i in range(0, 5):
        val.append([])
        for slot in classes_timings[clas[:3]]:
            if "C" in slot[2]:
                val[i].append("")
            elif "L" in slot[2]:
                val[i].append("Lunch")

counter = 0
while(isEmpty_labs(lab_classes) == False and counter < 10):
    labs_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, classes_timings)
    counter += 1
theory_insert(theory_classes, timetable_classes, timetable_professors, classes_timings)
theory_update(theory_classes, timetable_classes, timetable_professors, classes_timings)

verify_everything(classes_timings, timetable_classes, timetable_professors, timetable_labs, backup)