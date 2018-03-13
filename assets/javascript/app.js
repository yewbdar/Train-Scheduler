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
    var providerGoogle = new firebase.auth.GoogleAuthProvider();
    var providerGithub = new firebase.auth.GithubAuthProvider();
    //console.log(ref);

    var trainObj = {
        trainName: null,
        destination: null,
        firstTrainTimtime: null,
        frequency: 0,
        waittingTime:0,
        arrivalTime:0,
        isUpdate:false,
        selectedKey:null,
    };
    firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
      firebase.auth().signInWithPopup(providerGithub).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    
    displayInTable();
    //accept all user data and run calculteWattingTime function to get watting time ,
    //and add object to firbase if rainObj.isUpdate is flase or update object to firbase if rainObj.isUpdate is true.
    $("#addBtn").on("click", function () {
        
       trainObj.trainName = $("#train-name").val();
        trainObj.destination = $("#dastination").val();
        trainObj.frequency = $("#frequency").val();
        trainObj.firstTrainTimtime=$("#time").val();
 
        calculateWattingTime(trainObj.firstTrainTimtime,trainObj.frequency);
   //add new data in firbase 
       if(!trainObj.isUpdate){
        
        ref.push(trainObj);
    }
    //update firbase data by using selectedkey  
    else if(trainObj.isUpdate){ 
          ref.child(trainObj.selectedKey).update(trainObj);
          trainObj.isUpdate=false;
    }
        
    });
    
    //get data from firebase as an object and change it to array and store array elements in table  
    function displayInTable(){
        
        ref.on('value', function (data) {
            
             // chack if there is  a data 
            if (typeof Object.keys(data) === 'undefined' ||  Object.keys(data).length === 0 || data === null ) {
               
                return;
            }
            var trainSchedule = data.val();
            //console.log(trainSchedule);
            var keys = Object.keys(trainSchedule);
            //console.log(keys);
            $('#table').find('tbody').empty();
            keys.forEach(element => {

                var row = $("<tr>");
                var updatBtn=$("<button>");
                var removeBtn=$("<button>");
                updatBtn.addClass("update btn-success");
                removeBtn.addClass("remove btn-success ml-2");
                updatBtn.text("Update");
                removeBtn.text("Remove");
                updatBtn.attr("value",element);//give an element(object name) as a value , it will use for update.
                removeBtn.attr("value",element);//give an element(object name) as a value , it will use for remove.
                var col = $("<td>");
                var col2 = $("<td>");
                var col3 = $("<td>");
                var col4 = $("<td>");
                var col5 = $("<td>");
                var col6 = $("<td>");
                
                col.text(trainSchedule[element].trainName);
                col2.text(trainSchedule[element].destination);
                col3.text(trainSchedule[element].frequency);
                col4.text(trainSchedule[element].arrivalTime);
                col5.text(trainSchedule[element].waittingTime);
                col6.append(updatBtn,removeBtn);
                row.append(col);
                row.append(col2);
                row.append(col3);
                row.append(col4);
                row.append(col5);
                row.append(col6);
                $("#tbody").prepend(row);
            });
           
        // }
        });
        
    }
        //accepts minutes and change to hours
         function convertMintsToHrs(minutes) {
           
            var h = Math.floor(minutes / 60);
            var m = minutes % 60;
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            return (h > 12) ? h-12+":"+m+" P.M." : h+":"+m+" A.M.";
       
          }
        function calculateWattingTime(time,frq){
           
            var date=new Date()
            let currentTime=changeToMin(date.getHours() + ":" + date.getMinutes());

            let startTime = changeToMin(time);
           // debugger;
            let arrivalTime=0;
            
            let y = (currentTime - startTime) % frq;
            
            if(y===0){
                trainObj.waittingTime=0;
                trainObj.arrivalTime=currentTime;
            } else{
                y =Math.floor ( (currentTime - startTime) /  frq ) + 1;
                trainObj.waittingTime =((y*frq)+startTime) - currentTime;
                trainObj.arrivalTime= (y*frq + startTime);
                trainObj.arrivalTime=convertMintsToHrs(trainObj.arrivalTime) 
            }
           
        }
        // accepts hours (hh:mm) and change it to minutes
        function changeToMin(time){
             let timeSplit = time.split(':');
             let hours = parseInt(timeSplit[0]);
             let minutes = parseInt(timeSplit[1]); 
               return (hours*60) + minutes;
        }
        //get data from firbase and lode in the form by using selectedkey 
        $(document).on("click",".update",function(){
          
          trainObj.isUpdate=true;
           trainObj.selectedKey=$(this).val();//get updated element(object name) form button value
          ref.on('value', function (data) {
            //chack if there is  a data 
            if (typeof Object.keys(data) === 'undefined' ||  Object.keys(data).length === 0 || data === null ) {
               
                return;
            }
            var trainSchedule=data.val();
            var keys=Object.keys(trainSchedule);
             keys.forEach(element => {

                if(element === trainObj.selectedKey){
                    $("#train-name").val(trainSchedule[element].trainName);
                    $("#dastination").val(trainSchedule[element].destination);
                    
                  $("#frequency").val(trainSchedule[element].frequency);
                    
                  $("#time").val(trainSchedule[element].firstTrainTimtime);

                }
            });

        
        })   
    });
    //remove data from firbase .
    $(document).on("click",".remove",function(){
       // debugger;
        var key =$(this).val();
        ref.child(key).remove();

    })
})
