

var code = document.getElementById('inputPassword').value = "";
  // Your web app's Firebase configuration
  var firebaseConfig = {
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


console.log(firebase.auth);
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': function(response) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    //onSignInSubmit();
  }
});

var phoneNumber = '+918462935367';
var appVerifier = window.recaptchaVerifier;

firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
  .then(function (confirmationResult) {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    window.confirmationResult = confirmationResult;
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
      // var credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      // firebase.auth().signInWithCredential(credential);
    }
  }).catch(function (error) {
    // Error; SMS not sent
    console.log(error)
  
  });

