
$(document).ready(function () {



 //Initialize Firebase
 var config = {
    apiKey: "AIzaSyCVAGh8-JQE4I-ei_Tnn8yFnoJ5QBG6o3o",
    authDomain: "train-scheduler-10c3f.firebaseapp.com",
    databaseURL: "https://train-scheduler-10c3f.firebaseio.com",
    projectId: "train-scheduler-10c3f",
    storageBucket: "",
    essagingSenderId: "427917446976"
};
firebase.initializeApp(config);

window.onload = function() {
    console.log("hi")
}

var newTrain = "";
var newDestination= "";
var newFirst = "";
var newFrequency = 0;
var dateAdded = 0;
var nextArrival = "";
var minutesAway = 0;
  
// Capture Button Click
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // check that input is valid
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

    // Clear the input boxes on the screen
    $("#train-input").empty();
    $("#destination-input").empty();
    $("#first-input").empty();
    $("#frequency-input").empty();
    
    // Capture User Inputs and store them into variables
    newTrain = $("#train-input").val().trim(),
    newDestination = $("#destination-input").val().trim(),
    newFirst = $("#first-input").val().trim(),
    newFrequency = $("#frequency-input").val().trim() 

    console.log(newTrain);
    console.log(newDestination);
    console.log(newFirst);
    console.log(newFrequency);

    

    //var currentTime = moment();
    //console.log(moment());
    
    var newFirstConverted = moment(newFirst, "HH:mm").subtract(1, "years");
    console.log(newFirstConverted);
    
    var diffTime = moment().diff(moment(newFirstConverted), "minutes");
    console.log(diffTime);
    
    var tRemainder = diffTime % newFrequency;
    console.log(tRemainder);
    
    var minutesAway = newFrequency - tRemainder;
    
    var nextTrain = moment().add(minutesAway, "minutes");
    nextArrival = (moment(nextTrain).format('HH.mm'));
    //console.log(nextArrival);
    
    firebase.database().ref().push({
        newTrain: newTrain,
        newDestination: newDestination,
        newFirst: newFirst,
        newFrequency: newFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });
});


// Output all of the new information into the relevant HTML sections
firebase.database().ref().orderByChild("dateAdded").limitToLast(1).on("child_added",function(snapshot){
    $('.table').append("<tr><td>" + (snapshot.val().newTrain) + "</td><td>" + (snapshot.val().newDestination) + "</td><td>" + (snapshot.val().newFrequency) + "</td><td>" + (snapshot.val().nextArrival) + "</td><td>" + (snapshot.val().minutesAway) +"</td></tr>");
});
   
}); 
// "</td><td>" + tMinutesTillTrain + 