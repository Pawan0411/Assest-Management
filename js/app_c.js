
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
var pushkey;
var messagesRef = firebase.database().ref('Capax');
$('#capaxdetails').submit(function (e) {
    $(this);
    e.preventDefault();
    console.log(document.getElementById('exampleserailNumber').value);
    var newMessageRef = messagesRef.child(document.getElementById('exampleserailNumber').value).push();
    pushkey = newMessageRef.key;
    console.log(pushkey);
    newMessageRef.set({
        pushID: pushkey,
        serialNumber: $('.snumber').val(),
        sapcode: $('.sapcode').val(),
        materialcode: $('.materialcode').val(),
        materialquantity: $('.materialquantity').val(),
        ponumber: $('.ponumber').val(),
        podate: $('.podate').val(),
        invoiceDate: $('.invoicedate').val(),
        invoiceNumber: $('.invoicenumber').val(),
        receiveDate: $('.receivedate').val(),
        model: $('.model').val(),
        modelDescp: $('.modeldescp').val(),
        summit: $('.summit').val(),
    });
    // $('.success-message').show();
    window.alert("Submitted Successfully.")
    console.log("Submit to Firebase");
    var messagesRef1 = firebase.database().ref('Capax Details');
    var newMessageRef = messagesRef1.child(pushkey);
    newMessageRef.set({
        a_serialNumber: $('.snumber').val(),
        sapcode: $('.sapcode').val(),
        materialcode: $('.materialcode').val(),
        materialquantity: $('.materialquantity').val(),
        ponumber: $('.ponumber').val(),
        podate: $('.podate').val(),
        invoiceDate: $('.invoicedate').val(),
        invoiceNumber: $('.invoicenumber').val(),
        receiveDate: $('.receivedate').val(),
        model: $('.model').val(),
        modelDescp: $('.modeldescp').val(),
        summit: $('.summit').val(),
    });
    console.log("Submit to Firebase");
    $('#capaxdetails')[0].reset();
});