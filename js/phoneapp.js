
function getUiConfig() {
    return {
      'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
          handleSignedInUser(user);
          // Do not redirect.
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'popup',
      'signInOptions': [
        // The Provider you need for your app. We need the Phone Auth
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          defaultCountry: 'IN',
         
        }
      ],
      // Terms of service url.
    };
  }

  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  
  /**
   * Displays the UI for a signed in user.
   * @param {!firebase.User} user
   */
  var handleSignedInUser = function(user) {
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    window.unload = function () {
      return firebase.auth().signOut();;
  };
  };
  
  
  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });
  
  var initApp = function() {
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
      });
      
  };
 
  window.addEventListener('load', initApp);