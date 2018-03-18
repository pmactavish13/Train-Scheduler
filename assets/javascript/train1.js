
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

// Get a reference to the database service
var database = firebase.database();
var ref = database.ref('trains');

var interval;
var timeTilUpdate = 60;
var dateAdded = 0;
var newTrain = "";
var newDestination= "";
var newFirst = "";
var newFrequency = 0;
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
    
    // Capture User Inputs and store them into variables
    newTrain = $("#train-input").val().trim();
    newDestination = $("#destination-input").val().trim();
    newFirst = $("#first-input").val().trim();
    newFrequency = $("#frequency-input").val().trim();
    
    // Clear the input boxes on the screen
    $("#train-input").empty();
    $("#destination-input").empty();
    $("#first-input").empty();
    $("#frequency-input").empty();
    
    // enter data to firebase
    ref.push({
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        train: newTrain,
        destination: newDestination,   
        schedule: [
            {
            first: newFirst,
            frequency: newFrequency,
            }
        ]      
    });
    
    time();
});

    //var currentTime = moment();
    //console.log(moment());

// set train time
function time () {
    var newFirstConverted = moment(newFirst, "HH:mm").subtract(1, "years");
    console.log(newFirstConverted);
    
    var diffTime = moment().diff(moment(newFirstConverted), "minutes");
    console.log(diffTime);
    
    var tRemainder = diffTime % newFrequency;
    console.log(tRemainder);
    
    var minutesAway = newFrequency - tRemainder;
    
    var nextTrain = moment().add(minutesAway, "minutes");
    nextArrival = (moment(nextTrain).format('HH.mm'));
debugger
    // enter data to firebase
    ref.child('postKey/schedule/').update ({ 
            nextArrival: nextArrival,
            minutesAway: minutesAway      
    });
    
};    
    

// Output all of the information into the relevant HTML sections
 //   ref().child().orderByChild("dateAdded").on("child_added",function(snapshot){
 //   $('.table').append("<tr><td>" + (snapshot.val().child('train') + "</td><td>"));


    //     // + (snapshot.val().trains/destination) + "</td><td>" + (snapshot.val().trains/schedule/frequency) + "</td><td>" + (snapshot.val().trains/schedule/nextArrival) + "</td><td>" + (snapshot.val().trains/schedule/minutesAway) +"</td></tr>");
//         timeTilUpdate = 60
//         interval = setInterval(decrement, 1000);
//         decrement();
 //    });
//     database.ref().child('schedule').on('value', snapshot => {
//   console.log(snapshot.val());
// });
   // console.log(database.ref().trains.schedule)       

// Output only the new information into the relevant HTML sections
    // ref.orderByChild("dateAdded").limitToLast(1).on("child_added",function(snapshot){
    // $('.table').append("<tr><td>" + (snapshot.val().newTrain) + "</td><td>" + (snapshot.val().newDestination) + "</td><td>" + (snapshot.val().newFrequency) + "</td><td>" + (snapshot.val().nextArrival) + "</td><td>" + (snapshot.val().minutesAway) +"</td></tr>");
    // });  

            // var trains = data.val();
            // var keys = Object.keys(newFirst);
            // console.log(keys);
//    }
//         firebase.database().ref().orderByChild("dateAdded").function({
//         console.log(newFirst[0]);
//         console.log(newFrequency[0]);

//         });
//     };
// };    
    

}); 
// "</td><td>" + tMinutesTillTrain + 