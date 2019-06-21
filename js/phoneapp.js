

var code = document.getElementById('inputPassword').value = "";
  // Your web app's Firebase configuration
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
  
  

console.log(firebase.auth);
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': function(response) {
    console.log(response)
  }
});

var phoneNumber = '+918462935367';
var appVerifier = window.recaptchaVerifier;

firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
  .then(function (confirmationResult) {
    window.confirmationResult = confirmationResult;
    window.alert('Code Sent')
    console.log('Code Sent')
    document.getElementById('resend').disabled = false;
    document.getElementById('resend').onclick = function(){
      window.location.reload();
    }
    console.log(confirmationResult);
    document.getElementById('sign-in-button').onclick = function () {
     code = document.getElementById('inputPassword').value;
      confirmationResult.confirm(code).then(function (result) {
        console.log(result);
        document.getElementById('welcome').style.visibility = "visible";
        document.getElementById('nav-bar').style.visibility = "visible";
        document.getElementById('cardetails').style.visibility  = "hidden";
      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        console.log(error);
        window.alert(error);
      });
    }
  }).catch(function (error) {
    // Error; SMS not sent
    console.log(error)
  
  });

