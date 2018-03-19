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

    // Get a reference to the database service
    var database = firebase.database();
    var ref = database.ref();
    // var ref = database.ref("trains");

    var newTrain = "";
    var newDestination = "";
    var newFirst = "";
    var newFrequency = 0;
    var dateAdded = 0;
    var nextArrival = "";
    var minutesAway = 0;

    // Capture Button Click
    $("#add-train").on("click", function (event) {
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

        // Capture User Inputs and store them into variables
        newTrain = $("#train-input").val().trim(),
            newDestination = $("#destination-input").val().trim(),
            newFirst = $("#first-input").val().trim(),
            newFrequency = $("#frequency-input").val().trim()

        // Clear the input boxes on the screen
        $("#train-input").empty();
        $("#destination-input").empty();
        $("#first-input").empty();
        $("#frequency-input").empty();

        console.log(newTrain);
        console.log(newDestination);
        console.log(newFirst);
        console.log(newFrequency);

        time();

    });

    // set next an minutes til time
    function time() {

        //var currentTime = moment();
        //console.log(moment());

        var newFirstConverted = moment(newFirst, "HH:mm").subtract(1, "years");
        console.log(newFirstConverted);

        var diffTime = moment().diff(moment(newFirstConverted), "minutes");

        var tRemainder = diffTime % newFrequency;

        var minutesAway = newFrequency - tRemainder;

        var nextTrain = moment().add(minutesAway, "minutes");

        nextArrival = (moment(nextTrain).format('HH.mm'));
        console.log(nextArrival);

        firebase.database().ref().push({
            train: newTrain,
            destination: newDestination,
            first: newFirst,
            frequency: newFrequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

    };

    // Output all of the new information into the relevant HTML sections
    // ref.orderByChild("dateAdded").limitToLast(1).on("child_added",function(snapshot){
    // $('.table').append("<tr><td>" + (snapshot.val().train) + "</td><td>" + (snapshot.val().destination) + "</td><td>" + (snapshot.val().frequency) + "</td><td>" + (snapshot.val().nextArrival) + "</td><td>" + (snapshot.val().minutesAway) +"</td></tr>");
    // });




    // "</td><td>" + tMinutesTillTrain + 

    firebase.database().ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
        $('.table').append("<tr><td>" + (snapshot.val().train) + "</td><td>" + (snapshot.val().destination) + "</td><td>" + (snapshot.val().frequency) + "</td><td>" + (snapshot.val().nextArrival) + "</td><td>" + (snapshot.val().minutesAway) + "</td></tr>");
    });

});      