Math.seedrandom = function (seed) {
    return function () {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
};

function make_random() {
    const currentTimeNs = Date.now() * 1000000;
    Math.seedrandom(currentTimeNs);
    return Math.floor(Math.random() * 100000000);
}

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function isEmptyLabs(lab_classes) {
    for (const k of Object.values(lab_classes)) {
        if (k.length !== 0) {
            return false;
        }
    }
    return true;
}

function freeLabs(courseCode, timing, timetable_labs) {
    const usable = [];
    for (const lab of Object.keys(timetable_labs)) {
        if (lab.startsWith(courseCode.slice(0, 3))) {
            usable.push(lab);
        }
    }
    const temp = [...usable];
    for (const lab of usable) {
        for (const usage of timetable_labs[lab]) {
            if (usage[0][2] !== timing[2]) {
                continue;
            }
            if (timing[0] > usage[0][0] && timing[0] < usage[0][1]) {
                temp.splice(temp.indexOf(lab), 1);
                break;
            }
            if (timing[1] > usage[0][0] && timing[1] < usage[0][1]) {
                temp.splice(temp.indexOf(lab), 1);
                break;
            }
            if (timing[0] === usage[0][0] && timing[1] === usage[0][1]) {
                temp.splice(temp.indexOf(lab), 1);
                break;
            }
        }
    }
    return temp;
}

function isFreeProfessor(timing, timetable_professors, professor) {
    for (const classes of timetable_professors[professor]) {
        if (classes[0][2] !== timing[2]) {
            continue;
        }
        if (timing[0] > classes[0][0] && timing[0] < classes[0][1]) {
            return false;
        }
        if (timing[1] > classes[0][0] && timing[1] < classes[0][1]) {
            return false;
        }
        if (timing[0] === classes[0][0] && timing[1] === classes[0][1]) {
            return false;
        }
    }
    return true;
}

function checkProfessor(course, clas, timing, timetable_professors, professor) {
    for (const lecture of timetable_professors[professor]) {
        if (lecture[1] === clas && lecture[2] === course && lecture[0][0] <= timing[0] && lecture[0][1] >= timing[1] && lecture[0][2] === timing[2]) {
            if (lecture[0][1] === timing[1]) {
                timetable_professors[professor].splice(timetable_professors[professor].indexOf(lecture), 1);
            }
            return true;
        }
    }
    return false;
}

function checkLab(course, clas, timing, timetable_labs, lab) {
    for (const usage of timetable_labs[lab]) {
        if (usage[1] === clas && usage[2] === course && usage[0][0] <= timing[0] && usage[0][1] >= timing[1] && usage[0][2] === timing[2]) {
            if (usage[0][1] === timing[1]) {
                timetable_labs[lab].splice(timetable_labs[lab].indexOf(usage), 1);
            }
            return true;
        }
    }
    return false;
}

function labs_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, classes_timings) {
    let classes = Object.keys(lab_classes);
    classes.sort(function () { return 0.5 - Math.random() });
    for (let i = 0; i < classes.length; i++) {
        let clas = classes[i];
        if (lab_classes[clas].length == 0) {
            continue;
        }
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                if (timetable_classes[clas][day][slot] != "") {
                    continue;
                }
                let possible_labs = {};
                for (let _a = 0, _b = lab_classes[clas]; _a < _b.length; _a++) {
                    let lab_course = _b[_a];
                    let check = true;
                    for (let i = 0; i < lab_course[1]; i++) {
                        if (((slot + i) >= timetable_classes[clas][day].length) || timetable_classes[clas][day][slot + i] != "" || !isFreeProfessor([classes_timings[clas.slice(0, 3)][slot + i][0], classes_timings[clas.slice(0, 3)][slot + i][1], day], timetable_professors, lab_course[3])) {
                            check = false;
                        }
                    }
                    if (check == false) {
                        continue;
                    }
                    let temp = freeLabs(lab_course[0], [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (lab_course[1] - 1)][1], day], timetable_labs);
                    if (temp.length === 0) {
                        continue;
                    }
                    possible_labs[lab_course[0]] = temp;
                }
                if (Object.keys(possible_labs).length === 0) {
                    continue;
                }
                //To introduce randomness in lab classes placement.
                if (make_random() % 5 != 0) {
                    continue;
                }
                
                let options = Object.keys(possible_labs);
                let choice = options[make_random() % options.length];
                if (((choice == "PHY102") && (options.includes("CSE102"))) || ((choice == "CSE102") && (options.includes("PHY102")))) {
                    choice = "PHY102";
                    let lab1 = "PHYLAB1";
                    let lab2 = possible_labs["CSE102"][make_random() % possible_labs["CSE102"].length];
                    let details = [];
                    let phy_proff = "";
                    let cpo_proff = "";
                    for (let _c = 0, _d = lab_classes[clas]; _c < _d.length; _c++) {
                        let course = _d[_c];
                        if (course[0] == "PHY102") {
                            phy_proff = course[3];
                            details.push(course);
                            break;
                        }
                    }
                    for (let _e = 0, _f = lab_classes[clas]; _e < _f.length; _e++) {
                        let course = _f[_e];
                        if (course[0] == "CSE102") {
                            cpo_proff = course[3];
                            details.push(course);
                            break;
                        }
                    }
                    for (let i = 0; i < details[0][1]; i++) {
                        timetable_classes[clas][day][slot + i] = ["PHY102", "CSE102", lab1, lab2, phy_proff, cpo_proff];
                    }
                    for (let _g = 0, details_1 = details; _g < details_1.length; _g++) {
                        let i = details_1[_g];
                        if (i[0] == "PHY102") {
                            timetable_professors[i[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (i[1] - 1)][1], day], clas, "PHY102"]);
                            timetable_labs[lab1].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (i[1] - 1)][1], day], clas, "PHY102"]);
                        }
                        else {
                            timetable_professors[i[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (i[1] - 1)][1], day], clas, "CSE102"]);
                            timetable_labs[lab2].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (i[1] - 1)][1], day], clas, "CSE102"]);
                        }
                    }
                    let temp = JSON.parse(JSON.stringify(lab_classes[clas]));
                    let check1 = false, check2 = false;
                    let to_remove = [];
                    for (let _h = 0, temp_1 = temp; _h < temp_1.length; _h++) {
                        let course = temp_1[_h];
                        if (course[0] == "PHY102" && !check1) {
                            to_remove.push(course);
                            check1 = true;
                        }
                        else if (course[0] == "CSE102" && !check2) {
                            to_remove.push(course);
                            check2 = true;
                        }
                    }
                    for (let _j = 0, to_remove_1 = to_remove; _j < to_remove_1.length; _j++) {
                        let course = to_remove_1[_j];
                        lab_classes[clas].splice(lab_classes[clas].indexOf(course), 1);
                    }
                    continue;
                }
                if (choice == "CSE102" && clas.includes("IoT")) {
                    if (possible_labs[choice].length < 2) {
                        continue;
                    }
                    let lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    let lab2 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    while (lab1 == lab2) {
                        lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                        lab2 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    }
                    let details = [];
                    for (let x = 0; x < lab_classes[clas].length; x++) {
                        if (lab_classes[clas][x][0] == choice) {
                            details = lab_classes[clas][x];
                        }
                    }
                    for (let i = 0; i < details[1]; i++) {
                        timetable_classes[clas][day][slot + i] = ["CSE102", lab1, lab2, details[3]];
                    }
                    timetable_professors[details[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                    timetable_labs[lab1].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                    timetable_labs[lab2].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                    lab_classes[clas] = lab_classes[clas].filter(function (val) { return val[0] != choice; });
                    continue;
                }
                if (choice == "PHY102" || choice == "CSE102") {
                    if (options.length == 1) {
                        continue;
                    }
                    else {
                        while (choice == "PHY102" || choice == "CSE102") {
                            choice = options[make_random() % options.length];
                        }
                    }
                }
                if (choice.includes("ECE")) {
                    let lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    let details = [];
                    for (let x = 0; x < lab_classes[clas].length; x++) {
                        if (lab_classes[clas][x][0] == choice) {
                            details = lab_classes[clas][x];
                            break;
                        }
                    }
                    for (let k = 0; k < details[1]; k++) {
                        timetable_classes[clas][day][slot + k] = [choice, lab1, details[3]];
                    }
                    timetable_professors[details[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                    timetable_labs[lab1].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                    lab_classes[clas] = lab_classes[clas].filter(function (val) { return val[0] != choice; });
                    continue;
                }
                if (possible_labs[choice].length < 2) {
                    continue;
                }
                let lab1 = 0, lab2 = 0;
                while (lab1 == lab2) {
                    lab1 = make_random() % possible_labs[choice].length;
                    lab2 = make_random() % possible_labs[choice].length;
                }
                lab1 = possible_labs[choice][lab1];
                lab2 = possible_labs[choice][lab2];
                let details = [];
                for (let x = 0; x < lab_classes[clas].length; x++) {
                    if (lab_classes[clas][x][0] == choice) {
                        details = lab_classes[clas][x];
                    }
                }
                for (let i = 0; i < details[1]; i++) {
                    timetable_classes[clas][day][slot + i] = [choice, lab1, lab2, details[3]];
                }
                timetable_professors[details[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                timetable_labs[lab1].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                timetable_labs[lab2].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot + (details[1] - 1)][1], day], clas, choice]);
                lab_classes[clas] = lab_classes[clas].filter(function (val) { return val[0] != choice; });
            }
        }
    }
}

function theory_insert(theory_classes, timetable_classes, timetable_professors, classes_timings) {
    let classes = Object.keys(theory_classes);
    classes.sort(function () { return 0.5 - Math.random() });
    for (let _i = 0, classes_2 = classes; _i < classes_2.length; _i++) {
        let clas = classes_2[_i];
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                if (timetable_classes[clas][day][slot] != "") {
                    continue;
                }
                let possibles = [];
                for (let _a = 0, _b = theory_classes[clas]; _a < _b.length; _a++) {
                    let course = _b[_a];
                    if (isFreeProfessor([classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, course[3])) {
                        possibles.push(course);
                    }
                }
                if (possibles.length == 0) {
                    continue;
                }
                let choice = possibles[make_random() % possibles.length];
                if (choice[0].includes("Self-Learning")) {
                    let count = 0;
                    for (let i = 0; i < slot; i++) {
                        if (typeof timetable_classes[clas][day][i] == typeof "Lunch") {
                            continue;
                        }
                        if (timetable_classes[clas][day][i][0].includes("Self-Learning")) {
                            count += 1;
                        }
                    }
                    if (count >= 2) {
                        let found_something = false;
                        for (let _c = 0, possibles_1 = possibles; _c < possibles_1.length; _c++) {
                            let i = possibles_1[_c];
                            if (!i[0].includes("Self-Learning")) {
                                while (choice[0].includes("Self-Learning")) {
                                    choice = possibles[make_random() % possibles.length];
                                }
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                                timetable_professors[choice[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], clas, choice[0]]);
                                found_something = true;
                                break;
                            }
                        }
                        if (!found_something) {
                            let slots = [];
                            for (let i = 0; i < slot; i++) {
                                if (typeof timetable_classes[clas][day][i] == typeof "Lunch") {
                                    continue;
                                }
                                if (timetable_classes[clas][day][i][0].includes("Self-Learning")) {
                                    slots.push(i);
                                }
                            }
                            let posses = [];
                            for (let _d = 0, slots_1 = slots; _d < slots_1.length; _d++) {
                                let pos = slots_1[_d];
                                let replacements = theory_classes[clas].filter(function (course) {
                                    return !course[0].includes("Self-Learning") &&
                                        isFreeProfessor([classes_timings[clas.slice(0, 3)][pos][0],
                                        classes_timings[clas.slice(0, 3)][pos][1], day],
                                            timetable_professors,
                                            course[3]);
                                });
                                if (replacements.length > 0) { // Check if replacements array is not empty
                                    posses.push([pos, replacements]);
                                }
                            }
                            if (posses.length === 0) {
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                            }
                            else {
                                let chosen = posses[make_random() % posses.length];
                                let subj = make_random() % chosen[1].length;
                                let extra_self_temp = timetable_classes[clas][day][chosen[0]];
                                timetable_classes[clas][day][chosen[0]] = [chosen[1][subj][0], chosen[1][subj][3]];
                                timetable_professors[chosen[1][subj][3]].push([[classes_timings[clas.slice(0, 3)][chosen[0]][0], classes_timings[clas.slice(0, 3)][chosen[0]][1], day], clas, chosen[1][subj][0]]);
                                for (let _e = 0, theory_classes_1 = theory_classes[clas]; _e < theory_classes_1.length; _e++) {
                                    let i = theory_classes_1[_e];
                                    if (i[0] == chosen[1][subj][0]) {
                                        i[1] -= 1;
                                        if (i[1] == 0) {
                                            theory_classes[clas].splice(theory_classes[clas].indexOf(i), 1);
                                        }
                                        break;
                                    }
                                }
                                theory_classes[clas].push([extra_self_temp[0], 1, "T", extra_self_temp[1]]);
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                            }
                        }
                    }
                    else {
                        timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                    }
                    for (let _f = 0, theory_classes_2 = theory_classes[clas]; _f < theory_classes_2.length; _f++) {
                        let i = theory_classes_2[_f];
                        if (i[0] == choice[0]) {
                            i[1] -= 1;
                            if (i[1] == 0) {
                                theory_classes[clas].splice(theory_classes[clas].indexOf(i), 1);
                            }
                            break;
                        }
                    }
                }
                else {
                    timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                    timetable_professors[choice[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], clas, choice[0]]);
                    for (let _g = 0, theory_classes_3 = theory_classes[clas]; _g < theory_classes_3.length; _g++) {
                        let i = theory_classes_3[_g];
                        if (i[0] == choice[0]) {
                            i[1] -= 1;
                            if (i[1] == 0) {
                                theory_classes[clas].splice(theory_classes[clas].indexOf(i), 1);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
}

function theory_update(theory_classes, timetable_classes, timetable_professors, classes_timings) {
    for (const clas in theory_classes) {
        if (theory_classes[clas].length === 0) {
            continue;
        } else {
            for (let day = 0; day < timetable_classes[clas].length; day++) {
                for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                    if (theory_classes[clas].length === 0) {
                        continue;
                    }

                    if (typeof timetable_classes[clas][day][slot] === typeof "Lunch") {
                        continue;
                    }

                    if (timetable_classes[clas][day][slot][0].includes("Self-Learning")) {
                        const possibles = [];
                        for (const x of theory_classes[clas]) {
                            if (isFreeProfessor([classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, x[3])) {
                                possibles.push(x);
                            }
                        }
                        if (possibles.length === 0) {
                            continue;
                        }

                        let replaced_check = false
                        for (let i = 0; i < timetable_classes[clas].length; i++) {
                            for (let j = 0; j < timetable_classes[clas][i].length; j++) {
                                if (timetable_classes[clas][i][j] === "" && !replaced_check) {
                                    timetable_classes[clas][i][j] = timetable_classes[clas][day][slot];
                                    replaced_check = true
                                    break;
                                }
                            }
                        }

                        const choice = possibles[make_random() % possibles.length];
                        timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                        timetable_professors[choice[3]].push([[classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], clas, choice[0]]);
                        for (const i of theory_classes[clas]) {
                            if (i[0] === choice[0]) {
                                i[1] -= 1;
                                if (i[1] === 0) {
                                    theory_classes[clas] = theory_classes[clas].filter(item => item !== i);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    for (const clas in timetable_classes) {
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                if (timetable_classes[clas][day][slot] === "") {
                    for (let i of theory_classes[clas]) {
                        if (i[0].includes("Self-Learning")) {
                            timetable_classes[clas][day][slot] = [i[0], i[3]];
                            theory_classes[clas].splice(theory_classes[clas].indexOf(i), 1);
                            break;
                        }
                    }
                }
            }
        }
    }
}

function verifyEverything(classes_timings, timetable_classes, timetable_professors, timetable_labs, backup) {
    for (const clas in timetable_classes) {
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            let selfCount = 0;
            for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                if (timetable_classes[clas][day][slot] === "") {
                    return false;
                }

                if (timetable_classes[clas][day][slot] === "Lunch") {
                    continue;
                }

                const temp = timetable_classes[clas][day][slot];
                const leftCourses = backup[clas].map(course => course[0]);
                if (!leftCourses.includes(temp[0])) {
                    return false;
                }

                if (temp.length === 2) {
                    if (temp[0].includes("Self-Learning")) {
                        selfCount += 1;
                        if (selfCount > 3) {
                            return false;
                        }
                        for (const course of backup[clas]) {
                            if (course[0] === temp[0]) {
                                course[1] -= 1;
                                if (course[1] === 0) {
                                    backup[clas] = backup[clas].filter(item => item !== course);
                                }
                                break;
                            }
                        }
                        continue;
                    }

                    if (!checkProfessor(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[1])) {
                        return false;
                    }
                    for (const course of backup[clas]) {
                        if (course[0] === temp[0]) {
                            course[1] -= 1;
                            if (course[1] === 0) {
                                backup[clas] = backup[clas].filter(item => item !== course);
                            }
                            break;
                        }
                    }
                    continue;
                }

                if (temp.includes("CSE102")) {
                    if (clas.includes("IoT")) {
                        if (!(checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[1]) && checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[2]))) {
                            return false;
                        }

                        if (!checkProfessor(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[3])) {
                            return false;
                        }

                        for (const course of backup[clas]) {
                            if (course[0] === "CSE102") {
                                course[1] -= 1;
                                if (course[1] === 0) {
                                    backup[clas] = backup[clas].filter(item => item !== course);
                                }
                                break;
                            }
                        }
                        continue;
                    }
                    if (!(checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[2]) && checkLab(temp[1], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[3]))) {
                        return false;
                    }

                    if (!(checkProfessor(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[4]) && checkProfessor(temp[1], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[5]))) {
                        return false;
                    }

                    for (const course of backup[clas]) {
                        if (course[0] === "PHY102") {
                            course[1] -= 1;
                            if (course[1] === 0) {
                                backup[clas] = backup[clas].filter(item => item !== course);
                            }
                            break;
                        }
                    }

                    for (const course of backup[clas]) {
                        if (course[0] === "CSE102") {
                            course[1] -= 1;
                            if (course[1] === 0) {
                                backup[clas] = backup[clas].filter(item => item !== course);
                            }
                            break;
                        }
                    }
                } else if (temp[0].includes("ECE")) {
                    if (!checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[1])) {
                        return false;
                    }

                    if (!checkProfessor(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[2])) {
                        return false;
                    }

                    for (const course of backup[clas]) {
                        if (course[0] === temp[0]) {
                            course[1] -= 1;
                            if (course[1] === 0) {
                                backup[clas] = backup[clas].filter(item => item !== course);
                            }
                            break;
                        }
                    }
                } else {
                    if (!(checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[1]) && checkLab(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_labs, temp[2]))) {
                        return false;
                    }

                    if (!checkProfessor(temp[0], clas, [classes_timings[clas.slice(0, 3)][slot][0], classes_timings[clas.slice(0, 3)][slot][1], day], timetable_professors, temp[3])) {
                        return false;
                    }

                    for (const course of backup[clas]) {
                        if (course[0] === temp[0]) {
                            course[1] -= 1;
                            if (course[1] === 0) {
                                backup[clas] = backup[clas].filter(item => item !== course);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    for (const [lab, usages] of Object.entries(timetable_labs)) {
        if (usages.length !== 0) {
            for (const usage of usages) {
                return false;
            }
        }
    }

    for (const [proff, lectures] of Object.entries(timetable_professors)) {
        if (lectures.length !== 0) {
            for (const lecture of lectures) {
                return false;
            }
        }
    }

    return true
}

function format_professors(timetable_professors, classes_timings, timetable_classes) {
    let result = {}
    let exceptions = {}
    let proffs = Object.keys(timetable_professors);
    for (let _i = 0, proffs_1 = proffs; _i < proffs_1.length; _i++) {
        let proff = proffs[_i];
        if (timetable_professors[proff].length === 0) {
            continue;
        }
        let check = true;
        let curr = timetable_professors[proff][0][1].slice(0, 3)
        for (const lecture of timetable_professors[proff]) {
            if (lecture[1].slice(0, 3) != curr) {
                check = false;
            }
        }
        if (!check) {
            exceptions[proff] = timetable_professors[proff];
        } else {
            result[proff] = []
            for (let j = 0; j < 5; j++) {
                result[proff].push([])
                for (let slot of classes_timings[curr]) {
                    if (slot[2].includes("C")) {
                        result[proff][j].push("");
                    } else if (slot[2].includes("L")) {
                        result[proff][j].push("Lunch");
                    }
                }
            }
            for (let day = 0; day < 5; day++) {
                for (let slot = 0; slot < result[proff][day].length; slot++) {
                    if (result[proff][day][slot] == "Lunch") {
                        continue
                    }
                    for (const lecture of timetable_professors[proff]) {
                        if (lecture[0][0] <= classes_timings[curr][slot][0] && lecture[0][1] >= classes_timings[curr][slot][1] && lecture[0][2] === day) {
                            result[proff][day][slot] = [lecture[1], lecture[2]]
                            if (!(timetable_classes[lecture[1]][day][slot].length === 2)) {
                                for (let item of timetable_classes[lecture[1]][day][slot]) {
                                    if (item.includes("LAB")) {
                                        result[proff][day][slot].push(item)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return [result, exceptions]
}

function add_breaks(timetable_classes, classes_timings, timetable_professors) {
    let classes = Object.keys(timetable_classes)
    for (let i = 0, classes_1 = classes; i < classes_1.length; i++) {
        let clas = classes[i]
        let curr = clas.slice(0, 3)
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            let index = 0
            for (let slot = 0; slot < classes_timings[curr].length; slot++) {
                if (classes_timings[curr][slot][2] != "BC") {
                    index += 1
                    continue
                }
                timetable_classes[clas][day].splice(index, 0, "Break");
                index += 2
            }
        }
    }
    let proffs = Object.keys(timetable_professors);
    for (let i = 0, proffs_1 = proffs; i < proffs_1.length; i++) {
        let proff = proffs[i]
        if (timetable_professors[proff].length == 0) {
            continue
        }
        let curr = ""
        for (let day = 0; day < timetable_professors[proff].length; day++) {
            for (let slot = 0; slot < timetable_professors[proff][day].length; slot++) {
                if (curr != "") {
                    break
                }
                if (timetable_professors[proff][day][slot] != "" && timetable_professors[proff][day][slot] != "Lunch") {
                    curr = timetable_professors[proff][day][slot][0].slice(0, 3)
                }
            }
        }
        for (let day = 0; day < timetable_professors[proff].length; day++) {
            let index = 0
            for (let slot = 0; slot < classes_timings[curr].length; slot++) {
                if (classes_timings[curr][slot][2] != "BC") {
                    index += 1
                    continue
                }
                timetable_professors[proff][day].splice(index, 0, "Break");
                index += 2
            }
        }
    }
    let classes_2 = Object.keys(classes_timings)
    for (let i = 0; i < classes_2.length; i++) {
        let clas = classes_2[i]
        for (let slot = 0; slot < classes_timings[clas].length; slot++) {
            if (classes_timings[clas][slot][2] != "BC") {
                continue
            }
            let length = classes_timings[clas][slot][1] - classes_timings[clas][slot][0]
            length -= 100
            classes_timings[clas][slot][2] = "C"
            let new_time = classes_timings[clas][slot][0]
            new_time += (length + 10)
            if (new_time % 100 >= 60) {
                new_time -= 60;
                new_time += 100
            }
            classes_timings[clas][slot][0] = new_time
            classes_timings[clas].splice(slot, 0, [classes_timings[clas][slot][0], classes_timings[clas][slot][0] + length + 10, "B"])
        }
    }
}

function is_proff(str) {
    return str.includes("Proff")
}

function convert_to_string(timetable_classes, proff_to_short, timetable_professors) {
    let classes = Object.keys(timetable_classes);
    for (let i = 0; i < classes.length; i++) {
        let clas = classes[i]
        for (let day = 0; day < timetable_classes[clas].length; day++) {
            for (let slot = 0; slot < timetable_classes[clas][day].length; slot++) {
                if (typeof timetable_classes[clas][day][slot] == typeof "Lunch") {
                    continue
                }
                let result = ""
                for (let j = 0; j < timetable_classes[clas][day][slot].length; j++) {
                    if (is_proff(timetable_classes[clas][day][slot][j])) {
                        result += proff_to_short[timetable_classes[clas][day][slot][j]]
                    } else {
                        if (timetable_classes[clas][day][slot][j].includes("Self-Learning")) {
                            result += "Self-Learning"
                        }
                        else{
                        result += timetable_classes[clas][day][slot][j]
                        }
                    }
                    result += " "
                }
                timetable_classes[clas][day][slot] = result
            }
        }
    }

    let proffs = Object.keys(timetable_professors);
    for (let i = 0; i < proffs.length; i++) {
        let proff = proffs[i]
        for (let day = 0; day < timetable_professors[proff].length; day++) {
            for (let slot = 0; slot < timetable_professors[proff][day].length; slot++) {
                if (typeof timetable_professors[proff][day][slot] == typeof "Lunch") {
                    continue
                }
                let result = ""
                for (let j = 0; j < timetable_professors[proff][day][slot].length; j++) {
                    result += timetable_professors[proff][day][slot][j]
                    result += " "
                }
                timetable_professors[proff][day][slot] = result
            }
        }
    }
}

function initialise_class_courses(classes_to_courses){
    for (let [clas, courses] of Object.entries(classes_to_courses)) {
        for (let course of courses) {
            if (course[2] === "LT") {
                let temp = [course[0] + " T", course[1] - 2, "T", course[3]];
                course[1] = 2;
                course[2] = "L";
                classes_to_courses[clas].push(temp);
            } else if (course[2] === "L") {
                course[1] = course[1] - 1;
                let temp = [course[0] + " T", 1, "T", course[3]];
                classes_to_courses[clas].push(temp);
            }
        }
    }

    let backup = JSON.parse(JSON.stringify(classes_to_courses));
    for (let [clas, courses] of Object.entries(backup)) {
        let sum1 = 0;
        for (let course of courses) {
            sum1 += course[1];
        }
        let total_self_learning = 35 - sum1;
        while (total_self_learning !== 0) {
            classes_to_courses[clas].push(["Self-Learning " + total_self_learning, 1, "T", "Proff29"]);
            total_self_learning -= 1;
        }
        for (let i = 0; i < courses.length; i++) {
            if (!clas.includes("IoT") && (courses[i][0] == "PHY102" || courses[i][0] == "CSE102")) {
                classes_to_courses[clas].push(courses[i])
            }
        }
    }
    return classes_to_courses
}

function initialise_class_timetable(timetable_classes_init, timetable_professors_init, classes_timings, initial_lectures, classes_to_courses){
    for (let [clas, val] of Object.entries(timetable_classes_init)) {
        for (let i = 0; i < 5; i++) {
            val.push([]);
            for (let slot of classes_timings[clas.slice(0, 3)]) {
                if (slot[2].includes("C")) {
                    val[i].push("");
                } else if (slot[2].includes("L")) {
                    val[i].push("Lunch");
                }
            }
        }
    }

    let temp = JSON.parse(JSON.stringify(initial_lectures))
    for(const lecture of temp){
        for(const course in classes_to_courses[lecture[0]]){
            if(course[0] == lecture[1] && course[2] == "T"){
                if(timetable_classes_init[lecture[0]][lecture[3]][lecture[4]] == "" && isFreeProfessor([classes_timings[lecture[0].slice(0,3)][lecture[4]][0], classes_timings[lecture[0].slice(0,3)][lecture[4]][1], day], timetable_professors_init, lecture[2])){
                    timetable_classes_init[lecture[0]][lecture[3]][lecture[4]] = [lecture[1], lecture[2]];
                    timetable_professors_init[lecture[2]].push([classes_timings[lecture[0].slice(0,3)][lecture[4]][0], classes_timings[lecture[0].slice(0,3)][lecture[4]][1], day], lecture[0], lecture[1])
                    initial_lectures.splice(initial_lectures.indexOf(lecture), 1);
                }
                course[1] -= 1
                if(course[1] == 0){
                    classes_to_courses[lecture[0]].splice(classes_to_courses[lecture[0]].indexOf(course), 1);
                }
            }
        }
    }
}

function get_timetables(class_courses, professors, proff_to_short, labs, initial_lectures) {
    let classes_timings = {
        "1st": [[810, 900, "C"], [900, 950, "C"], [950, 1100, "BC"], [1100, 1150, "C"], [1150, 1250, "L"], [1250, 1340, "C"], [1340, 1430, "C"], [1430, 1530, "BC"]],
        "2nd": [[810, 900, "C"], [900, 950, "C"], [950, 1040, "C"], [1040, 1150, "BC"], [1150, 1240, "C"], [1240, 1340, "L"], [1340, 1430, "C"], [1430, 1530, "BC"]]
    };

    let classes_to_courses = JSON.parse(JSON.stringify(class_courses));
    
    let timetable_professors_init = {};
    for (let professor of professors) {
        timetable_professors_init[professor] = [];
    }

    let timetable_classes_init = {};
    for (let clas of Object.keys(class_courses)) {
        timetable_classes_init[clas] = [];
    }

    let temp = initialise_class_courses(classes_to_courses);
    classes_to_courses = JSON.parse(JSON.stringify(temp))
    let backup = JSON.parse(JSON.stringify(classes_to_courses));
    
    initialise_class_timetable(timetable_classes_init, timetable_professors_init, classes_timings, initial_lectures, classes_to_courses)

    let check = false
    let fallback = 0;
    while (!check && fallback < 50) {
        let class_courses_1 = JSON.parse(JSON.stringify(classes_to_courses));
        let class_courses_2 = JSON.parse(JSON.stringify(backup));

        let lab_classes = {};
        for (let [clas, courses] of Object.entries(class_courses_1)) {
            let labCourses = courses.filter(course => course[2] === "L");
            lab_classes[clas] = JSON.parse(JSON.stringify(labCourses));
        }

        let theory_classes = {};
        for (let [clas, courses] of Object.entries(class_courses_1)) {
            theory_classes[clas] = courses.filter(course => course[2] === "T");
        }

        let timetable_professors = JSON.parse(JSON.stringify(timetable_professors_init));
        let timetable_classes = JSON.parse(JSON.stringify(timetable_classes_init));

        let timetable_labs = {};
        for (let lab of labs) {
            timetable_labs[lab] = [];
        }
        
        let counter = 0;
        while (!isEmptyLabs(lab_classes) && counter < 10) {
            labs_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, classes_timings);
            counter += 1;
        }

        theory_insert(theory_classes, timetable_classes, timetable_professors, classes_timings);
        theory_update(theory_classes, timetable_classes, timetable_professors, classes_timings);

        let proffs_temp = JSON.parse(JSON.stringify(timetable_professors));
        let labs_temp = JSON.parse(JSON.stringify(timetable_labs));

        check = verifyEverything(classes_timings, timetable_classes, timetable_professors, timetable_labs, class_courses_2)

        if (check) {
            let proffs_dicts = format_professors(proffs_temp, classes_timings, timetable_classes);
            add_breaks(timetable_classes, classes_timings, proffs_dicts[0])
            convert_to_string(timetable_classes, proff_to_short, proffs_dicts[0])
            const dicts = [timetable_classes, proffs_dicts[0], proffs_dicts[1], labs_temp, initial_lectures];
            return (dicts);
        }
        fallback += 1;
    }
    return {};
}

export function randomize(class_courses, professors, proff_to_short, labs, initial_lectures) {
    try {
        const result = get_timetables(class_courses, professors, proff_to_short, labs, initial_lectures);
        return result;
    } catch (error) {
        console.error('Error generating timetables:', error);
        return {};
    }
}

export function is_free_professor(proffs_tt, proffs_special_casses, proff, clas, day, slot){
    if(proff in proffs_special_casses){
        let classes_timings = {
            "1st": [[810, 900, "C"], [900, 950, "C"], [950, 1100, "BC"], [1100, 1150, "C"], [1150, 1250, "L"], [1250, 1340, "C"], [1340, 1430, "C"], [1430, 1530, "BC"]],
            "2nd": [[810, 900, "C"], [900, 950, "C"], [950, 1040, "C"], [1040, 1150, "BC"], [1150, 1240, "C"], [1240, 1340, "L"], [1340, 1430, "C"], [1430, 1530, "BC"]]
        };
        return isFreeProfessor([classes_timings[clas.slice(0,3)][slot][0], classes_timings[clas.slice(0,3)][slot][1], day], proffs_special_casses, proff);
    }

    return proffs_tt[proff][day][slot] == ""
}