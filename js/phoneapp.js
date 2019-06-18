
var code = document.getElementById('inputPassword').value = "";
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
firebase.initializeApp(firebaseConfig);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': function (response) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
   //onSignInSubmit();
    console.log(response)
  }
});
var phoneNumber = '+919131341690';
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


