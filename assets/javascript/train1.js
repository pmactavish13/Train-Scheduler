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

    database.ref('trains').limitToFirst(1).once('value', function (snapshot) {
        // if data exists
        if (snapshot.exists()) {
            console.log("YES-Exists");
            trainsLogged = "true"
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
                first = childSnapshot.val().first
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
        ref.once('value', function(snapshot) {
            console.log(snapshot)
            var myJSON = JSON.stringify(snapshot);
            console.log(myJSON)
            var trainInfo = JSON.parse(myJSON)
            console.log(trainInfo.train)
            // Change the input boxes on the screen to show the info of the train clicked
            $("#train-clicked").val(trainInfo.train);
            $("#train-clicked").attr('data-key', changeTrain);
            $("#destination-clicked").val(trainInfo.destination);
            $("#first-clicked").val(trainInfo.first);
            $("#frequency-clicked").val(trainInfo.frequency);
            debugger
        });
    });

    // Capture Button Click input to delete train info
    $("#delete-train").on("click", function (event) {
        event.preventDefault();
        var dataKey = $("#train-clicked").attr("data-key");
        var ref = database.ref("trains/" + dataKey)
        ref.once('value', function (snapshot) {
            if (snapshot === null) {
                console.log("does not exist")
            } else {
            $("#" + dataKey + " ").remove();
            $("#edit-remove").hide();
            $("#train-schedule").show();
            $("#train-schedule-input").show();
             snapshot.ref.remove();
            
            }
        })
    })
        
        // var ref = database.ref("trains/" + dataKey);
        // ref.once('value', function(snapshot) { 
        // console.log(snapshot)
        //     snapshot.forEach(function (childSnapshot) {
        //    snapshot.ref.remove()
        //     })
        //var deleteRef = database.ref('trains/'+ dataKey);
        


    


// Capture Button Click input to edit train info
$("#edit-train").on("click", function (event) {
    event.preventDefault();
    // Capture User Inputs and store them into variables
    train = $("#train-clicked").val().trim();
    destination = $("#destination-clicked").val().trim();
    first = $("#first-clicked").val().trim();
    frequency = $("#frequency-clicked").val().trim();

    database.ref('trains').push({
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        train: train,
        destination: destination,
        first: first,
        frequency: frequency,
    });
    $("tr:not(:first)").remove();
    trainSchedule();
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
        ref.once('value', function (snapshot) {
            // pull time data for each train
            snapshot.forEach(function (childSnapshot) {
                first = childSnapshot.val().first
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

 // Output only the newest information into the relevant HTML sections
    // database.ref().once("child_added", function (snapshot) {
    // $('.table').append("<tr><td>" + (snapshot.val().train) + "</td><td>" + (snapshot.val().destination) + "</td><td>" + (snapshot.val().frequency) + "</td></tr>");
    // });

//   how to get the id tag key made on push to firebase
//   database.ref('trains').limitToLast(1).on('child_added', function(data) {
//         console.log(data.key);
//             dataKey = (data.key);
//         });


// add data to firebase
    // firebase.database().ref('key/schedule/').update ({ 
    //     nextArrival: nextArrival,
    //     minutesAway: minutesAway      
    // });

    // ref().orderByChild("dateAdded").on("child_added",function(snapshot){
    // 
    // database.ref().orderByChild("dateAdded").on("value", function(snapshot) {
    //     if (trains.length > 0) {
    //         console.log(trains)

