
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBuQgsXlVj75CZFztL2QCQZhW2zURtv1g4",
    authDomain: "train-scheduler-f9173.firebaseapp.com",
    databaseURL: "https://train-scheduler-f9173.firebaseio.com",
    projectId: "train-scheduler-f9173",
    storageBucket: "",
    messagingSenderId: "77611962012"
  };
  firebase.initializeApp(config);


var database = firebase.database();

var IDList = [];
IDList.push('employee-table')
    // Reset the values in the HTML.
    $("#trainName").val('');
    $("#destination").val('');
    $("#firstTrain").val('');
    $("#frequency").val('');

    // push the current time to database

    var time = moment();
    currentTime = moment(time).format('hh:mm');
    database.ref().child('employee-table').update({
        time: currentTime
    });

    var firstTime = newTrain.firstTrain
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    //console.log(firstTimeConverted)

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    var frequency = parseInt(newTrain.frequency)
    var tRemainder = diffTime % frequency;
    //console.log(tRemainder);

    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrainTime = moment(moment(time), 'hh:mm').add(parseInt(tMinutesTillTrain), 'minutes')
    //console.log("THE NEXT TRAIN ARRIVES AT: " + nextTrainTime)

    var arrival = moment(nextTrainTime).format('hh:mm')




    database.ref().child('employee-table').update({
        timeUntil: tMinutesTillTrain,
    });

    database.ref().child('employee-table').update({
        arrival: arrival,
    });



database.ref().on('child_added', function(snapshot) {

    var key = database.ref(snapshot.key);

    key.on('value', function(snapshot) {

        item = snapshot.val();

        console.log(item.arrival);

        var newRow = $('<tr>');

        var name = $('<td>');
        name.text(item.name);

        var dest = $('<td>');
        dest.text(item.destination);

        var freq = $('<td>')
        freq.text(item.frequency);

        var arrive = $('<td>');
        arrive.text(item.arrival);

        var min = $('<td>');
        min.text(item.timeUntil)

        newRow.append(name);
        newRow.append(dest);
        newRow.append(freq);
        newRow.append(arrive);
        newRow.append(min);

        $('#tableBody').append(newRow);
    })
})