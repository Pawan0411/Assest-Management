
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

var messagesRef = firebase.database().ref('Capax');
$('#capaxdetails').submit(function (e) {
    $(this);
    e.preventDefault();
    console.log(document.getElementById('exampleserailNumber').value);
    var newMessageRef = messagesRef.child(document.getElementById('exampleserailNumber').value).push();
    newMessageRef.set({
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
    var newMessageRef = messagesRef1.push();
    newMessageRef.set({
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
    console.log("Submit to Firebase");
    $('#capaxdetails')[0].reset();
});