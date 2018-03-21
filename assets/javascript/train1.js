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

    var train;
    var destination;
    var first;
    var frequency;
    
    // database.ref().on("value", function(snap) {
    //     console.log(snap.trains);
    // })
    trainSchedule()

    function trainSchedule() {
        var ref = database.ref("trains");
        ref.once('value', function (snapshot) {
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
                // add each train to the table
                $('.table').append("<tr><td>" + (childSnapshot.val().train) +
                    "</td><td>" + (childSnapshot.val().destination) + "</td><td>" +
                    (childSnapshot.val().frequency) + "</td><td>" + (nextArrival) +
                    "</td><td>" + (minutesAway) + "</td></tr>");
            });
        });
    };

    
    // ref().orderByChild("dateAdded").on("child_added",function(snapshot){
    // 

    // database.ref().orderByChild("dateAdded").on("value", function(snapshot) {
    //     if (trains.length > 0) {
    //         console.log(trains)
    //         for (var i=0; i>trains.length; i++) {
    //             $('.table').append("<tr><td>" + (trains.train[i]) + "</td><td>" + (trains.destination[i]) + "</td><td>" + (trains.frequency[i]) + "</td></tr>");                   
   
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

        // Clear the input boxes on the screen
        $("#train-input").val("Train");
        $("#destination-input").val("Destination");
        $("#first-input").val("HH:mm");
        $("#frequency-input").val("00");

        // Add new input to the firebase
        database.ref('trains').push({
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            train: train,
            destination: destination,
            first: first,
            frequency: frequency,
        });
       
        $('.table').empty();
        trainSchedule();

    });
});


 // Output only the newest information into the relevant HTML sections
        // database.ref().once("child_added", function (snapshot) {
        //     $('.table').append("<tr><td>" + (snapshot.val().train) + "</td><td>" + (snapshot.val().destination) + "</td><td>" + (snapshot.val().frequency) + "</td></tr>");
        // });

    // calculate train times
//     function time() {
//         var firstConverted = moment(first, "HH:mm").subtract(1, "years");

//         var diffTime = moment().diff(moment(firstConverted), "minutes");

//         var tRemainder = diffTime % frequency;

//         minutesAway = frequency - tRemainder;
//         console.log(minutesAway);

//         var nextTrain = moment().add(minutesAway, "minutes");

//         nextArrival = (moment(nextTrain).format('HH:mm'));
//         console.log(nextArrival)

//         // add next train and minutes away to the table
//         $('.table tr:last').append("<td>" + (nextArrival) + "</td><td>" + (minutesAway) + "</td>");
//     }

//     trainSchedule();
// });

//         how to get the id tag key made on push to firebase
//         database.ref('trains').limitToLast(1).on('child_added', function(data) {
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



// ref.on('value', getData)    
// function getData(data) {
//     var trains = data.val(),
//     var keys = Object.keys(trains),
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
