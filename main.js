const FormExtension = {
  name: "Forms",
  type: "response",
  match: ({ trace }) =>
    trace.type === "ext_form" || trace.payload.name === "ext_form",
  render: ({ trace, element }) => {
    const formContainer = document.createElement("form");
    formContainer.innerHTML = `
        <style>
        ._1ddzqsn7{
        width: 100%;
        }
            form {
                background: #f0f7ff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                width: 100%;
                max-width: 350px;
                margin: 10px auto;
                font-family: Arial, sans-serif;
                border: 2px solid #2e6ee1;
            }
            form h2 {
                margin: 0 0 15px 0;
                font-size: 1.5rem;
                color: #2e6ee1;
                text-align: center;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 0.9rem;
                color: #2c3e50;
                font-weight: bold;
            }
            .required-asterisk {
                color: #d9534f; /* Light red color */
                margin-left: 2px;
                font-size: 1.1rem;
            }
            input[type="text"],
            input[type="email"],
            input[type="tel"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                outline: none;
                font-size: 0.9rem;
                box-sizing: border-box;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            input[type="text"]:focus,
            input[type="email"]:focus,
            input[type="tel"]:focus {
                border-color: #2e6ee1;
                box-shadow: 0 0 5px rgba(46, 110, 225, 0.5);
            }
            input[type="submit"] {
                background: #2e6ee1;
                border: none;
                color: white;
                padding: 10px 0;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: background 0.3s;
                text-transform: uppercase;
            }
            input[type="submit"]:hover {
                background: #1c56c0;
            }
            input[type="submit"]:disabled {
                background: #cccccc;
                cursor: not-allowed;
            }
            .invalid {
                border-color: #ffcccb !important; /* Light red border */
                background-color: #fff7f7; /* Light red background */
            }
            .error-message {
                color: #d9534f; /* Light red color */
                font-size: 0.8rem;
                margin-top: -10px;
                margin-bottom: 10px;
            }
            @media (max-width: 768px) {
                form {
                    padding: 15px;
                }
                input[type="text"], input[type="email"], input[type="tel"] {
                    padding: 8px;
                }
                input[type="submit"] {
                    padding: 10px 0;
                }
            }

        .checkbox-container {
            display: inline-flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .checkbox-container input[type="checkbox"] {
            margin-right: 10px;
        }
        .checkbox-container label {
            font-size: 0.9rem;
            color: #2c3e50;
            cursor: pointer;
        } 
        </style>
        <label for="first-name">First Name <span class="required-asterisk">*</span></label>
        <input type="text" id="first-name" class="firstname" name="firstname" placeholder="Enter First Name" required>
        <div class="error-message first-name-error"></div>

        <label for="last-name">Last Name <span class="required-asterisk">*</span></label>
        <input type="text" id="last-name" class="lastname" name="lastname" placeholder="Enter Last Name" required>
        <div class="error-message last-name-error"></div>

        <label for="email">Email <span class="required-asterisk">*</span></label>
        <input type="email" id="email" class="email" name="email" placeholder="Enter your email" required>
        <div class="error-message email-error"></div>

        <label for="phone">Phone Number <span class="required-asterisk">*</span></label>
        <input type="tel" id="phone" class="phone" name="phone" placeholder="Enter your phone number" required>
        <div class="error-message phone-error"></div>

        <div class="checkbox-container">
            <input type="checkbox" id="email-promotion" class="email-promotion" name="email-promotion">
            <label for="email-promotion">Unlock updates on phone and email promos!</label>
        </div>

        <input type="submit" class="submit" value="Submit" disabled>
    `;
    const freshchat_conversation_id_for_db = window.sessionStorage.getItem(
      "freshchat_conversation_id"
    );

    const firstNameInput = formContainer.querySelector(".firstname");
    const lastNameInput = formContainer.querySelector(".lastname");
    const emailInput = formContainer.querySelector(".email");
    const phoneInput = formContainer.querySelector(".phone");
    const submitButton = formContainer.querySelector(".submit");

    const firstNameError = formContainer.querySelector(".first-name-error");
    const lastNameError = formContainer.querySelector(".last-name-error");
    const emailError = formContainer.querySelector(".email-error");
    const phoneError = formContainer.querySelector(".phone-error");
    const emailPromotionCheckbox = formContainer.querySelector(".email-promotion");

    // Validation function
    function validateForm() {
      let isValid = true;

      // Validate First Name
      if (!firstNameInput.value.trim()) {
        firstNameError.textContent = "Please enter your first name.";
        firstNameInput.classList.add("invalid");
        isValid = false;
      } else {
        firstNameError.textContent = "";
        firstNameInput.classList.remove("invalid");
      }

      // Validate Last Name
      if (!lastNameInput.value.trim()) {
        lastNameError.textContent = "Please enter your last name.";
        lastNameInput.classList.add("invalid");
        isValid = false;
      } else {
        lastNameError.textContent = "";
        lastNameInput.classList.remove("invalid");
      }

      // Validate Email
      const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.classList.add("invalid");
        isValid = false;
      } else {
        emailError.textContent = "";
        emailInput.classList.remove("invalid");
      }

      // Validate Phone
      const phonePattern = /^[0-9]{10,15}$/;
      if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value)) {
        phoneError.textContent = "Please enter a valid phone number.";
        phoneInput.classList.add("invalid");
        isValid = false;
      } else {
        phoneError.textContent = "";
        phoneInput.classList.remove("invalid");
      }

      // Enable or Disable Submit Button
      submitButton.disabled = !isValid;
    }

    // Add event listeners for validation
    [firstNameInput, lastNameInput, emailInput, phoneInput].forEach((input) => {
      input.addEventListener("input", validateForm);
    });

    // Form submission
    formContainer.addEventListener("submit", function (event) {
      event.preventDefault();

      // Retrieve values on submission
      const FirstName = firstNameInput.value.trim().replace(/\s+/g, "_");
      const LastName = lastNameInput.value.trim().replace(/\s+/g, "_");
      const email = emailInput.value.trim();
      const Phone = phoneInput.value.trim();
      const name = `${FirstName} ${LastName}`;
      const emailPromotion = emailPromotionCheckbox.checked; 

      console.log(FirstName, "First Name");
      console.log(name, "Full Name");

      if (!submitButton.disabled) {
        submitButton.disabled = true;
        fetch("/api/submit-information", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            FirstName,
            LastName,
            email,
            Phone,
            freshchat_conversation_id_for_db,
            feedback_append: "Negative",emailPromotion
          }),
        })
          .then((response) => {
            console.log(response,'responseeeeeeeee');
            if (!response.ok) throw new Error("Webhook failed");
            return response.json();
          })
          .then(() => {
            window.voiceflow.chat.interact({
              type: "complete",
              payload: {
                firstName: FirstName,
                lastName: LastName,
                email: email,
                phone: Phone,
              },
            });
            console.log("Form submitted and Voiceflow notified");
          })
          .catch((error) => console.error("Error:", error));
      }
    });

    element.appendChild(formContainer);
  },
};









let isFormDisplayed = false;
const FormExtension_address = {
name: 'Forms',
type: 'response',
match: ({ trace }) =>
  trace.type === 'ext_form_for_address' || trace.payload.name === 'ext_form_for_address',
render: ({ trace, element }) => {
      if (isFormDisplayed) {
          console.log('Form already displayed, skipping render.');
          return;
        }



        // Mark the form as displayed
        isFormDisplayed = true;
         setTimeout(() => {
            isFormDisplayed = false;
          }, 20000);   
  const formContainer = document.createElement('form');
  formContainer.innerHTML = `
    <style>._1ddzqsn7{
        width: 100%;
        }
      form {
        background: #f0f7ff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 100%;
        max-width: 350px;
        margin: 10px auto;
        font-family: Arial, sans-serif;
        border: 2px solid #2e6ee1;
      }
      form h2 {
        margin: 0 0 15px 0;
        font-size: 1.5rem;
        color: #2e6ee1;
        text-align: center;
        line-height: 25px;

      }
      label {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9rem;
        color: #2c3e50;
        font-weight: bold;
      }
      input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 6px;
        outline: none;
        font-size: 0.9rem;
        box-sizing: border-box;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      input[type="text"]:focus {
        border-color: #2e6ee1;
        box-shadow: 0 0 5px rgba(46, 110, 225, 0.5);
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #fff;
      }
      ul li {
        padding: 10px;
        
        cursor: pointer;
      }
      ul li:hover {
        background: #f0f7ff;
      }

    </style>
    <h3>Find Your Address</h3>
    <label for="address">Address</label>
    <input type="text" class="address" name="address" placeholder="Enter your address" required>
    <ul class="search-results"></ul>
  `;
  const addressInput = formContainer.querySelector('.address');
  const resultsContainer = formContainer.querySelector('.search-results');
  let debounceTimeout;

  // On input change, call the API with debounce
  addressInput.addEventListener('input', (e) => {
    const inputValue = e.target.value.trim();

    // Clear previous results
    resultsContainer.innerHTML = '';
    clearTimeout(debounceTimeout);

    if (inputValue.length > 2) {
      debounceTimeout = setTimeout(() => {
        fetch("https://2lrvf8rt6f.execute-api.ap-southeast-2.amazonaws.com/address", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: inputValue }),
        })
          .then((response) => response.json())
          .then((data) => {
            const results = data?.body || [];
            resultsContainer.innerHTML = ''; // Clear old suggestions

            // Auto-complete the input with the first suggestion if available
            // if (results.length > 0) {
            //   addressInput.value = results[0].name;
            // }

            results.forEach((item) => {
              const li = document.createElement('li');
              li.classList.add('api-address');
              li.dataset.addressId = item.id;
              li.dataset.serviceClass = item.serviceClass;
              li.textContent = `${item.name}${getProviderName(item.id)}`;
              resultsContainer.appendChild(li);
            });

            // Add advanced search option
            const advancedSearchLi = document.createElement('li');
            advancedSearchLi.classList.add('advanced-search');
            advancedSearchLi.innerHTML = "<i>Can't find your address? Try our advanced search</i>";
            resultsContainer.appendChild(advancedSearchLi);
          })
          .catch((error) => console.error('API call failed:', error));
      }, 300); // Debounce delay
    }
  });

  // On address selection
  resultsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('api-address')) {
      const selectedAddress = e.target.textContent;
      const addressId = e.target.dataset.addressId;
      const serviceClass = e.target.dataset.serviceClass;

      // Auto-complete the input field
      addressInput.value = selectedAddress;

      // Clear suggestions
      resultsContainer.innerHTML = '';

      // Enable the submit button


      // Store selected values
      formContainer.dataset.selectedAddress = selectedAddress;
      formContainer.dataset.addressId = addressId;
      formContainer.dataset.serviceClass = serviceClass;

      // Notify Voiceflow of the selection
      const providerResponse = getPlansByProvider(addressId);
      window.voiceflow.chat.interact({
          type: 'message',
          payload: {
            message: `Selected Address: ${selectedAddress}\n${providerResponse}`,
          },
        });
    }
  });

  // On form submission


  element.appendChild(formContainer);

  // Utility function to get provider name based on prefix
  function getProviderName(addressId) {
    const prefix = addressId.substring(0, 2);
    switch (prefix) {
      case 'OP':
        return " - Opticomm";
      case 'LO':
        return " - NBN";
      case 'RT':
        return " - Redtrain";
      case 'VO':
        return " - Velocity";
      case 'SU':
        return " - SUPA";
      default:
        return "";
    }
  }

  // Utility function to determine plans by provider
  function getPlansByProvider(addressId) {
    const prefix = addressId.substring(0, 2);
    switch (prefix) {
      case 'OP':
        return "Recommended Plans of Opticomm with Select your OptiComm plan page Url as hyperlink with saying Congratulations, your address is connected by Opticomm and ready for service and also give url https://occom.com.au/opticomm-fibre-network/";
      case 'LO':
        return "Recommended Plans of NBN with Select your NBN plan page Url as hyperlink  with saying Congratulations, your address is connected by NBN and ready for service and also give url https://occom.com.au/nbn-plans/";
      case 'RT':
        return "Recommended Plans of Redtrain with Select your Redtrain plan page Url as hyperlink  with saying Congratulations, your address is connected by Redtrain and ready for service  and also give url https://occom.com.au/redtrain-fibre/";
      case 'VO':
        return "Recommended Plans of Velocity with Select your Velocity plan page Url as hyperlink  with saying Congratulations, your address is connected by Velocity and ready for service  and also give url https://occom.com.au/telstra-velocity-special-promotion/";
      case 'SU':
        return "Recommended Plans of SUPA with Select your SUPA plan page Url as hyperlink  with saying Congratulations, your address is connected by SUPA and ready for service and also give url https://occom.com.au/supa-networks/";
      default:
        return "Not able to provide plans";
    }
  }
},
};




function updateVoiceflowStateVariables(content, userID) {
  if (!content || !userID) {
    console.error('Missing content or userID');
    return Promise.reject(new Error('Content or userID is missing.'));
  }

  // Make a request to the backend
  return fetch('/api/update-voiceflow-variables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, userID }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Voiceflow state updated successfully:', data);
      return data; // Pass the data forward
    })
    .catch((error) => {
      console.error('Error updating Voiceflow state:', error);
      throw error; // Re-throw the error for the caller to handle
    });
}






function createOrGetSessionId() {
// Check if session_id already exists in sessionStorage
let sessionId = window.sessionStorage.getItem('session_id');

// If not, generate a new one
if (!sessionId) {
  sessionId = generateSessionId(); // Generate a unique session_id
  window.sessionStorage.setItem('session_id', sessionId); // Store it in sessionStorage
  console.log('New session_id created:', sessionId);
  let sessionIdf = window.sessionStorage.getItem('session_id');

  console.log('New session_id checking:', sessionIdf); 
} else {
  console.log('Existing session_id found:', sessionId);
}

return sessionId;
}

// Helper function to generate a unique session_id
function generateSessionId() 
{
return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

// Usage example:

const sessionId = createOrGetSessionId();


console.log('Session ID for current session:', sessionId);



const triggerEvents = async () =>  {
        console.log('Triggering event');
        window.voiceflow.chat.interact({
          type: 'event',
          payload: {
            event: {
              name: 'n8nfreshchat' ,
            }
          }
        });
      }



  const triggerEvents_image = async () =>  {
    console.log('Triggering event');
    window.voiceflow.chat.interact({
      type: 'event',
      payload: {
        event: {
          name: 'image' ,
        }
      }
    });
  }



const fetchConversationId = async (userID) => {
  if (!userID) {
    console.error("Error: Missing userID");
    return null;
  }



  console.log(userID, "Fetching conversation ID...");

  try {
    // Call the backend API that handles the PATCH request
    const response = await fetch("/api/fetch-conversation-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) {
      throw new Error(`Backend API request failed with status ${response.status}`);
    }

    const { freshchatConversationId } = await response.json();

    if (freshchatConversationId) {
      console.log("Freshchat Conversation ID:", freshchatConversationId);

      // Store it globally for use in the session
      window.sessionStorage.setItem("freshchat_conversation_id", freshchatConversationId);

      // Return the ID
      return freshchatConversationId;
    } else {
      throw new Error("freshchatConversationId not found in the backend response.");
    }
  } catch (error) {
    console.error("Error fetching freshchatConversationId:", error.message);
    return null;
  }
};
      

function extractContent(message) {
  if (message.message_parts[0].text) {
    return message.message_parts[0].text.content;
  } else if (message.message_parts[0].image) {
    return message.message_parts[0].image.url;
  } else if (message.message_parts[0].file) {
    return message.message_parts[0].file.url;

  } else {
    return "No content found.";
  }
}


let previousResponse = null; // Variable to store the previous response

function pollApi(sessionId) {




// Retrieve freshchat_conversation_id from sessionStorage

const freshchat_conversation_id = window.sessionStorage.getItem("freshchat_conversation_id");
const sessionId_final = sessionId;



if (!freshchat_conversation_id) {
  console.error("Error: freshchat_conversation_id is not set in sessionStorage.");
  return;
}

// Correctly interpolate the freshchat_conversation_id in the URL using backticks
//const proxyurl= `http://localhost:3002/proxy?conversation_id=${freshchat_conversation_id}`;


//console.log("API URL:", proxyurl); // Verify the interpolated URL

 fetch("/api/proxy", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ conversationId: freshchat_conversation_id }),
})





.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
  .then((data) => {
    const firstMessage = data.messages[0];
    if (
      firstMessage &&
      firstMessage.message_parts &&
      firstMessage.message_parts.length > 0
    ) {
      //const content = firstMessage.message_parts[0]?.text?.content;
      const content = extractContent(firstMessage);
      const actor_type = firstMessage.actor_type;
      const message_type = firstMessage.message_type;

     // console.log('previousres',previousResponse);
      //console.log('content',content);
      //console.log('sessionId_final',sessionId_final);


      if (content && content !== previousResponse && actor_type!== 'user' && actor_type!== 'system' && content!==0 && message_type=='normal') {
        console.log("New Message Content:", content);
        

        // Update the state variable in Voiceflow
        console.log(sessionId_final)
        updateVoiceflowStateVariables(content, sessionId_final)
          .then((response) => console.log("Update successful:", response)).then(triggerEvents())
          .catch((error) => console.error("Update failed:", error));

        // Trigger additional actions
        //triggerEvents();

        // Store the current content as the previous response
        previousResponse = content;
      }
    }
  })
  .catch((error) => console.error("Error:", error));
}



const OTPFormExtension = {

  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
      trace.type === 'ext_form_for_otp' || trace.payload.name === 'ext_form_for_otp',
  render: ({ trace, element }) => {
      const formContainer = document.createElement('form');
      formContainer.innerHTML = `
          <style>._1ddzqsn7{
        width: 100%;
        }
              form {
                  background: #f0f7ff;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  width: 100%;
                  max-width: 350px;
                  margin: 10px auto;
                  font-family: Arial, sans-serif;
                  border: 2px solid #2e6ee1;
              }
              form h2 {
                  margin: 0 0 15px 0;
                  font-size: 1.5rem;
                  color: #2e6ee1;
                  text-align: center;
              }
              label {
                  display: block;
                  margin-bottom: 5px;
                  font-size: 0.9rem;
                  color: #2c3e50;
                  font-weight: bold;
              }

              input[type="otp"]:focus {
                  border-color: #2e6ee1;
                  box-shadow: 0 0 5px rgba(46, 110, 225, 0.5);
              }
              input[type="submit"] {
                  background: #2e6ee1;
                  border: none;
                  color: white;
                  padding: 10px 0;
                  border-radius: 20px;
                  font-size: 1rem;
                  font-weight: bold;
                  cursor: pointer;
                  width: 100%;
                  transition: background 0.3s;
                  text-transform: uppercase;
              }
              input[type="submit"]:hover {
                  background: #1c56c0;
              }
              input[type="submit"]:disabled {
                  background: #cccccc;
                  cursor: not-allowed;
              }
              .invalid {
                  border-color: red !important;
              }
              .error-message {
                  color: red;
                  font-size: 0.8rem;
                  margin-top: -10px;
                  margin-bottom: 10px;
              }
              @media (max-width: 768px) {
                  form {
                      padding: 15px;
                  }
                  input[type="otp"] {
                      padding: 8px;
                  }
                  input[type="submit"] {
                      padding: 10px 0;
                  }
              }
          </style>
         <input type="text" id="otp" class="otp" name="otp" maxlength="6" placeholder="Enter your OTP" required>
          <div class="error-message phone-error"></div>

          <input type="submit" class="submit" value="Submit">
      `;

      const otpInput = formContainer.querySelector('.otp');
      const submitButton = formContainer.querySelector('.submit');
      // Form submission
      formContainer.addEventListener('submit', function (event) {
        
          event.preventDefault();
          window.voiceflow.chat.interact({
                          type: 'complete',
                          payload: {
                              otp: otpInput.value.trim()
                          },
                      });

      });

      element.appendChild(formContainer);
  },
};





function displayFeedbackForm() {
  const freshchat_conversation_id = window.sessionStorage.getItem("freshchat_conversation_id");
  if (!freshchat_conversation_id) {
    console.log("No conversation ID found. Feedback form will not be displayed.");
    return;
  }

  // Inject style into the document if not already added
  if (!document.getElementById("feedback-form-style")) {
    const style = document.createElement("style");
    style.id = "feedback-form-style";
    style.textContent = `
      form {
        background: #f0f7ff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 15px;
        width: 80%;
        max-width: 300px;
        margin: 10px auto;
        font-family: Arial, sans-serif;
        border: 2px solid #2e6ee1;
      }
      form h2 {
        margin: 0 0 10px 0;
        font-size: 1.3rem;
        color: #2e6ee1;
        text-align: center;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9rem;
        color: #2c3e50;
        font-weight: bold;
      }
      textarea {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        outline: none;
        font-size: 0.9rem;
        box-sizing: border-box;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      textarea:focus {
        border-color: #2e6ee1;
        box-shadow: 0 0 5px rgba(46, 110, 225, 0.5);
      }
      input[type="submit"] {
        background: #2e6ee1;
        border: none;
        color: white;
        padding: 8px 0;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        transition: background 0.3s;
        text-transform: uppercase;
      }
      input[type="submit"]:hover {
        background: #1c56c0;
      }
      button {
        margin-top: 10px;
        padding: 8px;
        background: none;
        border: none;
        color: #2e6ee1;
        cursor: pointer;
        text-align: center;
        width: 100%;
      }
      #star-rating {
        margin-bottom: 15px;
        text-align: center;
      }
      #star-rating span {
        cursor: pointer;
        font-size: 30px;
        color: #ccc;
        margin: 0 2px;
      }
      #star-rating span.selected {
        color: #ffcc00;
      }
    `;
    document.head.appendChild(style);
  }

  // Remove any existing modal to avoid duplicates
  const existingModal = document.getElementById("feedback-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create the modal container
  const modal = document.createElement("div");
  modal.id = "feedback-modal";
  modal.style.position = "fixed";
  modal.style.bottom = "80px";
  modal.style.right = "20px";
  modal.style.width = "100%";
  modal.style.maxWidth = "300px";
  modal.style.zIndex = "9999";

  // Add the form content to the modal
  modal.innerHTML = `
    <form>
      <h2>How was your experience?</h2>
      <div id="star-rating">
        ${[1, 2, 3, 4, 5]
          .map(
            (star) => `
          <span data-value="${star}" class="star">☆</span>
        `
          )
          .join("")}
      </div>
      <textarea id="feedback-text" placeholder="Write your feedback here..." rows="3"></textarea>
      <input type="submit" value="Submit" id="submit-feedback" />
      <button type="button" id="cancel-feedback">Cancel</button>
    </form>
  `;

  document.body.appendChild(modal);

  // Reset selected rating and feedback text
  let selectedRating = null;
  const feedbackText = document.getElementById("feedback-text");
  feedbackText.value = "";

  // Handle star rating selection
  document.querySelectorAll("#star-rating span").forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = this.getAttribute("data-value");
      document.querySelectorAll("#star-rating span").forEach((s) => {
        s.classList.remove("selected");
      });
      for (let i = 0; i < selectedRating; i++) {
        document.querySelectorAll("#star-rating span")[i].classList.add("selected");
      }
    });
  });

  // Handle feedback submission
  document.getElementById("submit-feedback").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default form submission
    const feedbackTextValue = feedbackText.value.trim();
    if (!selectedRating) {
      alert("Please select a rating before submitting.");
      return;
    }

    // Send feedback to the API
    fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: feedbackTextValue,
        rating: selectedRating,
        freshchat_conversation_id: freshchat_conversation_id,
        feedback_append: "Positive",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit feedback.");
        }

        // Create and show the thank you popup
        const thankYouBox = document.createElement("div");
        thankYouBox.textContent = "We appreciate your feedback! 🎉 Chat with Omi anytime. 💡";
        thankYouBox.style.position = "fixed";
        thankYouBox.style.bottom = "80px";
        thankYouBox.style.right = "20px";
        thankYouBox.style.width = "80%";
        thankYouBox.style.maxWidth = "300px";
        thankYouBox.style.background = "#f0f7ff";
        thankYouBox.style.borderRadius = "10px";
        thankYouBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        thankYouBox.style.padding = "15px";
        thankYouBox.style.border = "2px solid #2e6ee1";
        thankYouBox.style.fontFamily = "Arial, sans-serif";
        thankYouBox.style.textAlign = "center";
        thankYouBox.style.fontSize = "1rem";
        thankYouBox.style.color = "#2c3e50";
        thankYouBox.style.zIndex = "9999";

        document.body.appendChild(thankYouBox);

        // Remove modal and hide the popup after 5 seconds
        modal.remove();
        setTimeout(() => {
          thankYouBox.remove();
        }, 5000); // 5 seconds
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err);
        alert("Something went wrong. Please try again.");
      });
  });

  // Handle feedback cancellation
  document.getElementById("cancel-feedback").addEventListener("click", () => {
    modal.remove();
  });
}




/////////////////////////////////////////////////////////////////////////////////////////////////

(function (d, t) {
  var v = d.createElement(t),
    s = d.getElementsByTagName(t)[0];

  // Global variable to store the selected file.
  window.uploadedImageFile = null;
  console.log("Initializing custom image upload script...");

  // -------------------------------------------------------------------------
  // Helper: Create a preview image message in the chat.
  // Returns the created <img> element so its source can be updated later.
  // -------------------------------------------------------------------------


  function uploadImage(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file, file.name);
      
      console.log("Uploading image file to backend...");
      fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Upload successful:", data);
          resolve(data);
        })
        .catch((error) => {
          console.error("Upload error:", error);
          reject(error);
        });
    });
  }
 
  // The attachSendListener function intercepts clicks on the send button..
  function attachUploadListener() {

    const isWithinTimeRange = window.sessionStorage.getItem("isWithinTimeRange");
    if (isWithinTimeRange !== "1") {
      return; // Exit the function if isWithinTimeRange is not 1
    }
    const chatElem = document.querySelector("#voiceflow-chat");
    if (chatElem && chatElem.shadowRoot) {
      const sendButtonContainer = chatElem.shadowRoot.querySelector("#vfrc-send-message");
      if (sendButtonContainer && !chatElem.shadowRoot.querySelector(".vfrc-upload-pin")) {
        const pinButton = document.createElement("button");
        pinButton.className = "vfrc-upload-pin";
        pinButton.innerHTML = "📷";
        pinButton.title = "Attach Image";
        pinButton.style.background = "none";
        pinButton.style.border = "none";
        pinButton.style.cursor = "pointer";
        pinButton.style.fontSize = "20px";
        pinButton.style.marginRight = "4px";
        pinButton.style.display = "inline-block";

        pinButton.addEventListener("click", function (e) {
          e.preventDefault();
          console.log("Pin button clicked – opening file selector.");
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";
          fileInput.style.display = "none";
          fileInput.onchange = function (event) {
            const file = event.target.files[0];
            if (file) {
              console.log("File selected:", file);
              window.uploadedImageFile = file;

              uploadImage(file).then((data) => {
                if (data.upload.url) {
                  console.log("Triggering Voiceflow event with image URL:", data.upload.url);
                  triggerEvents_image();
                }
              });
            }
          };
          document.body.appendChild(fileInput);
          fileInput.click();
          fileInput.addEventListener("change", function () {
            document.body.removeChild(fileInput);
          });
        });

        const parentOfSend = sendButtonContainer.parentElement;
        if (parentOfSend) {
          parentOfSend.insertBefore(pinButton, sendButtonContainer);
          console.log("Pin (upload) button appended to chat.");
        }
      }
    }
  }

  setInterval(attachUploadListener, 500);

  // -------------------------------------------------------------------------
  // Helper: Fetch conversation ID from the backend.
  // -------------------------------------------------------------------------
  const fetchConversationId = (userId) => {
    return fetch("/api/get-conversation-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed with status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        const freshchatConversationId = data?.freshchatConversationId;
        const isWithinTimeRange = data?.isWithinTimeRange;
  
        if (freshchatConversationId) {
          console.log("Obtained conversation ID:", freshchatConversationId);
          window.sessionStorage.setItem("freshchat_conversation_id", freshchatConversationId);
        }
  
        if (isWithinTimeRange !== undefined) {
          console.log("Updated isWithinTimeRange:", isWithinTimeRange);
          window.sessionStorage.setItem("isWithinTimeRange", isWithinTimeRange);
        }
  
        return { freshchatConversationId, isWithinTimeRange };
      })
      .catch((error) => {
        console.error("Error fetching conversation ID:", error);
        return null;
      });
  };
  
  const pollConversationId = (userId) => {
    return new Promise((resolve) => {
      let conversationFetched = false;
  
      // Poll every 2 seconds until freshchatConversationId is found
      const intervalId = setInterval(() => {
        fetchConversationId(userId).then(({ freshchatConversationId, isWithinTimeRange }) => {
          if (freshchatConversationId && !conversationFetched) {
            console.log("Fetched conversation ID:", freshchatConversationId);
            conversationFetched = true;
            clearInterval(intervalId);
            resolve({ freshchatConversationId, isWithinTimeRange });
  
            // Start continuous polling for isWithinTimeRange after getting conversation ID
            pollIsWithinTimeRange(userId);
          } else {
            console.log("Retrying conversation ID fetch...");
          }
        });
      }, 500);
    });
  };
  
  // Continuous polling of isWithinTimeRange every 5 seconds
  const pollIsWithinTimeRange = (userId) => {
    setInterval(() => {
      fetchConversationId(userId).then(({ isWithinTimeRange }) => {
        if (isWithinTimeRange !== undefined) {
          console.log("Updated isWithinTimeRange:", isWithinTimeRange);
          window.sessionStorage.setItem("isWithinTimeRange", isWithinTimeRange);
        }
      });
    }, 500);
  };
  
  
  

  // -------------------------------------------------------------------------
  // Load the Voiceflow Chat Widget with advanced styling.
  // -------------------------------------------------------------------------
  v.onload = function () {
    window.voiceflow.chat
      .load({
        verify: { projectID: "67a2fb557f6aec3eafec2266" },
        url: "https://general-runtime.voiceflow.com",
        versionID: "production",
        userID: sessionId,
        render: { mode: "overlay" },
        autostart: false,
        allowDangerousHTML: true,
        // Advanced styling – you can pass custom CSS variables and overrides here.
        styles: {
          // Example: change primary colors or apply custom CSS to internal elements.
          "--vf-primary-color": "#007AFF",
          ".custom-image-message": {
            background: "rgba(0, 0, 0, 0.05)",
            padding: "4px",
            borderRadius: "4px"
          }
        },
        assistant: {
          extensions: [FormExtension, FormExtension_address, OTPFormExtension],
        },
      })
      .then(() => {
        console.log("Chat widget loaded successfully.");

        pollConversationId(sessionId).then((cid) => {

          console.log("Conversation ID polling complete. ID:", cid);
          
        });
      })
      .catch((err) => {
        console.error("Error loading chat widget:", err);
      });

    // Listen for widget open/close messages.
    window.addEventListener(
      "message",
      function (event) {
        try {
          const messageData = JSON.parse(event.data);
          if (messageData.type === "voiceflow:close") {
            console.log("Voiceflow widget closed.");
            displayFeedbackForm();
            window.sessionStorage.setItem("conversation_id_flag", "False");
          }
          if (messageData.type === "voiceflow:open") {
            console.log("Voiceflow widget opened.");
            window.sessionStorage.setItem("conversation_id_flag", "True");
          }
        } catch (error) {
          console.error("Error parsing widget message:", error);
        }
      },
      false
    );

    // Start polling API (dummy implementation)
    setInterval(function () {
      pollApi(sessionId);
    }, 500);
  };

  v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
  v.type = "text/javascript";

  if (s && s.parentNode) {
    s.parentNode.insertBefore(v, s);
  } else {
    console.error("Script parentNode not found. Appending to <head>.");
    document.head.appendChild(v);
  }
})(document, "script");



