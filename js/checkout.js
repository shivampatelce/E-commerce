$( function() {
    $( "#tabs" ).tabs({
      active:false
    });
     $("#continue-button").click(function() {
      event.preventDefault();
     $("#tabs").tabs("option", "active", 1); 
    });
    $("#submitPaymentBtn").click(function() {
      event.preventDefault();
      $("#tabs").tabs("option", "active", 2);
    });
  } );
  $( function() {
    $( "#accordion" ).accordion({
      collapsible: true

    });
    
  } );

  $(document).ready(function() {

    handleValidation();
    $('#first-name, #last-name, #address, #country, #city, #postal-code, #phone, #email').on('input change', function() {
      handleValidation();
      $(this).removeClass('input-error'); 
  });

    function displayReviewDetails() {
        let firstName = $('#first-name').val();
        let lastName = $('#last-name').val();
        let address = $('#address').val();
        let country = $('#country').val();
        let city = $('#city').val();
        let postalCode = $('#postal-code').val();
        let phone = $('#phone').val();
        let cardNumber = $('#card-number').val(); 

        let reviewDetails = `
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Postal Code:</strong> ${postalCode}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Card number:</strong> ${cardNumber}</p>`;

        $('#tabs').find('.reviewDetails').html(reviewDetails);
    }

    $('#continue-button').click(function(e) {
        e.preventDefault(); 
        displayReviewDetails();

        $('#accordion .addressDetails').slideUp();
        $('#accordion .payment-container').slideDown(300);
    });

    
});


$(function() {
  var $tabs = $("#tabs");
  $tabs.tabs({
      activate: function(event, ui) {
          updateProgressBar();
      }
  });

  function updateProgressBar() {
      var totalTabs = $tabs.find("ul > li").length;
      var activeIndex = $tabs.tabs("option", "active") + 1;
      var progress = (activeIndex / totalTabs) * 100;
      $("#progress-bar").css("width", progress + "%");
  }
  $("#progress-bar").css("width", "0%");

  updateProgressBar();
});


// Function to validate inputs and manage the continue button state
const handleValidation = () => {
  let isValid = true;


  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const address = document.getElementById('address');
  const country = document.getElementById('country');
  const city = document.getElementById('city');
  const postalCode = document.getElementById('postal-code');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');



  if (firstName.value.trim() === "") {
    isValid = false;
    $(firstName).addClass('input-error');
}
if (lastName.value.trim() === "") {
    isValid = false;
    $(lastName).addClass('input-error');
}
if (address.value.trim() === "") {
    isValid = false;
    $(address).addClass('input-error');
}
if (country.value === "") {
    isValid = false;
    $(country).addClass('input-error');
}
if (city.value.trim() === "") {
    isValid = false;
    $(city).addClass('input-error');
}
if (postalCode.value.trim() === "") {
    isValid = false;
    $(postalCode).addClass('input-error');
}
if (phone.value.trim() === "") {
    isValid = false;
    $(phone).addClass('input-error');
}
if (email.value.trim() === "") {
    isValid = false;
    $(email).addClass('input-error');
}

  document.getElementById('continue-button').disabled = !isValid;

  return isValid;
};



document.getElementById('continue-button').addEventListener('click', function(e) {
  if (!handleValidation()) {
      e.preventDefault(); 
  }
});