$(document).ready(function () {

    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyCVAGh8-JQE4I-ei_Tnn8yFnoJ5QBG6o3o",
        authDomain: "train-scheduler-10c3f.firebaseapp.com",
        databaseURL: "https://train-scheduler-10c3f.firebaseio.com",
        projectId: "train-scheduler-10c3f",
        storageBucket: "train-scheduler-10c3f.appspot.com",
        messagingSenderId: "427917446976"
    };

    firebase.initializeApp(config);

    // set a reference to the database service
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
                var row = "<tr id='" + dataKey + "' value='" + dataKey + "'><td>"
                $('.table').append(row + (childSnapshot.val().train) +
                    "</td><td>" + (childSnapshot.val().destination) + "</td><td>" +
                    (childSnapshot.val().frequency) + "</td><td>" + (nextArrival) +
                    "</td><td>" + (minutesAway) + "</td></tr>");
            });
        });
    };

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
        $('.table').empty();
        trainSchedule();
    });

    console.log(trainsLogged);
    console.log(newTrain);

    // if any trains in the database starts timer to update train times
    function startTimer() {

        if (trainsLogged == "true" || newTrain == "true") {
            console.log("timer true works")
            //set timer
            timeTilUpdate = 60;
            // set timer interval to 1 second   
            interval = setInterval(decrement, 1000);
            decrement();
        };
    };

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
            // database.ref().on("value", function(snap) {
            //     console.log(snap.trains);
            // })startTimer();
            // calculate train times
            //      function time() {
            //      add next train and minutes away to the table
            //      $('.table tr:last').html("<td>" + (nextArrival) + "</td><td>" + (minutesAway) + "</td>");



 // Output only the newest information into the relevant HTML sections
    // database.ref().once("child_added", function (snapshot) {
    // $('.table').append("<tr><td>" + (snapshot.val().train) + "</td><td>" + (snapshot.val().destination) + "</td><td>" + (snapshot.val().frequency) + "</td></tr>");
    // });


//     }

//   how to get the id tag key made on push to firebase
//   database.ref('trains').limitToLast(1).on('child_added', function(data) {
//         console.log(data.key);
//             dataKey = (data.key);
//         });

// function upDateTime() {
//          console.log(dataKey); 
//         console.log(typeof(firebase.database()))
//          console.log(firebase.database().ref().dataKey/ + )
//          console.log(firebase.database().ref()/data.key/frequency)
//      }

   //  https://train-scheduler-10c3f.firebaseio.com
// add data to firebase
    // firebase.database().ref('key/schedule/').update ({ 
    //     nextArrival: nextArrival,
    //     minutesAway: minutesAway      
    // });
//}
// Output all of the information into the relevant HTML sections
 //   ref().child().orderByChild("dateAdded").on("child_added",function(snapshot){
 //   $('.table').append("<tr><td>" + (snapshot.val().child('train') + "</td><td>")) + (snapshot.val().trains/destination) + "</td><td>" + (snapshot.val().trains/schedule/frequency) + "</td><td>" + (snapshot.val().trains/schedule/nextArrival) + "</td><td>" + (snapshot.val().trains/schedule/minutesAway) +"</td></tr>");
//         timeTilUpdate = 60
//         interval = setInterval(decrement, 1000);
//         decrement();
 //    });
//     database.ref().child('schedule').on('value', snapshot => {
//   console.log(snapshot.val());
// });
   // console.log(database.ref().trains.schedule)       

//  // var childData = childSnapshot.val();
    // console.log(childData);
    // trains.push(childData);
    // var train = childData.train;
    // var destination = childData.destination;
    // var frequency = childData.frequency; 

    // ref().orderByChild("dateAdded").on("child_added",function(snapshot){
    // 
    // database.ref().orderByChild("dateAdded").on("value", function(snapshot) {
    //     if (trains.length > 0) {
    //         console.log(trains)
    //         for (var i=0; i>trains.length; i++) {
    //             $('.table').append("<tr><td>" + (trains.train[i]) + "</td><td>" + (trains.destination[i]) + "</td><td>" + (trains.frequency[i]) + "</td></tr>");                   
