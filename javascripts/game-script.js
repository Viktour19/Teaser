var alphabets = require('alphabets').alphabets;
var Acity = require('cities').cities;
var Aanimal = require('animals').animals;
var Acountry = require('countries').countries;
var caller = [];
var cond = true; // true condition means resume and false condition means pause
var answer;
var pos;
var displaytxt;
var possibleAnswers;
var JtimeLeft = 0;
var count = 0;
var jscore = 0;

function pauseOrResume() {
    if (cond != false) {
        if (JtimeLeft > 0) {
            JtimeLeft--;
            setTimeout('countDown()', 1000);
            document.querySelector('game-element').timeLeftChanged();
        } else {
            sessionStorage.setItem("score", jscore);
            window.location = "quit-element.html";
        }
    }
}

function countDown() {
    if (JtimeLeft > 0) {
        JtimeLeft--;
        setTimeout('pauseOrResume()', 1000);
        document.querySelector('game-element').timeLeftChanged();
    } else {
        sessionStorage.setItem("score", jscore);
        window.location = "quit-element.html";
    }
}

// Check if the input is valid
function validateInput(Vanswer, VpossibleAnswers, Vpos, Vcurtype, message) {
    // check if the input starts with the alphabet that was asked for
    if (Vanswer.substring(0, 1).toLowerCase() === alphabets[pos]) {
        message = "Correct I know say you sabi book ";
        // check all the possible answers for a match
        // use a forEach and check for each variable that start with the required alphabet, is the input same?
        for (i = 0; i < VpossibleAnswers.length; i++) {
            //check if the begining of both the input and the available answers are the same
            if (Vanswer.substring(0, 1).toLowerCase() === VpossibleAnswers[i].substring(0, 1).toLowerCase()) {

                // Check if the input is available in the possible answers i.e is the input Correct
                if (Vanswer.toLowerCase() === VpossibleAnswers[i].toLowerCase()) {
                    document.querySelector('game-element').addScore();
                    document.querySelector('game-element').addTime();
                    Vpos++;
                    message = "Enter a " + Vcurtype + " that starts with " + alphabets[Vpos].toUpperCase();
                }
            }
        }
    } else if (Vanswer === "") { // If the input is empty
        message = "Ogbeni enter " + Vcurtype + " wey start with " + alphabets[Vpos].toUpperCase() + " naa";
    } else { // If the input does not start with the alphabet asked for
        message = "Oga that " + Vcurtype + " does now start with " + alphabets[Vpos].toUpperCase() + " joor";
    }
    return [Vpos, message];
}

Polymer('game-element', {
    Cpos: 0,
    Apos: 0,
    Npos: 0,
    mode: "",
    timeLeft: 0,
    score: 0,
    created: function () {
        this.c_alphabet = "Enter a city that starts with A";
        this.n_alphabet = "Enter a country that starts with A";
        this.a_alphabet = "Enter an animal that starts with A";
        this.score = 0;
        this.mode = sessionStorage.getItem("mode");
    },
    // Let the game begin
    ready: function () {
        this.state = this.resume;
        this.statetxt = "start";
        this.$.input1.setAttribute('disabled', 'disabled');
        this.$.input2.setAttribute('disabled', 'disabled');
        this.$.input3.setAttribute('disabled', 'disabled');
        this.addTime();
    },
    // Just incase oga wants to cheat and pause the timer lol
    pause: function () {
        cond = false;
        this.state = this.resume;
        this.statetxt = "resume";
        this.$.input1.setAttribute('disabled', 'disabled');
        this.$.input2.setAttribute('disabled', 'disabled');
        this.$.input3.setAttribute('disabled', 'disabled');
    },
    //Just in case oga wants to go back i.e resume
    resume: function resume() {
        cond = true;
        this.state = this.pause;
        this.statetxt = "pause";
        this.$.input1.removeAttribute('disabled');
        this.$.input2.removeAttribute('disabled');
        this.$.input3.removeAttribute('disabled');
        JtimeLeft = this.timeLeft;
        pauseOrResume();
    },
    addScore: function () {
        this.score += 10;
        jscore = this.score;
    },
    c_alphabetChanged: function () {
        this.c_alphabet = caller[1];
    },
    n_alphabetChanged: function () {
        this.n_alphabet = caller[1];
    },
    a_alphabetChanged: function () {
        this.a_alphabet = caller[1];
    },
    // update the diplay time based on the timer
    timeLeftChanged: function () {
        this.timeLeft = JtimeLeft;
    },
    // Keep watch on changes made to the city field
    cityChanged: function () {
        curtype = "City";
        answer = this.city;
        pos = this.Cpos;
        possibleAnswers = Acity;
        caller = validateInput(answer, possibleAnswers, this.Cpos, curtype);
        this.Cpos = caller[0];
        this.c_alphabetChanged();
    },
    // Keep watch on changes made to the animal field
    animalChanged: function () {
        curtype = "Animal";
        answer = this.animal;
        pos = this.Apos;
        possibleAnswers = Aanimal;
        caller = validateInput(answer, possibleAnswers, this.Apos, curtype);
        this.Apos = caller[0];
        this.a_alphabetChanged();
    },
    // Keep watch on changes made to the country field
    countryChanged: function () {
        curtype = "Country";
        answer = this.country;
        pos = this.Npos;
        possibleAnswers = Acountry;
        caller = validateInput(answer, possibleAnswers, this.Npos, curtype);
        this.Npos = caller[0];
        this.n_alphabetChanged();
    },
    //increase the time if a question is gotten correctly and based on the mode choosen
    addTime: function () {
        if (this.mode === "hard") {
            if (count === 0) {
                this.timeLeft = 20;
                JtimeLeft = 20;
                count++;
            } else {
                JtimeLeft += 10;
                this.timeLeftChanged();
            }
        } else if (this.mode === "master") {
            if (count === 0) {
                this.timeLeft = 15;
                JtimeLeft = 15;
                count++;
            } else {
                JtimeLeft += 8;
                this.timeLeftChanged();
            }
        } else if (this.mode === "expert") {
            if (count === 0) {
                this.timeLeft = 10;
                JtimeLeft = 10;
                count++;
            } else {
                JtimeLeft += 5;
                this.timeLeftChanged();
            }
            this.timeLeft = 20;
        } else {
            if (count === 0) {
                JtimeLeft = 25;
                this.timeLeft = 25;
                count++;
            } else {
                JtimeLeft += 15;
                this.timeLeftChanged();
            }
        }
    },
});