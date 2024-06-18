from flask import Blueprint, jsonify
from utils.timetable import TimeTableGenerator


timetable = Blueprint("timetable_blueprint", __name__)

with open("utils/courses.csv") as file:
    next(file)
    class_courses = {}

    periods = []
    sec = None
    for line in file:
        if sec is None:
            sec = line.rstrip()
        elif line[0].isnumeric():
            class_courses[sec] = periods
            periods = []
            sec = line.rstrip()
        else:
            periods.append(line.rstrip().split(","))

    class_courses[sec] = periods

    for i in class_courses:
        for j in range(len(class_courses[i])):
            class_courses[i][j][1] = int(class_courses[i][j][1])

with open("utils/labs.csv") as file:
    labs = list(map(str.rstrip, file.readlines()))


with open("utils/proff_name.csv") as file:
    proff_name = list(map(str.rstrip, file.readlines()))


ttgen = TimeTableGenerator(class_courses, labs, proff_name)


@timetable.route("/classes", methods=["POST"])
def get_classes():
    print(ttgen.classes_tt)
    return jsonify(ttgen.classes_tt)


@timetable.route("/professors", methods=["POST"])
def get_professors():
    return jsonify(ttgen.proffs_tt)


@timetable.route("/labs", methods=["POST"])
def get_labs():
    return jsonify(ttgen.labs_tt)
