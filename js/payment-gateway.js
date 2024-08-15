// Paymen-gateway.js code [START] done by Taranpreet

// event handle when DOM content load
document.addEventListener("DOMContentLoaded", function () {
  // created a modal to show the message for place order[START]
  function handlePlaceOrderModal() {
    $("#modal-container").animate({ opacity: "0" }, 1000, "swing", function () {
      $(this).css("display", "none");

      $(".hidden-container")
        .css({
          display: "block",
          opacity: "0",
          position: "absolute",
          left: "-100%",
        })
        .animate(
          {
            left: "50%",
            opacity: "1",
          },
          {
            duration: 1000,
            easing: "swing",
            step: function (now, fx) {
              if (fx.prop === "left") {
                $(this).css("transform", "translateX(-50%)");
              }
            },
          }
        );
    });
  }
  // created a modal to show the message for place order[END]

  //  code for click event when user click on place-order-button id
  document
    .getElementById("place-order-button")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let errors = [];

      // extract input fields values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const city = document.getElementById("city").value.trim();
      const country = document.getElementById("country").value.trim();
      const postalCode = document.getElementById("postalCode").value.trim();
      const cardNumber = document
        .querySelector('input[name="card-number"]')
        .value.trim();
      const expiryDate = document
        .querySelector('input[name="expiry-date"]')
        .value.trim();
      const cvv = document.querySelector('input[name="cvv"]').value.trim();

      // Validation for the input fields
      if (!name || name.length <= 2) {
        errors.push(
          "Name is required and the length of the name should be more than 2 characters."
        );
      }
      if (!email || !validateEmail(email)) {
        errors.push("A valid email is required.");
      }
      if (!address || address.length < 5) {
        errors.push(
          "Address is required and the length of address should be more than 5 characters."
        );
      }
      if (!city) {
        errors.push("City is required.");
      }
      if (!country) {
        errors.push("Country is required.");
      }
      if (!postalCode || postalCode.length < 5 || isNaN(postalCode)) {
        errors.push("A valid Postal Code is required.");
      }
      if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
        errors.push("A valid 16-digit Card Number is required.");
      }
      if (!expiryDate || expiryDate.length < 0) {
        errors.push("A valid Expiry Date is required.");
      }
      if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
        errors.push("A valid 3-digit CVV is required.");
      }

      // Show errors if there are any
      if (errors.length > 0) {
        alert("Please correct the following values:\n\n" + errors.join("\n"));
      } else {
        handlePlaceOrderModal();
      }
    });

  // validation code for email -- taken reference from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  function validateEmail(email) {
    const validate =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return validate.test(email);
  }
});

// Added animation when user click on close button which is on modal
$(document).ready(function () {
  function handleCloseModal() {
    $(".close").hover(
      function () {
        $(".close").css({
          transform: "rotateZ(90deg)",
          transition: "transform 500ms linear",
        });
      },
      function () {
        $(".close").css({
          transform: "rotateZ(0deg)",
          transition: "transform 500ms linear",
        });
      }
    );
  }
  handleCloseModal();

  $(".close").on("click", () => {
    window.location.href = "../pages/cart.html";
  });

  $("#shop-more").on("click", () => {
    window.location.href = "../pages/index.html";
  });
});

//payment-gateway.js code [END] done by Taranpreet
