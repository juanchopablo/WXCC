/* Supporting JS file with vars, constants and functions that support multiple features on the WxCC Branded Demo website
  
   Created By:
     Rue Green
     ruegreen@cisco.com
     Cisco Systems, INC.
     January 2023
   
*/

//GlobalConstants

//This is your voice WxCC IVR phone number
const ivrPhoneNumber = "1-657-356-0030";

//This is the URL for starting a SMS conversations with WxConnect
const sendSMSWelcomeWebhook =
  "https://hooks.us.webexconnect.io/events/HMFY31RLK8";

//This is the URL for requesting and callback, the WxConnect Script runs a HTTP POST to initial a call back request.
const sendCallbackWebhook = "https://hooks.us.webexconnect.io/events/VUJ29SNRXU"

//If you are going to inject JDS events from this web page you will need to provide you ds SAS key.  IT must have read/write access to your JDS Tenant.
//The Web page will inject an event each time you visit or refresh the page, see the onWindowLoad function and uncomment the function call to inject the "page visit" JDS event
//

//Put your user name, their email address and phone number here, hard coded for JDS events etc.
const firstName = "Carolina";
const lastName = "Morales";
const phone = "+17863738922";
const email = "carolmor@cisco.com";
const CHJDSProjectID = "64d56c2e0ce5bf12334b3c89";
const tokenServicePassphrase = "password";
const tokenServiceURL =
  "https://us-central1-tts-wxcc-carolmor.cloudfunctions.net/token-service?name=sample";
// const demoToolboxUserId = "Put in you demo tool box User Id"  //This is used to send emails via SMTP relay off our toolbox server.  See Send Email function below

// Get the modal for the contact us
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function openEmailForm() {
  closeSMSForm();
  closeCallForm();
  closeJourneyForm();
  closeCallbackForm();
  document.getElementById("emailForm").style.display = "block";
}

function closeEmailForm() {
  document.getElementById("emailForm").style.display = "none";
}
function openSMSForm() {
  closeEmailForm();
  closeCallForm();
  closeJourneyForm();
  closeCallbackForm();
  document.getElementById("smsForm").style.display = "block";
}

function closeSMSForm() {
  document.getElementById("smsForm").style.display = "none";
}
function openCallForm() {
  closeSMSForm();
  closeEmailForm();
  closeJourneyForm();
  closeCallbackForm();
  document.getElementById("callForm").style.display = "block";
}

function closeCallForm() {
  document.getElementById("callForm").style.display = "none";
}
function openCallbackForm() {
  closeSMSForm();
  closeEmailForm();
  closeJourneyForm();
  closeCallForm();
  document.getElementById("callbackForm").style.display = "block";
}

function closeCallbackForm() {
  document.getElementById("callbackForm").style.display = "none";
}
function openJourneyForm() {
  closeEmailForm();
  closeCallForm();
  closeSMSForm();
  closeCallbackForm();
  document.getElementById("journeyForm").style.display = "block";
}

function closeJourneyForm() {
  document.getElementById("journeyForm").style.display = "none";
}

function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Format phone to +E164
function formatPhoneNumber(phoneNumber) {
  const phoneNumberString = phoneNumber.toString();
  const match = phoneNumberString.match(/[1]?(\d{3})(\d{3})(\d{4})$/);
  return `+1(${match[1]})${match[2]}-${match[3]}`;
}

// Gets the callback delay from the callback modal
function getCallbackDelay() {
  const immediateCallback = document.getElementById("immediateCallback");
  const delayCallbackMinutes = document.getElementById("delayCallbackMinutes");

  if (immediateCallback.checked) {
    return 0;
  } else {
    return delayCallbackMinutes.value * 60;
  }
}

console.log("✅ script.js cargado");

window.addEventListener('load', function () {
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("myBtn");
  const span = document.getElementsByClassName("close")[0];

  if (!modal || !btn || !span) {
    console.warn("⚠️ Elementos no encontrados:", { modal, btn, span });
    return;
  }

  console.log("✅ Modal, botón y cierre encontrados");

  btn.onclick = function () {
    console.log("🟢 Se hizo clic en el botón");
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});

// window.addEventListener('load', onLoadWindow);

   const sendCallback = async () => {
      const delay = getCallbackDelay();
      const response = await fetch(sendCallbackWebhook, {
          method: 'POST',
          body:JSON.stringify( 
          {
            name: document.getElementById('callbackName').value,
            number: document.getElementById('callbackNumber').value,
            department: document.getElementById('callbackDepartment').value,
            reason: document.getElementById('callbackReason').value,
            delay: delay,
          }), // string or object
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const myJson = await response.json(); //extract JSON from the http response
        console.log('Callback Status Code:', response.status);
        console.log('callback Response Data:', myJson);

        alert("We will call you at " + formatPhoneNumber(document.getElementById('callbackNumber').value));
        closeCallbackForm();
      }

   
const writeVisitPageEventJDS = async () => {
  var num = Date.now();
  //Lets get out Access Token from the Token Service
  const tokenResponse = await fetch(tokenServiceURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token-passphrase": tokenServicePassphrase,
    },
  });
  const tokenJson = await tokenResponse.json(); //extract JSON from the http response
  console.log(tokenJson);
  var accessToken = tokenJson.token;

  const response = await fetch(
    "https://api-jds.wxdap-produs1.webex.com/publish/v1/api/event?workspaceId=" +
      CHJDSProjectID,
    {
      method: "POST",
      body: JSON.stringify({
        id: createUUID(),
        previously: "12345",
        specversion: "1.0",
        type: "task:new",
        source: "website",
        identity: email,
        identitytype: "email",
        datacontenttype: "application/json",
        data: {
          taskId: createUUID(),
          origin: "Website",
          subTitle: "Servicios de expertos",
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          url: "http://www.cumulus.com",
          channelType: "Page Visit",
        },
      }), // string or object
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson);
};

const injectCustomJDS = async () => {
  var num = Date.now();
  //Lets get out Access Token from the Token Service
  const tokenResponse = await fetch(tokenServiceURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token-passphrase": tokenServicePassphrase,
    },
  });
  const tokenJson = await tokenResponse.json(); //extract JSON from the http response
  console.log(tokenJson);
  var accessToken = tokenJson.token;

  const response = await fetch(
    "https://api-jds.wxdap-produs1.webex.com/publish/v1/api/event?workspaceId=" +
      CHJDSProjectID,
    {
      method: "POST",
      body: JSON.stringify({
        id: createUUID(),
        previously: "12345",
        specversion: "1.0",
        type: "task:new",
        source: document.getElementById("source").value,
        identity: document.getElementById("identity").value,
        identitytype: document.getElementById("identitytype").value,
        datacontenttype: "application/json",
        data: {
          taskId: createUUID(),
          origin: document.getElementById("origin").value,
          firstName: firstName,
          lastName: lastName,
          email: email,
          channelType: document.getElementById("channel").value,
        },
      }), // string or object
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson);
  alert("Injected Custom Event into JDS!");
};
const injectPasswordLockoutJDS = async () => {
  var num = Date.now();
  //Lets get out Access Token from the Token Service
  const tokenResponse = await fetch(tokenServiceURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token-passphrase": tokenServicePassphrase,
    },
  });
  const tokenJson = await tokenResponse.json(); //extract JSON from the http response
  console.log(tokenJson);
  var accessToken = tokenJson.token;

  const response = await fetch(
    "https://api-jds.wxdap-produs1.webex.com/publish/v1/api/event?workspaceId=" +
      CHJDSProjectID,
    {
      method: "POST",
      body: JSON.stringify({
        id: createUUID(),
        previously: "12345",
        specversion: "1.0",
        type: "task:new",
        source: "Website",
        identity: phone,
        identitytype: "phone",
        datacontenttype: "application/json",
        data: {
          taskId: createUUID(),
          origin: "Website",
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          channelType: "Password Lockout",
        },
      }), // string or object
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson);
  alert("Injected Password Lockout Event into JDS!");
};

const injectFormFilledJDS = async () => {
  var num = Date.now();
  //Lets get out Access Token from the Token Service
  const tokenResponse = await fetch(tokenServiceURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token-passphrase": tokenServicePassphrase,
    },
  });
  const tokenJson = await tokenResponse.json(); //extract JSON from the http response
  console.log(tokenJson);
  var accessToken = tokenJson.token;

  const response = await fetch(
    "https://api-jds.wxdap-produs1.webex.com/publish/v1/api/event?workspaceId=" +
      CHJDSProjectID,
    {
      method: "POST",
      body: JSON.stringify({
        id: createUUID(),
        previously: "12345",
        specversion: "1.0",
        type: "task:new",
        source: "Website",
        identity: phone,
        identitytype: "phone",
        datacontenttype: "application/json",
        data: {
          taskId: createUUID(),
          origin: "Website",
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          channelType: "Form Filled",
        },
      }), // string or object
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson);
  alert("Injected Form Filled Event into JDS!");
};

const injectSystemOutageJDS = async () => {
  var num = Date.now();
  //Lets get out Access Token from the Token Service
  const tokenResponse = await fetch(tokenServiceURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token-passphrase": tokenServicePassphrase,
    },
  });
  const tokenJson = await tokenResponse.json(); //extract JSON from the http response
  console.log(tokenJson);
  var accessToken = tokenJson.token;

  const response = await fetch(
    "https://api-jds.wxdap-produs1.webex.com/publish/v1/api/event?workspaceId=" +
      CHJDSProjectID,
    
    {
      method: "POST",
      body: JSON.stringify({
        id: createUUID(),
        previously: "12345",
        specversion: "1.0",
        type: "task:new",
        source: "Operations",
        identity: phone,
        identitytype: "phone",
        datacontenttype: "application/json",
        data: {
          taskId: createUUID(),
          origin: "Operations",
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          channelType: "System Outage",
        },
      }), // string or object
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const myJson = await response.json(); //extract JSON from the http response
  console.log(myJson);
  alert("Injected System Outage Event into JDS!");
};

const sendEmail = async () => {
  const response = await fetch("https://mm-brand.cxdemo.net/api/v1/email", {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("from").value,
      subject: document.getElementById("subject").value,
      body: document.getElementById("body").value,
      session: "custom",
      datacenter: "webex",
      userId: "9101",
      demo: "webex-custom",
      isUpstream: false,
      isInstantDemo: true,
      isSfdc: false,
    }), // string or object
    headers: {
      "Content-Type": "application/json",
    },
  });
  const myJson = await response.json(); //extract JSON from the http response
  //console.log(myJson);
  alert("Gracias su Email fue enviado");
  closeEmailForm();
};

const sendSMS = async () => {
  const response = await fetch(sendSMSWelcomeWebhook, {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("smsname").value,
      number: document.getElementById("sms").value,
      balance: "$100",
      link: "http://www.google.com",
      WelcomeMessage: "Este es el link para sus opciones",
    }), // string or object
    headers: {
      "Content-Type": "application/json",
    },
  });
  const myJson = await response.json(); //extract JSON from the http response

  //console.log(myJson);
  alert(
    "Verifica tu número de móvil para una conversación por SMS" +
      document.getElementById("sms").value
  );
  closeSMSForm();
};

const includeHTML = () => {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("/contact.html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
            if (file === "contact.html") {
  setTimeout(() => {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const span = document.getElementsByClassName("close")[0];

    if (btn && modal && span) {
      btn.onclick = function () {
        modal.style.display = "block";
      };

      span.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    }
  }, 50);
}
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("/contact.html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
};
window.addEventListener('load', function () {
  const url = 'https://hooks.us.webexconnect.io/events/UJUF0JE86Z'; // ← Reemplaza con tu webhook real

  const data = {
    page: window.location.href,
    browser: getBrowserName(),
    time: new Date().toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).catch(err => console.error('Error sending webhook:', err));
});

function getBrowserName() {
  const ua = navigator.userAgent;

  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';

  return 'Unknown';
};

// This is a single line JS comment
/*
This is a comment that can span multiple lines 
- use comments to make your own notes!
*/
