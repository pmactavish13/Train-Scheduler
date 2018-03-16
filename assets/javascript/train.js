$(document).ready(function () {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCVAGh8-JQE4I-ei_Tnn8yFnoJ5QBG6o3o",
    authDomain: "train-scheduler-10c3f.firebaseapp.com",
    databaseURL: "https://train-scheduler-10c3f.firebaseio.com",
    projectId: "train-scheduler-10c3f",
    storageBucket: "",
    messagingSenderId: "427917446976"
};
firebase.initializeApp(config);

var newTrainSchedule = [{}];    

// Capture Button Click
$("#add-train").on("click", function(event) {
    event.preventDefault();
    if ($.trim($("#train-input").val()) === "" || $.trim($("#train-input").val()) === "train") {
        return false
    }
    if ($.trim($("#destination-input").val()) === "" || $.trim($("#destination-input").val()) === "destination") {
        return false
    }
    if ($.trim($("#first-input").val()) === "" || $.trim($("#first-input").val()) === "HH:mm") {
        return false
    }
    if ($.trim($("#frequency-input").val()) === "" || $.trim($("#frequency-input").val()) === "minutes") {
        return false
    }
    $("#train-input").empty();
    $("#destination-input").empty();
    $("#first-input").empty();
    $("#frequency-input").empty();

// Capture User Inputs and store them into variables
newTrainSchedule.push({
    newTrain: $("#train-input").val().trim(),
    newDestination: $("#destination-input").val().trim(),
    newFirst: $("#first-input").val().trim(),
    newFrequency: $("#frequency-input").val().trim() 
})

// Console log each of the user inputs to confirm we are receiving them correctly
console.log(newTrainSchedule);
console.log(newTrainSchedule[1].newTrain);
console.log(newTrainSchedule[1].newDestination);
console.log(newTrainSchedule[1].newFirst);
console.log(newTrainSchedule[1].newFrequency);


// Output all of the new information into the relevant HTML sections
$('.table').append("<tr><td>" + (newTrainSchedule.newTrain) + "</td><td>" + (newTrainSchedule.newDestination) + "</td><td>" + (newTrainSchedule.newFrequency) + "</td></tr>");
// $("#new-train").append(newTrain);
// $("#new-destination").append(newDestination);
// $("#new-frequency").append(newFrequency);
 
});    
});