var fs = require('fs');
var mkdirp = require('mkdirp');
var dat_c;
var dat_r;
var newDate = new Date();

fs.exists('/data', function(exists){
  console.log(exists);
  if (!exists){
     mkdirp('/data', function (err){
          console.log(err);
      })
  }
})
var messagesRef = firebase.database().ref('Revenue Details');
messagesRef.on("value", function (data) {
    dat_r = JSON.stringify(data);
    console.log(dat_r);
    fs.writeFile('data/Output-rev' + newDate.getDate().toString() + "-" +
        (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
        dat_r, (err) => {
            if (err) throw err;
        })

});
var messagesRef = firebase.database().ref('Capax Details');
messagesRef.on("value", function (data) {
    dat_c = JSON.stringify(data);
    console.log(dat_c);
    fs.writeFile('data/Output-cap' + newDate.getDate().toString() + "-" +
        (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
        dat_c, (err) => {
            if (err) throw err;
        })

});

var code = document.getElementById('inputPassword').value = "";
const firebaseConfig = {
  apiKey: "AIzaSyDMXaX8AR8MKDoZohHewzphFERUEubVm0Y",
  authDomain: "assests-managment.firebaseapp.com",
  databaseURL: "https://assests-managment.firebaseio.com",
  projectId: "assests-managment",
  storageBucket: "assests-managment.appspot.com",
  messagingSenderId: "429074630365",
  appId: "1:429074630365:web:62f74225288877aa"
};

firebase.initializeApp(firebaseConfig);
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': function (response) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
   // onSignInSubmit();
    console.log(response)
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


