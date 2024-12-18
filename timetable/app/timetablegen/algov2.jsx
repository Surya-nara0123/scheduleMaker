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

function shuffle_array(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function is_free_professor(timetable_professors, proff, day, slot) {
    return timetable_professors[proff][day][slot] === ""
}

function free_labs(timetable_labs, course_code, day, slot1, slot2) {
    const usable = [];

    for (const lab of Object.keys(timetable_labs)) {
        if (lab.startsWith(course_code.slice(0, 3))) {
            usable.push(lab);
        }
    }

    const temp = [...usable];
    for (const lab of usable) {
        for (let slot = slot1; slot < slot2; slot++) {
            if (timetable_labs[lab][day][slot] != "") {
                temp.splice(temp.indexOf(lab), 1);
                break;
            }
        }
    }

    return temp;
}

function is_assigned_courses(classes_to_courses){
    for(let course of Object.values(classes_to_courses)){
        if(course.length != 0){
            return false;
        }
    }
    return true
}

function lab_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, class_phy_cprog_lab) {
    let classes = Object.keys(lab_classes);
    shuffle_array(classes)
    for(let clas of classes){
        if(lab_classes[clas].length === 0){
            continue
        }
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < 8; slot++){
                if(timetable_classes[clas][day][slot] != ""){
                    continue;
                }
                let possible_labs = {}
                for(let lab_course of lab_classes[clas]){
                    let check = true;
                    for(let i = 0; i < lab_course[1]; i++){
                        if((slot + i) >= 8 || timetable_classes[clas][day][slot + i] != "" || !is_free_professor(timetable_professors, lab_course[3], day, slot + i)){
                            check = false;
                            break
                        }
                    }
                    if(!check){
                        continue
                    }
                    let temp = free_labs(timetable_labs, lab_course[0], day, slot, slot + lab_course[1])
                    if (temp.length === 0) {
                        continue;
                    }
                    possible_labs[lab_course[0]] = temp;
                }
                if (Object.keys(possible_labs).length === 0){
                    continue
                }

                if (make_random() % 5 != 0) {
                    continue;
                }

                let options = Object.keys(possible_labs);
                let choice = options[make_random() % options.length];
                if(((choice == "PHY102") && (options.includes("CSE102"))) || ((choice == "CSE102") && (options.includes("PHY102") && !clas.includes("IoT")))){
                    let lab1 = "PHYLAB1"
                    let lab2 = possible_labs["CSE102"][make_random() % possible_labs["CSE102"].length];
                    let hours = 0;
                    let phy_course = []
                    let cpo_course = []
                    for(let lab_course of lab_classes[clas]){
                        if(lab_course[0] === "PHY102"){
                            hours = lab_course[1]
                            phy_course = lab_course
                        } else if(lab_course[0] === "CSE102"){
                            cpo_course = lab_course
                        }
                    }
                    for(let i = 0; i < hours; i++){
                        timetable_classes[clas][day][slot + i] = ["PHY102", "CSE102", phy_course[3], cpo_course[3], lab1, lab2];
                        timetable_professors[phy_course[3]][day][slot + i] = ["PHY102", clas, lab1]
                        timetable_professors[cpo_course[3]][day][slot + i] = ["CSE102", clas, lab2]
                        timetable_labs[lab1][day][slot + i] = ["PHY102", clas, phy_course[3]]
                        timetable_labs[lab2][day][slot + i] = ["CSE102", clas, cpo_course[3]]
                    }
                    if(class_phy_cprog_lab[clas]){
                        lab_classes[clas].splice(lab_classes[clas].indexOf(phy_course), 1)
                        lab_classes[clas].splice(lab_classes[clas].indexOf(cpo_course), 1)
                    } else {
                        class_phy_cprog_lab[clas] = "done"
                    }
                    continue
                }
                if (choice == "CSE102" && clas.includes("IoT")){
                    if (possible_labs[choice].length < 2){
                        continue
                    }
                    let lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    let lab2 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    while (lab1 == lab2) {
                        lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                        lab2 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    }
                    let course_details = []
                    for (let lab_course of lab_classes[clas]){
                        if(lab_course[0] == choice){
                            course_details = lab_course;
                            break;
                        }
                    }
                    for(let i = 0; i < course_details[1]; i++){
                        timetable_classes[clas][day][slot + i] = ["CSE102", course_details[3], lab1, lab2]
                        timetable_professors[course_details[3]][day][slot + i] = ["CSE102", clas, lab1, lab2]
                        timetable_labs[lab1][day][slot + i] = ["CSE102", clas, course_details[3]]
                        timetable_labs[lab2][day][slot + i] = ["CSE102", clas, course_details[3]]
                    }
                    lab_classes[clas].splice(lab_classes[clas].indexOf(course_details), 1)
                    continue
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
                if (choice.includes("ECE")){
                    let lab = possible_labs[choice][make_random() % possible_labs[choice].length];
                    let course_details = [];
                    for(let lab_course of lab_classes[clas]){
                        if(lab_course[0] == choice){
                            course_details = lab_course;
                            break;
                        }
                    }
                    for(let i = 0; i < course_details[1]; i++){
                        timetable_classes[clas][day][slot + i] = [choice, course_details[3], lab]
                        timetable_professors[course_details[3]][day][slot + i] = [choice, clas, lab]
                        timetable_labs[lab][day][slot + i] = [choice, clas, course_details[3]]
                    }
                    lab_classes[clas].splice(lab_classes[clas].indexOf(course_details), 1)
                    continue
                }
                if (possible_labs[choice].length < 2) {
                    continue;
                }
                let lab1 = ""
                let lab2 = ""
                while (lab1 == lab2) {
                    lab1 = possible_labs[choice][make_random() % possible_labs[choice].length];
                    lab2 = possible_labs[choice][make_random() % possible_labs[choice].length];
                }
                let course_details = []
                for (let lab_course of lab_classes[clas]){
                    if(lab_course[0] == choice){
                        course_details = lab_course;
                        break;
                    }
                }
                for (let i = 0; i < course_details[1]; i++){
                    timetable_classes[clas][day][slot + i] = [choice, course_details[3], lab1, lab2]
                    timetable_professors[course_details[3]][day][slot + i] = [choice, clas, lab1, lab2]
                    timetable_labs[lab1][day][slot + i] = [choice, clas, course_details[3]]
                    timetable_labs[lab2][day][slot + i] = [choice, clas, course_details[3]]
                }
                lab_classes[clas].splice(lab_classes[clas].indexOf(course_details), 1)
            }
        }
    }
}

function theory_insert(theory_classes, timetable_classes, timetable_professors){
    let classes = Object.keys(theory_classes);
    shuffle_array(classes)
    for(let clas of classes){
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < 8; slot++){
                if (timetable_classes[clas][day][slot] != "") {
                    continue;
                }
                let possibles = []
                for (let course of theory_classes[clas]){
                    if (is_free_professor(timetable_professors, course[3], day, slot)){
                        possibles.push(course);
                    }
                }
                if(possibles.length === 0){
                    continue;
                }
                let choice = possibles[make_random() % possibles.length];
                if (choice[0].includes("Self-Learning")){
                    let self_count = 0;
                    for (let i = 0; i < slot; i++) {
                        if (typeof timetable_classes[clas][day][i] == typeof "Lunch") {
                            continue;
                        }
                        if (timetable_classes[clas][day][i][0].includes("Self-Learning")) {
                            self_count += 1;
                        }
                    }
                    if(self_count >= 2){
                        let found_replacement = false;
                        for(let course of possibles){
                            if(!course[0].includes("Self-Learning")){
                                while (choice[0].includes("Self-Learning")) {
                                    choice = possibles[make_random() % possibles.length];
                                }
                                timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                                timetable_professors[choice[3]][day][slot] = [choice[0], clas];
                                found_replacement = true;
                                break
                            }
                        }
                        if(!found_replacement){
                            timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                        }
                    } else {
                        timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                    }
                } else {
                    timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                    timetable_professors[choice[3]][day][slot] = [choice[0], clas];
                }
                for(let theory_course of theory_classes[clas]){
                    if(theory_course[0] == choice[0]){
                        theory_course[1] -= 1
                        if(theory_course[1] == 0){
                            theory_classes[clas].splice(theory_classes[clas].indexOf(theory_course), 1)
                        }
                        break;
                    }
                }
            }
        }
    }
}

function class_swap(timetable_classes, clas, day, slot){
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 8; j++){
            if(timetable_classes[clas][i][j] === ""){
                timetable_classes[clas][i][j] = timetable_classes[clas][day][slot];
                return;
            }
        }
    }
}

function theory_update_1(theory_classes, timetable_classes, timetable_professors){
    for(let clas of Object.keys(timetable_classes)){
        if(theory_classes[clas].length === 0){
            continue;
        }
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < 8; slot++){
                if (theory_classes[clas].length === 0) {
                    continue;
                }
                if(typeof timetable_classes[clas][day][slot] === typeof "Lunch"){
                    continue;
                }
                if (timetable_classes[clas][day][slot][0].includes("Self-Learning")) {
                    let possibles = [];
                    for(let course of theory_classes[clas]){
                        if (is_free_professor(timetable_professors, course[3], day, slot)){
                            possibles.push(course);
                        }
                    }
                    if(possibles.length === 0){
                        continue
                    }
                    let temp = timetable_classes[clas][day][slot]
                    class_swap(timetable_classes, clas, day, slot);
                    let choice = possibles[make_random() % possibles.length];
                    timetable_classes[clas][day][slot] = [choice[0], choice[3]];
                    timetable_professors[choice[3]][day][slot] = [choice[0], clas];
                    for(let course of theory_classes[clas]){
                        if (course[0] == choice[0]){
                            course[1] -= 1;
                            if (course[1] === 0){
                                theory_classes[clas].splice(theory_classes[clas].indexOf(course), 1);
                            }
                            break;
                        }
                    }
                }
            }
        }
        let temp = JSON.parse(JSON.stringify(theory_classes))
        for(let course of temp[clas]){
            if(!course[0].includes("Self-Learning")){
                continue;
            }
            let check = false;
            for(let day = 0; day < 5; day++){
                for(let slot = 0; slot < 8; slot++){
                    if(timetable_classes[clas][day][slot] === "" && !check){
                        timetable_classes[clas][day][slot] = [course[0], course[3]];
                        theory_classes[clas].splice(theory_classes[clas].indexOf(course), 1)
                        check = true;
                    }
                }
            }
        }
    }
}

function initialise_class_courses(class_courses) {
    let result = JSON.parse(JSON.stringify(class_courses))
    let temp = JSON.parse(JSON.stringify(class_courses))

    for (let [clas, courses] of Object.entries(result)) {
        for (let course of courses) {
            if (course[2] === "LT") {
                let temp_1 = [course[0] + " T", course[1] - 2, "T", course[3]];
                course[1] = 2;
                course[2] = "L";
                result[clas].push(temp_1);
            } else if (course[2] === "L") {
                course[1] = course[1] - 1;
                let temp_1 = [course[0] + " T", 1, "T", course[3]];
                result[clas].push(temp_1);
            }
        }
    }

    let temp2 = JSON.parse(JSON.stringify(result))

    for (let [clas, courses] of Object.entries(temp2)) {
        let sum1 = 0;
        for (let course of courses) {
            sum1 += course[1];
        }
        let total_self_learning = 35 - sum1;
        while (total_self_learning != 0) {
            result[clas].push(["Self-Learning " + total_self_learning, 1, "T", "self_proff"]);
            total_self_learning -= 1;
        }
    }
    return result
}

function initialise_timetables(classes_to_courses, professors, labs, initial_lectures) {
    let timetable_classes_ini = {}
    let timetable_professors_ini = {}
    let timetable_labs_ini = {}

    for (let clas of Object.keys(classes_to_courses)) {
        timetable_classes_ini[clas] = [["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""]]
    }

    for (let proff of professors) {
        timetable_professors_ini[proff] = [["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""]]
    }
    timetable_professors_ini["self_proff"] = [["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""]]

    for (let lab of labs) {
        timetable_labs_ini[lab] = [["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""]]
    }

    let proff_to_year = {}
    for (let [clas, courses] of Object.entries(classes_to_courses)) {
        for (let course of courses) {
            if (proff_to_year[course[3]]) {
                if (proff_to_year[course[3]] != clas.slice(0, 1)) {
                    proff_to_year[course[3]] = "cross"
                }
            } else {
                proff_to_year[course[3]] = clas.slice(0, 1)
            }
        }
    }

    for (let clas of Object.keys(timetable_classes_ini)) {
        if (clas.slice(0, 1) === "1") {
            for (let day = 0; day < timetable_classes_ini[clas].length; day++) {
                timetable_classes_ini[clas][day][4] = "Lunch"
            }
        } else {
            for (let day = 0; day < timetable_classes_ini[clas].length; day++) {
                timetable_classes_ini[clas][day][5] = "Lunch"
            }
        }
    }

    for (let proff of Object.keys(proff_to_year)) {
        if(proff.includes("self")){
            continue;
        }
        if (proff_to_year[proff] === "1") {
            for (let day = 0; day < timetable_professors_ini[proff].length; day++) {
                timetable_professors_ini[proff][day][4] = "Lunch"
            }
        } else if (proff_to_year[proff] === "cross") {
            for (let day = 0; day < timetable_professors_ini[proff].length; day++) {
                timetable_professors_ini[proff][day][4] = "Lunch"
                timetable_professors_ini[proff][day][5] = "Lunch"
            }
        } else {
            for (let day = 0; day < timetable_professors_ini[proff].length; day++) {
                timetable_professors_ini[proff][day][5] = "Lunch"
            }
        }
    }

    let temp = JSON.parse(JSON.stringify(initial_lectures))

    for (let lecture of temp) {
        let clas, course_code, proff, day, slot = lecture;
        for (let course of classes_to_courses[clas]) {
            if (course[0] == course_code && course[3] == proff && course[2] == "T" && timetable_classes_ini[clas][day][slot] == "" && is_free_professor(timetable_professors_ini, proff, day, slot)) {
                timetable_classes_ini[clas][day][slot] = [course_code, proff]
                timetable_professors_ini[proff][day][slot] = [course_code, clas]
                initial_lectures.splice(initial_lectures.indexOf(lecture), 1);
                course[1] -= 1
                if (course[1] == 0) {
                    classes_to_courses[clas].splice(classes_to_courses.indexOf(course), 1);
                }
            }
        }
    }
    return [timetable_classes_ini, timetable_professors_ini, timetable_labs_ini, proff_to_year]
}

function format_timetables(timetable_classes, timetable_professors, timetable_labs, proff_to_year, proff_to_short){
    for(let clas of Object.keys(timetable_classes)){
        if(clas.slice(0,1) === "1"){
            for(let day = 0; day < 5; day++){
                timetable_classes[clas][day].splice(2, 0, "Break")
                timetable_classes[clas][day].splice(8, 0, "Break")
            }
        } else {
            for(let day = 0; day < 5; day++){
                timetable_classes[clas][day].splice(3, 0, "Break")
                timetable_classes[clas][day].splice(8, 0, "Break")
            }
        }
    }
    for(let prof of Object.keys(timetable_professors)){
        if(proff_to_year[prof] === "1"){
            for(let day = 0; day < 5; day++){
                timetable_professors[prof][day].splice(2, 0, "Break")
                timetable_professors[prof][day].splice(8, 0, "Break")
            }
        } else if(proff_to_year[prof] === "2") {
            for(let day = 0; day < 5; day++){
                timetable_professors[prof][day].splice(3, 0, "Break")
                timetable_professors[prof][day].splice(8, 0, "Break")
            }
        } else {
            for(let day = 0; day < 5; day++){
                if(timetable_professors[prof][day][2] === ""){
                    timetable_professors[prof][day].splice(2, 0, "Break")
                } else if (timetable_professors[prof][day][2][1].slice(0,1) === "1"){
                    timetable_professors[prof][day].splice(2, 0, "Break")
                } else {
                    timetable_professors[prof][day].splice(3, 0, "Break")
                }
                timetable_professors[prof][day].splice(8, 0, "Break")
            }
        }
    }

    for(let clas of Object.keys(timetable_classes)){
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < timetable_classes[clas][day].length; slot++){
                if(typeof timetable_classes[clas][day][slot] === typeof "string"){
                    continue
                } else {
                    if(timetable_classes[clas][day][slot][0].includes("Self-Learning")){
                        timetable_classes[clas][day][slot] = "Self-Learning"
                    } else {
                        let result = ""
                        for(let i of timetable_classes[clas][day][slot]){
                            if(proff_to_short[i]){
                                result += proff_to_short[i];
                            } else {
                                result += i;
                            }
                            result += " "
                        }
                        timetable_classes[clas][day][slot] = result
                    }
                }
            }
        }
    }

    for(let prof of Object.keys(timetable_professors)){
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < timetable_professors[prof][day].length; slot++){
                if(typeof timetable_professors[prof][day][slot] === typeof "string"){
                    continue
                } else {
                    let result = ""
                    for(let i of timetable_professors[prof][day][slot]){
                        result += i
                        result += " "
                    }
                    timetable_professors[prof][day][slot] = result
                }
            }
        }
    }

    for(let lab of Object.keys(timetable_labs)){
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < timetable_labs[lab][day].length; slot++){
                if(typeof timetable_labs[lab][day][slot] === typeof "string"){
                    continue
                } else {
                    let result = ""
                    for(let i of timetable_labs[lab][day][slot]){
                        result += i
                        result += " "
                    }
                    timetable_labs[lab][day][slot] = result
                }
            }
        }
    }
}

function verify_everything(classes_to_courses, timetable_classes, timetable_professors, timetable_labs) {
    let classes = Object.keys(timetable_classes);
    shuffle_array(classes);
    
    for (let clas of classes) {
        for (let day = 0; day < 5; day++) {
            let self_count = 0;
            for (let slot = 0; slot < 8; slot++) {
                if (timetable_classes[clas][day][slot] === "") {
                    return false;
                }

                if (timetable_classes[clas][day][slot] === "Lunch") {
                    continue;
                }

                const temp = timetable_classes[clas][day][slot];

                if (temp.length === 2) {
                    if (temp[0].includes("Self-Learning")) {
                        self_count += 1;
                        if (self_count > 3) {
                            return false;
                        }
                        for (let i = 0; i < classes_to_courses[clas].length; i++) {
                            if (classes_to_courses[clas][i][0] === temp[0]) {
                                classes_to_courses[clas].splice(i, 1);
                                break;
                            }
                        }
                        continue;
                    }
                    if (timetable_professors[temp[1]][day][slot][0] != temp[0] || timetable_professors[temp[1]][day][slot][1] != clas) {
                        return false;
                    }
                    timetable_professors[temp[1]][day][slot] = "";
                    for (let i = 0; i < classes_to_courses[clas].length; i++) {
                        if (classes_to_courses[clas][i][0] === temp[0]) {
                            classes_to_courses[clas][i][1] -= 1;
                            if (classes_to_courses[clas][i][1] === 0) {
                                classes_to_courses[clas].splice(i, 1);
                            }
                            break;
                        }
                    }
                    continue;
                } else if (temp[0].includes("ECE")) {
                    if (timetable_labs[temp[2]][day][slot][0] != temp[0] || timetable_labs[temp[2]][day][slot][1] != clas || timetable_labs[temp[2]][day][slot][2] != temp[1] ||
                        timetable_professors[temp[1]][day][slot][0] != temp[0] || timetable_professors[temp[1]][day][slot][1] != clas || timetable_professors[temp[1]][day][slot][2] != temp[2]) {
                        return false;
                    }
                    timetable_professors[temp[1]][day][slot] = "";
                    timetable_labs[temp[2]][day][slot] = "";
                } else if (temp.length === 4) {
                    if (timetable_labs[temp[2]][day][slot][0] != temp[0] || timetable_labs[temp[2]][day][slot][1] != clas || timetable_labs[temp[2]][day][slot][2] != temp[1] ||
                        timetable_labs[temp[3]][day][slot][0] != temp[0] || timetable_labs[temp[3]][day][slot][1] != clas || timetable_labs[temp[3]][day][slot][2] != temp[1] ||
                        timetable_professors[temp[1]][day][slot][0] != temp[0] || timetable_professors[temp[1]][day][slot][1] != clas || timetable_professors[temp[1]][day][slot][2] != temp[2] ||
                        timetable_professors[temp[1]][day][slot][3] != temp[3]) {
                        return false;
                    }
                    timetable_professors[temp[1]][day][slot] = "";
                    timetable_labs[temp[2]][day][slot] = "";
                    timetable_labs[temp[3]][day][slot] = "";
                } else if (temp.length === 6) {
                    if (timetable_labs[temp[4]][day][slot][0] != temp[0] || timetable_labs[temp[4]][day][slot][1] != clas || timetable_labs[temp[4]][day][slot][2] != temp[2] ||
                        timetable_labs[temp[5]][day][slot][0] != temp[1] || timetable_labs[temp[5]][day][slot][1] != clas || timetable_labs[temp[5]][day][slot][2] != temp[3] ||
                        timetable_professors[temp[2]][day][slot][0] != temp[0] || timetable_professors[temp[2]][day][slot][1] != clas || timetable_professors[temp[2]][day][slot][2] != temp[4] ||
                        timetable_professors[temp[3]][day][slot][0] != temp[1] || timetable_professors[temp[3]][day][slot][1] != clas || timetable_professors[temp[3]][day][slot][2] != temp[5]) {
                        return false;
                    }
                    timetable_professors[temp[2]][day][slot] = "";
                    timetable_professors[temp[3]][day][slot] = "";
                    timetable_labs[temp[4]][day][slot] = "";
                    timetable_labs[temp[5]][day][slot] = "";
                }
            }
        }
    }
    
    for (let proff of Object.keys(timetable_professors)) {
        for (let day = 0; day < 5; day++) {
            for (let slot = 0; slot < 8; slot++) {
                if (timetable_professors[proff][day][slot] != "" && timetable_professors[proff][day][slot] != "Lunch") {
                    return false;
                }
            }
        }
    }
    
    for (let lab of Object.keys(timetable_labs)) {
        for (let day = 0; day < 5; day++) {
            for (let slot = 0;  slot < 8; slot++) {
                if (timetable_labs[lab][day][slot] != "") {
                    return false;
                }
            }
        }
    }
    return true;
}

function get_replacements(classes_to_courses, timetable_professors){
    let proff_replacements = {}
    for(let prof of Object.keys(timetable_professors)){
        proff_replacements[prof] = {}
        for(let day = 0; day < 5; day++){
            for(let slot = 0; slot < 8; slot++){
                if(typeof timetable_professors[prof][day][slot] == typeof "string"){
                    continue
                }
                let clas = timetable_professors[prof][day][slot][1]
                let replacements = []
                for(let course of classes_to_courses[clas]){
                    if(is_free_professor(timetable_professors, course[3], day, slot)){
                        replacements.push(course[3])
                    }
                }
                proff_replacements[prof][day.toString() + slot.toString()] = replacements;
            }
        }
    }
    return proff_replacements
}

function get_timetables(class_courses, professors, proff_to_short, labs, initial_lectures) {
    let classes_to_courses = initialise_class_courses(class_courses);
    let [timetable_classes_ini, timetable_professors_ini, timetable_labs_ini, proff_to_year] = initialise_timetables(classes_to_courses, professors, labs, initial_lectures);

    let check = false;
    let fallback = 0;

    while (!check && fallback < 50) {
        let classes_to_courses1 = JSON.parse(JSON.stringify(classes_to_courses));
        let classes_to_courses2 = JSON.parse(JSON.stringify(classes_to_courses));

        let timetable_classes = JSON.parse(JSON.stringify(timetable_classes_ini));
        let timetable_professors = JSON.parse(JSON.stringify(timetable_professors_ini));
        let timetable_labs = JSON.parse(JSON.stringify(timetable_labs_ini));

        let lab_classes = {};
        for (let [clas, courses] of Object.entries(classes_to_courses1)) {
            let lab_course = courses.filter(course => course[2] === "L");
            lab_classes[clas] = JSON.parse(JSON.stringify(lab_course));
        }

        let theory_classes = {};
        for (let [clas, courses] of Object.entries(classes_to_courses1)) {
            theory_classes[clas] = courses.filter(course => course[2] === "T");
        }
        
        let class_phy_cprog_lab = {}
        let failsafe = 0
        while(!is_assigned_courses(lab_classes) && failsafe < 10){
            lab_insert(lab_classes, timetable_classes, timetable_professors, timetable_labs, class_phy_cprog_lab);
            failsafe += 1;
        }

        let theory_temp = {}
        let timetable_classes_temp = {}
        let timetable_professors_temp = {}
        failsafe = 0
        while(true && failsafe < 10){
            theory_temp = JSON.parse(JSON.stringify(theory_classes));
            timetable_classes_temp = JSON.parse(JSON.stringify(timetable_classes));
            timetable_professors_temp = JSON.parse(JSON.stringify(timetable_professors));
            theory_insert(theory_temp, timetable_classes_temp, timetable_professors_temp);
            theory_update_1(theory_temp, timetable_classes_temp, timetable_professors_temp);
            if (is_assigned_courses(theory_temp)) {
                break;
            }
            failsafe += 1
        }
        timetable_classes = JSON.parse(JSON.stringify(timetable_classes_temp));
        timetable_professors = JSON.parse(JSON.stringify(timetable_professors_temp));
        theory_classes = JSON.parse(JSON.stringify(theory_temp));

        let timetable_professors_copy = JSON.parse(JSON.stringify(timetable_professors_temp));
        let timetable_labs_copy = JSON.parse(JSON.stringify(timetable_labs));
        check = verify_everything(classes_to_courses2, timetable_classes, timetable_professors_copy, timetable_labs_copy)
        if(check){
            let proff_replacements = get_replacements(classes_to_courses2, timetable_professors);
            format_timetables(timetable_classes, timetable_professors, timetable_labs, proff_to_year, proff_to_short)
            return [timetable_classes, timetable_professors, proff_replacements, timetable_labs, classes_to_courses]
        }
        fallback += 1;
    }
    return {}
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