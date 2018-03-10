$(document).ready(function(){
    var trainObj={
        trainName:null, 
        destination:null,
        time:null,
        frequency:0,
        minitAway:0,
    }

$("#addBtn").on("click",function(){
    debugger
    trainObj.trainName=$("#train-name").val();
    trainObj.destination=$("#dastination").val();
    trainObj.time=$("#time").val();
    trainObj.frequency=$("#frequency").val();
     trainObj.minitAway=trainObj.time-trainObj.frequency;
    var row=$("<tr>");
    var col=$("<td>");
    var col2=$("<td>");
    var col3=$("<td>");
    var col4=$("<td>");
    var col5=$("<td>");
    col.text(trainObj.trainName);
    col2.text(trainObj.destination);
    col3.text(trainObj.frequency);
    col4.text(trainObj.time);
    col5.text(trainObj.minitAway);
      row.append(col);
      row.append(col2);
      row.append(col3);
      row.append(col4);
      row.append(col5);
      $("#tbody").append(row);
    // console.log(trainName);
    // console.log(destination);
    // console.log(time);
    // console.log(frequency);
})
});