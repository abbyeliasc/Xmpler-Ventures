(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      let formData = new FormData( thisForm );
      php_email_form_submit(thisForm, action, formData);
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
   
    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())) // Convert FormData to JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse response as JSON
        } else {
            throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
    })
    .then(response => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (typeof response === 'object' && response.message === 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        setTimeout(() => {
          thisForm.querySelector('.sent-message').classList.remove('d-block');
        }, 5000);
        thisForm.reset();
      } else {
          throw new Error(response && response.error ? response.error : `Form submission failed and no error message returned from: ${action}`);
      }
    })
    .catch(error => {
        displayError(thisForm, error);
    });
}  
// Function to perform form validation
function validateForm(form) {
  let nameInput = form.querySelector('input[name="name"]');
  let emailInput = form.querySelector('input[name="email"]');
  let subjectInput = form.querySelector('input[name="subject"]');
  let messageInput = form.querySelector('textarea[name="message"]');

  if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
      displayError(form, 'All fields are required');
      return false;
  }

  return true;
}

function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
    setTimeout(function() {
      thisForm.querySelector('.error-message').classList.remove('d-block');
    }, 5000);
}

})();