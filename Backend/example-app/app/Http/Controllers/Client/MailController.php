<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMailContact;
class MailController extends Controller
{
    public function send(Request $request)
    {
        // Validate the form data
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        // Prepare the contact data
        $contactData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ];

        // Send the email
        Mail::to('tranchinguyen1307@gmail.com')->send(new SendMailContact($contactData));

        return response()->json(['message' => 'Contact email sent successfully'], 200);
    }
}
