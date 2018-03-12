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
    console.log(ref);

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
    
    displayInTable();
    $("#addBtn").on("click", function () {
       
       debugger
       trainObj.trainName = $("#train-name").val();
        trainObj.destination = $("#dastination").val();
        if($("#frequency").val()!==""){
        trainObj.frequency = $("#frequency").val();
        }
      
        trainObj.firstTrainTimtime=$("#time").val();
 
        calculateWattingTime(trainObj.firstTrainTimtime,trainObj.frequency);
   
       if(!trainObj.isUpdate){
        
        ref.push(trainObj);
    }
    else if(trainObj.isUpdate){
debugger
        // var updateRef = db.ref;
          ref.child(trainObj.selectedKey).update(trainObj);
          console.log(ref.child(trainObj.selectedKey));
          trainObj.isUpdate=false;
    }
        //displayInTable();
        // console.log(trainObj.time);
       // console.log();
    });
    
    
    function displayInTable(){
        // debugger;
        ref.on('value', function (data) {

             // chack if there is  an array 
            if (typeof Object.keys(data) === 'undefined' ||  Object.keys(data).length === 0 || data === null ) {
               
                return;
            }
            
            var trainSchedule = data.val();
            // if(trainSchedule!==null || trainSchedule!==undefined);
            // {
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
                updatBtn.attr("value",element);
                removeBtn.attr("value",element);
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
    
         function convertMintsToHrs(minutes) {
            //  debugger
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
            debugger;
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
            console.log(trainObj);
        }
        // accepts hh:mm
        function changeToMin(time){
             let timeSplit = time.split(':');
             let hours = parseInt(timeSplit[0]);
             let minutes = parseInt(timeSplit[1]); 
               return (hours*60) + minutes;
        }
        $(document).on("click",".update",function(){
          debugger
          trainObj.isUpdate=true;
           trainObj.selectedKey=$(this).val();
          ref.on('value', function (data) {

            
            if (typeof Object.keys(data) === 'undefined' ||  Object.keys(data).length === 0 || data === null ) {
               
                console.log("am here");
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
    $(document).on("click",".remove",function(){
        debugger;
        var key =$(this).val();
        ref.child(key).remove();

    })
})
