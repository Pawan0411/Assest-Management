var firebaseConfig = {
    apiKey: "AIzaSyAX6nl15R1Vm5ofZi5j3b8_aqdECFKTKi8",
    authDomain: "assets-management-f7361.firebaseapp.com",
    databaseURL: "https://assets-management-f7361.firebaseio.com",
    projectId: "assets-management-f7361",
    storageBucket: "",
    messagingSenderId: "662080556439",
    appId: "1:662080556439:web:8f6c873bee5384e1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var messagesRef1 = firebase.database().ref('Revenue');
var messagesRef2 = firebase.database().ref('Revenue Details');
var pushkey;
$('#revenuedetails').submit(function (e) {
    $(this);
    e.preventDefault();
    console.log(document.getElementById('exampleserailNumber').value);
    var newMessageRef = messagesRef1.child(document.getElementById('exampleserailNumber').value).push();
    pushkey = newMessageRef.key;
    console.log(pushkey);
    newMessageRef.set({
        pushID: pushkey,
        serialNumber: $('.snumber_r').val(),
        sapcode: $('.sapcode_r').val(),
        materialcode: $('.materialcode_r').val(),
        materialquantity: $('.materialquantity_r').val(),
        ponumber: $('.ponumber_r').val(),
        podate: $('.podate_r').val(),
        invoiceDate: $('.invoicedate_r').val(),
        receiveDate: $('.receivedate_r').val(),
        model: $('.model_r').val(),
        modelDescp: $('.modeldescp_r').val(),
    }).then( (result) => {
        window.alert("Submitted Successfully.")
        console.log("Submit to Firebase");
        $('#revenuedetails')[0].reset();
    })
    var newMessageRef = messagesRef2.child(pushkey);
    newMessageRef.set({
        a_serialNumber: $('.snumber_r').val(),
        sapcode: $('.sapcode_r').val(),
        materialcode: $('.materialcode_r').val(),
        materialquantity: $('.materialquantity_r').val(),
        ponumber: $('.ponumber_r').val(),
        podate: $('.podate_r').val(),
        invoiceDate: $('.invoicedate_r').val(),
        receiveDate: $('.receivedate_r').val(),
        model: $('.model_r').val(),
        modelDescp: $('.modeldescp_r').val(),
    }).then( (result) => {
       
        console.log("Submit to Firebase");
        $('#revenuedetails')[0].reset();
    })
   
});