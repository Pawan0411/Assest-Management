

// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyBwsI6D6iVLokXJqymIbgHuoWMX2TDJrlk",
//   authDomain: "assets-management-ee8f8.firebaseapp.com",
//   databaseURL: "https://assets-management-ee8f8.firebaseio.com",
//   projectId: "assets-management-ee8f8",
//   storageBucket: "",
//   messagingSenderId: "1033470144305",
//   appId: "1:1033470144305:web:5fa7afe425957fb9"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);



// var pushkey;

// $('#capaxdetails').submit(function (e) {
//   $(this);
//   e.preventDefault();
//   console.log(document.getElementById('exampleserailNumber').value);
//   var newMessageRef = messagesRef.child(document.getElementById('exampleserailNumber').value).push();

//   pushkey = newMessageRef.key;
//   console.log(pushkey);
//   newMessageRef.set({
//     pushID: pushkey,
//     serialNumber: $('.snumber').val(),
//     sapcode: $('.sapcode').val(),
//     materialcode: $('.materialcode').val(),
//     materialquantity: $('.materialquantity').val(),
//     ponumber: $('.ponumber').val(),
//     podate: $('.podate').val(),
//     invoiceDate: $('.invoicedate').val(),
//     invoiceNumber: $('.invoicenumber').val(),
//     receiveDate: $('.receivedate').val(),
//     model: $('.model').val(),
//     modelDescp: $('.modeldescp').val(),
//     summit: $('.summit').val(),
//   }).then( (result) => {
//     window.alert("Submitted Successfully.")
//     console.log("Submit to Firebase");
//     $('#capaxdetails')[0].reset();
//   })
//   console.warn

//   var messagesRef1 = firebase.database().ref('Capax Details');
//   var newMessageRef = messagesRef1.child(pushkey);
//   newMessageRef.set({
//     a_serialNumber: $('.snumber').val(),
//     sapcode: $('.sapcode').val(),
//     materialcode: $('.materialcode').val(),
//     materialquantity: $('.materialquantity').val(),
//     ponumber: $('.ponumber').val(),
//     podate: $('.podate').val(),
//     invoiceDate: $('.invoicedate').val(),
//     invoiceNumber: $('.invoicenumber').val(),
//     receiveDate: $('.receivedate').val(),
//     model: $('.model').val(),
//     modelDescp: $('.modeldescp').val(),
//     summit: $('.summit').val(),
//   }).then( (result) => {
   
//     console.log("Submit to Firebase");
//     $('#capaxdetails')[0].reset();
//   })
// });
