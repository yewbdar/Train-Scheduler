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
    // console.log(firebase);
    var db = firebase.database();
    var ref = db.ref('trainSchedule');

    // var providerGoogle = new firebase.auth.GoogleAuthProvider();
    var providerGithub = new firebase.auth.GithubAuthProvider();
    //console.log(ref);

    var trainObj = {
        trainName: null,
        destination: null,
        firstTrainTimtime: null,
        frequency: 0,

    };
    var calculatObj = {
        waittingTime: 0,
        arrivalTime: 0,
        isUpdate: false,
        selectedKey: null,
    }
    firebase.auth().signInWithPopup(providerGithub).then(function (result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });

    //accept all user data ,
    //and add object to firbase if isUpdate is flase or update  if isUpdate is true.
    $("#addBtn").on("click", function () {

         //add new data in firbase 
        if (validation()) {
            trainObj.trainName = $("#train-name").val();
            trainObj.destination = $("#dastination").val();
            trainObj.frequency = $("#frequency").val();
            trainObj.firstTrainTimtime = $("#time").val();
            if (!calculatObj.isUpdate) {

                ref.push(trainObj);
            }
            //update firbase data by using selectedkey  
            else if (calculatObj.isUpdate) {
                ref.child(calculatObj.selectedKey).update(trainObj);
                calculatObj.isUpdate = false;
            }
        }
    });

    //get snapshot from firebase  and get  object key  as an  array and store array elements in table  

    var trainData = null;
    ref.on('value', function (snapshot) {
        debugger
        // chack if there is  a snapshot 
        if (typeof Object.keys(snapshot) === 'undefined' || Object.keys(snapshot).length === 0 || snapshot === null) {

            return;
        }
        trainData = snapshot.val();
        //console.log(trainSchedule);
        var keys = Object.keys(trainData);
        //console.log(keys);
        $('#table').find('tbody').empty();
        keys.forEach(element => {

            var row = $("<tr>");
            var updatBtn = $("<button>");
            var removeBtn = $("<button>");
            updatBtn.addClass("update btn-success");
            removeBtn.addClass("remove btn-success ml-2");
            updatBtn.text("Update");
            removeBtn.text("Remove");
            updatBtn.attr("value", element);//give an element(object name) as a value , it will use for update.
            removeBtn.attr("value", element);//give an element(object name) as a value , it will use for remove.
            var col = $("<td>");
            var col2 = $("<td>");
            var col3 = $("<td>");
            var col4 = $("<td>");
            var col5 = $("<td>");
            var col6 = $("<td>");
            // console.log(trainData[element].currentTime);
            calculateWattingTime(trainData[element].firstTrainTimtime, trainData[element].frequency)
            col.text(trainData[element].trainName);
            col2.text(trainData[element].destination);
            col3.text(trainData[element].frequency);
            col4.text(calculatObj.arrivalTime);
            col5.text(calculatObj.waittingTime);
            col6.append(updatBtn, removeBtn);
            row.append(col);
            row.append(col2);
            row.append(col3);
            row.append(col4);
            row.append(col5);
            row.append(col6);
            $("#tbody").prepend(row);
        });


    });
    //calculate watting time and arrival time 
    function calculateWattingTime(time, frq) {


        var a = moment(time, 'hh:mm').minutes();
        var firstTime = moment.unix(a);

        var currentTime = moment();

        minuteDiffernce = currentTime.diff(firstTime, "minutes");
        remainingTime = minuteDiffernce % frq;

        calculatObj.waittingTime = frq - remainingTime;
        calculatObj.arrivalTime = moment().add(calculatObj.waittingTime, "minute").format("hh:mm A");

    }
    //using snapshot  and lode in the form for updat by using selectedkey 
    $(document).on("click", ".update", function () {
        debugger;
        calculatObj.isUpdate = true;
        calculatObj.selectedKey = $(this).val();
        if (trainData === null) {

            return;
        }
        var keys = Object.keys(trainData);
        keys.forEach(element => {

            if (element === calculatObj.selectedKey) {
                $("#train-name").val(trainData[element].trainName);
                $("#dastination").val(trainData[element].destination);

                $("#frequency").val(trainData[element].frequency);

                $("#time").val(trainData[element].firstTrainTimtime);

            }
        });


    })
});
// validate input
function validation() {
   
    var valid = true;
    var newreg = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/;
    var time = $("#time").val();
    if ($("#train-name").val() === "") {
        $("#name-validatin").text("please insert a train name !").css("color", "red")

        valid = false
    }
    else if ($("#dastination").val() === "") {
        $("#dastination-validatin").text("please insert a train destination !").css("color", "red")
        valid = false
    }
    else if ($("#time").val() === "") {
        $("#time-validatin").text("please insert a train start time !").css("color", "red")
        valid = false
    }

    else if (!$("#time").val().match(newreg)) {
        $("#time-validatin").text("Invalid time format , The valid format is hh:mm ").css("color", "red");
        valid = false;
    }
    else if ($("#frequency").val() === "") {
        $("#frequency-validatin").text("please insert a frequency !").css("color", "red")
        valid = false

    }
    return valid;

}
//remove data from firbase 
$(document).on("click", ".remove", function () {
    // debugger;
    var db = firebase.database();

    var ref = db.ref('trainSchedule');

    var key = $(this).val();
    ref.child(key).remove();

})
//clear the input form
$("#clearBtn").on("click", function () {

    $("#train-name").val("");
    $("#dastination").val("");

    $("#frequency").val("");

   $("#time").val("00:00");


});
//remove validation text 
$(".form-control").keyup(function(){
      $("p").text("");


})

