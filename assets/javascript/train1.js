$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCVAGh8-JQE4I-ei_Tnn8yFnoJ5QBG6o3o",
        authDomain: "train-scheduler-10c3f.firebaseapp.com",
        databaseURL: "https://train-scheduler-10c3f.firebaseio.com",
        projectId: "train-scheduler-10c3f",
        storageBucket: "train-scheduler-10c3f.appspot.com",
        messagingSenderId: "427917446976"
    };

    firebase.initializeApp(config);

    //     set a reference to the database service
    var database = firebase.database();

    var trainsLogged = "true";
    var newTrain = "true";
    var train;
    var destination;
    var first;
    var frequency;
    var timeTilUpdate = 60;
    var regEx = RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");

    database.ref('trains').limitToFirst(1).once('value', function (snapshot) {
        // if data exists
        if (snapshot.exists()) {
            trainsLogged = "true";
            startTimer();
            trainSchedule();
        };
    });

    // log existing train schedule from the database
    function trainSchedule() {
        // access the database
        var ref = database.ref("trains");
        ref.once('value', function (snapshot) {
            // pull time data for each train
            snapshot.forEach(function (childSnapshot) {
                first = childSnapshot.val().first;
                frequency = childSnapshot.val().frequency;
                // calculate nextArrival and minutesAway
                var firstConverted = moment(first, "HH:mm").subtract(1, "years");
                var diffTime = moment().diff(moment(firstConverted), "minutes");
                var tRemainder = diffTime % frequency;
                var minutesAway = frequency - tRemainder;
                var nextTrain = moment().add(minutesAway, "minutes");
                var nextArrival = (moment(nextTrain).format('HH:mm'));
                //get the data entry key created on push for each train
                var dataKey = childSnapshot.key;
                // add each train to the table with row id tag of dataKey
                var row = "<tr class= 'trainInfo' id='" + dataKey + "' data-key='" + dataKey + "'><td data-key='" + dataKey + "' >"
                $('.table').append(row + (childSnapshot.val().train) +
                    "</td><td>" + (childSnapshot.val().destination) + "</td><td>" +
                    (childSnapshot.val().frequency) + "</td><td>" + (nextArrival) +
                    "</td><td>" + (minutesAway) + "</td></tr>");
            });
        });
    };

    // Capture Button Click input new train
    $("#add-train").on("click", function (event) {
        event.preventDefault();
        // check that input is valid
        if ($.trim($("#train-input").val()) === "" || $.trim($("#train-input").val()) === "train") {
            $("#train-input").val("Enter a valid train");
            return false;
        };
        if ($.trim($("#destination-input").val()) === "" || $.trim($("#destination-input").val()) === "destination") {
            $("#destination-input").val("Enter a valid destination");
            return false;
        };
        if ($.trim($("#first-input").val()) === "" || $.trim($("#first-input").val()) === "HH:mm" ||regEx.test($.trim($("#first-input").val())) == false) {
            $("#first-input").val("Enter a valid military time: HH:mm");
            return false;
        };
        if ($.trim($("#frequency-input").val()) === "" || $.trim($("#frequency-input").val()) === "minutes") {
            $("#frequency-input").val("Enter a valid frequency");
            return false;
        }; 

        // Capture User Inputs and store them into variables
        train = $("#train-input").val().trim();
        destination = $("#destination-input").val().trim();
        first = $("#first-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Clear the input boxes on the screen and replace with placer text
        $("#train-input").val("Train");
        $("#destination-input").val("Destination");
        $("#first-input").val("HH:mm");
        $("#frequency-input").val("00");

        // Add new input to the firebase database
        database.ref('trains').push({
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            train: train,
            destination: destination,
            first: first,
            frequency: frequency,
        });
        newTrain = "true";
        $("tr:not(:first)").remove();
        trainSchedule();
    });

    //set-up screen to edit or remove a train
    $(document).on("click", "tr.trainInfo", function addRemove() {
        //clearInterval(interval);
        $("#edit-remove").show();
        $("#train-schedule").hide();
        $("#train-schedule-input").hide();
        // set-up to get the key stored in tr data
        var changeTrain = $(this).attr("data-key");
        // access the firebase database
        var ref = database.ref("trains/" + changeTrain);
        ref.once('value', function (snapshot) {
            var myJSON = JSON.stringify(snapshot);
            var trainInfo = JSON.parse(myJSON);
            // Change the input boxes on the screen to show the info of the train clicked
            $("#train-clicked").val(trainInfo.train);
            $("#train-clicked").attr('data-key', changeTrain);
            $("#destination-clicked").val(trainInfo.destination);
            $("#first-clicked").val(trainInfo.first);
            $("#frequency-clicked").val(trainInfo.frequency);
        });
    });

    // Capture Button Click input to delete train info
    $("#delete-train").on("click", function (event) {
        event.preventDefault();
        // get key saved in input box id
        var dataKey = $("#train-clicked").attr("data-key");
        // access firebase
        var ref = database.ref("trains/" + dataKey);
        ref.once('value', function (snapshot) {
            //make sure train is there
            if (snapshot !== null) {
                // remove train from screen    
                $("#" + dataKey + " ").remove();
                // change back to regular screen
                $("#edit-remove").hide();
                $("#train-schedule").show();
                $("#train-schedule-input").show();
                // delete train
                snapshot.ref.remove();
            };
        });
    });

    // Capture Button Click input to edit train info
    $("#edit-train").on("click", function (event) {
        event.preventDefault();
        // get key saved in input box id
        var dataKey = $("#train-clicked").attr("data-key");
        // Capture User Inputs and store them into variables
        train = $("#train-clicked").val().trim();
        destination = $("#destination-clicked").val().trim();
        first = $("#first-clicked").val().trim();
        frequency = $("#frequency-clicked").val().trim();
        // validate first train input
        if (first === "" || first === "HH:mm" ||regEx.test(first) == false) {
            $("#first-clicked").val("Enter a valid military time: HH:mm");
            return false;
        }
        // access firebase
        var ref = database.ref("trains/" + dataKey)
        ref.once('value', function (snapshot) {
            //make sure train is there
            if (snapshot !== null) {
                // edit train 
                database.ref('trains/' + dataKey).set({
                    dateAdded: firebase.database.ServerValue.TIMESTAMP,
                    train: train,
                    destination: destination,
                    first: first,
                    frequency: frequency,
                });
                // remove trains from screen 
                $("tr:not(:first)").remove();   
                // change back to regular screen
                $("#edit-remove").hide();
                $("#train-schedule").show();
                $("#train-schedule-input").show();
                // calculate times repost trains
                trainSchedule();
            };
        });
    });

    // if any trains in the database, starts timer to update train times
    function startTimer() {
        if (trainsLogged == "true" || newTrain == "true") {
            //set timer
            timeTilUpdate = 60;
            // set timer interval to 1 second   
            interval = setInterval(decrement, 1000);
            decrement();
        };
    };

    // timer to update trains every minute
    function decrement(updateTimes) {
        timeTilUpdate--;
        if (timeTilUpdate === 0) {
            clearInterval(interval);
            timeTilUpdate = 60;
            startTimer()
            var ref = database.ref("trains");
            ref.once('value', function(snapshot) {
                // pull time data for each train
                snapshot.forEach(function(childSnapshot) {
                    first = childSnapshot.val().first;
                    frequency = childSnapshot.val().frequency;
                    // calculate nextArrival and minutesAway
                    var firstConverted = moment(first, "HH:mm").subtract(1, "years");
                    var diffTime = moment().diff(moment(firstConverted), "minutes");
                    var tRemainder = diffTime % frequency;
                    var minutesAway = frequency - tRemainder;
                    var nextTrain = moment().add(minutesAway, "minutes");
                    var nextArrival = (moment(nextTrain).format('HH:mm'));
                    //get the data entry key created on push for each train
                    var dataKey = childSnapshot.key;
                    // update each train time to the table with row id tag of dataKey
                    $("#" + dataKey + " td:nth-child(4)").html(nextArrival);
                    $("#" + dataKey + " td:last").html(minutesAway);
                });
            });
        };
    };
});