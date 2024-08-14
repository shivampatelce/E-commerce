document.addEventListener('DOMContentLoaded', function() {
    console.log("hellooo");
    document.getElementById('place-order-button').addEventListener('click', function(e) {
        console.log("1111111")
        e.preventDefault(); 
    
        let errors = [];
    
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const cardNumber = document.querySelector('input[name="card-number"]').value.trim();
        const expiryDate = document.querySelector('input[name="expiry-date"]').value.trim();
        const cvv = document.querySelector('input[name="cvv"]').value.trim();
    
        // Validate each field
        if (!name || name.length <= 2) {
            errors.push('Name is required and should be more than 2 characters.');
        }
        if (!email || !validateEmail(email)) {
            errors.push('A valid email is required.');
        }
        if (!address || address.length < 5) {
            errors.push('Address is required and should be more than 5 characters.');
        }
        if (!city) {
            errors.push('City is required.');
        }
        if (!country) {
            errors.push('Country is required.');
        }
        if (!postalCode || postalCode.length < 5 || isNaN(postalCode)) {
            errors.push('A valid Postal Code is required.');
        }
        if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
            errors.push('A valid 16-digit Card Number is required.');
        }
        if (!expiryDate || !validateExpiryDate(expiryDate)) {
            errors.push('A valid Expiry Date (MM/YY) is required.');
        }
        if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
            errors.push('A valid 3-digit CVV is required.');
        }
    
        // Show errors if there are any
        if (errors.length > 0) {
            alert('Please correct the following errors:\n\n' + errors.join('\n'));
        } else {
            alert('Form is valid! Proceeding with order...');
            // Proceed with form submission or payment process
        }
    });
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Expiry date validation function (MM/YY)
    function validateExpiryDate(expiryDate) {
        const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!re.test(expiryDate)) {
            return false;
        }
    
        const parts = expiryDate.split('/');
        const month = parseInt(parts[0], 10);
        const year = parseInt('20' + parts[1], 10); // Convert YY to YYYY
    
        const currentDate = new Date();
        const expiry = new Date(year, month);
    
        return expiry > currentDate;
    }
});
