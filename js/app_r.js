var firebaseConfig = {
    apiKey: "AIzaSyBwsI6D6iVLokXJqymIbgHuoWMX2TDJrlk",
    authDomain: "assets-management-ee8f8.firebaseapp.com",
    databaseURL: "https://assets-management-ee8f8.firebaseio.com",
    projectId: "assets-management-ee8f8",
    storageBucket: "",
    messagingSenderId: "1033470144305",
    appId: "1:1033470144305:web:5fa7afe425957fb9"
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