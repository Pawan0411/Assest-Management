

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAX6nl15R1Vm5ofZi5j3b8_aqdECFKTKi8",
  authDomain: "assets-management-f7361.firebaseapp.com",
  databaseURL: "https://assets-management.firebaseio.com",
  projectId: "assets-management-f7361",
  storageBucket: "",
  messagingSenderId: "662080556439",
  appId: "1:662080556439:web:8f6c873bee5384e1"
};
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
  }).then( (result) => {
    window.alert("Submitted Successfully.")
    console.log("Submit to Firebase");
    $('#capaxdetails')[0].reset();
  }).catch(error => {
    window.alert('Not Submitted');
  })

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
  }).then( (result) => {
    window.alert("Submitted Successfully.")
    console.log("Submit to Firebase");
    $('#capaxdetails')[0].reset();
  })
});