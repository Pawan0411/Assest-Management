

var code = document.getElementById('inputPassword').value = "";
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAX6nl15R1Vm5ofZi5j3b8_aqdECFKTKi8",
    authDomain: "assets-management-f7361.firebaseapp.com",
    databaseURL: "https://assets-management-f7361.firebaseio.com",
    projectId: "assets-management-f7361",
    storageBucket: "",
    messagingSenderId: "662080556439",
    appId: "1:662080556439:web:8f6c873bee5384e1"
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

