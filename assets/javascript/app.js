$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyA2_wUh44MN8bkLfWV2OZWTHyIwh38EuTs",
        authDomain: "first-project-e0694.firebaseapp.com",
        databaseURL: "https://first-project-e0694.firebaseio.com",
        projectId: "first-project-e0694",
        storageBucket: "",
        messagingSenderId: "837949321578"
    };
    firebase.initializeApp(config);
    console.log(firebase);
    var db = firebase.database();
    var ref = db.ref('trainSchedule');

    var trainObj = {
        trainName: null,
        destination: null,
        time: null,
        frequency: 0,
        minitAway: 0,
    };

    function setData() {




    }
    displayInTable();
    $("#addBtn").on("click", function () {
        
        //debugger
        trainObj.trainName = $("#train-name").val();
        trainObj.destination = $("#dastination").val();
        trainObj.time =convertTime($("#time").val());
        trainObj.frequency = $("#frequency").val();
        // trainObj.minitAway=trainObj.time-trainObj.frequency;
        
        ref.push(trainObj);
        displayInTable();
        console.log(trainObj.time);

    });
    
    
    function displayInTable(){
        ref.on('value', function (data) {
          
            var trainSchedule = data.val();
            var keys = Object.keys(trainSchedule);
            $('#table').find('tbody').empty();
            keys.forEach(element => {

                var row = $("<tr>");
                var updatBtn=$("<button>");
                var removeBtn=$("<button>");
                updatBtn.addClass("update");
                removeBtn.addClass("remove");
                updatBtn.text("Update");
                removeBtn.text("Remove");

                var col = $("<td>");
                var col2 = $("<td>");
                var col3 = $("<td>");
                var col4 = $("<td>");
                var col5 = $("<td>");
                var col6 = $("<td>");
                
                col.text(trainSchedule[element].trainName);
                col2.text(trainSchedule[element].destination);
                col3.text(trainSchedule[element].frequency);
                col4.text(trainSchedule[element].time);
                // col5.text(trainObj.minitAway);
                col6.append(updatBtn,removeBtn);
                row.append(col);
                row.append(col2);
                row.append(col3);
                row.append(col4);
                row.append(col5);
                row.append(col6);
                $("#tbody").prepend(row);
            });
           

        });
        
    }
    function convertTime(time){
        time = time.split(':'); // convert to array

        // fetch
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);
        
        // calculate
        var timeValue;
        
        if (hours > 0 && hours <= 12)
        {
          timeValue= "" + hours;
        } else if (hours > 12)
        {
          timeValue= "" + (hours - 12);
        }
        else if (hours == 0)
        {
          timeValue= "12";
        }
         
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        //timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
        
        // show
        // alert(timeValue);
        // console.log(timeValue);
        return timeValue;

    }
});