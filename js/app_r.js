var firebaseConfig = {
    apiKey: "AIzaSyDHPQABwRgvKJN8MvhYcRZm0JxPd5bkFJY",
    authDomain: "assets-management-63d76.firebaseapp.com",
    databaseURL: "https://assets-management-63d76.firebaseio.com",
    projectId: "assets-management-63d76",
    storageBucket: "",
    messagingSenderId: "756678919331",
    appId: "1:756678919331:web:5842f2ddd98ada44"
  };
  // Initialize Firebase
 

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