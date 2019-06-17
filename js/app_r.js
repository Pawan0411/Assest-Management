
const firebaseConfig = {
    apiKey: "AIzaSyDMXaX8AR8MKDoZohHewzphFERUEubVm0Y",
    authDomain: "assests-managment.firebaseapp.com",
    databaseURL: "https://assests-managment.firebaseio.com",
    projectId: "assests-managment",
    storageBucket: "assests-managment.appspot.com",
    messagingSenderId: "429074630365",
    appId: "1:429074630365:web:62f74225288877aa"
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
    });

    console.log("Submit to Firebase")
    // $('.success-message').show();
    window.alert("Submitted Successfully.")
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
    });
    console.log("Submit to Firebase")
    $('#revenuedetails')[0].reset();
});