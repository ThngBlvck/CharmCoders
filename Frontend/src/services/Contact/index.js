import request from '../../api';// Relative to the base URL in your request setup

const URL_Contact = 'client/contact/send'; // Define the URL for the contact endpoint

// Function to send a contact message
export const sendContactMessage = (formData) => {
    return request({
        method: 'POST', // Use POST method for sending data
        path: URL_Contact,
        data: formData, // Send the form data in the body of the request
    });
};