import { corsHeaders } from "@shared/cors.ts";

// EmailJS configuration - Replace with your actual values
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your EmailJS public key

// EmailJS API endpoint
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const {
      name,
      email,
      phone,
      serviceType,
      address,
      notes,
      preferredDate,
      preferredTime,
    } = await req.json();

    // Validate required fields
    if (!name || !email || !preferredDate || !preferredTime || !serviceType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Format service type for display
    const formattedServiceType = serviceType
      .replace("-", " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase());

    // Business notification email content
    const businessEmailContent = `
New Consultation Request Received

Client Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || "Not provided"}

Appointment Details:
- Preferred Date: ${preferredDate}
- Preferred Time: ${preferredTime}
- Service Type: ${formattedServiceType}
- Address: ${address || "Not provided"}

Additional Notes:
${notes || "No additional notes provided"}

Please follow up with this client within 24 hours.
    `;

    // Client confirmation email content
    const clientEmailContent = `
Dear ${name},

Thank you for your interest in Serene Wings Caregiving! We have received your consultation request and are excited to help you find the perfect care solution for your loved one.

Your Request Details:
- Preferred Date: ${preferredDate}
- Preferred Time: ${preferredTime}
- Service Type: ${formattedServiceType}

What happens next?
1. Our care coordinator will review your request within 2-4 hours
2. We'll call you at ${phone || "the number you provided"} to confirm your appointment
3. During our consultation, we'll discuss your specific needs and create a personalized care plan

Questions or need immediate assistance?
Call us at (919) 888-1810 - we're here to help!

Warm regards,
The Serene Wings Caregiving Team

P.S. Our consultations are completely free with no obligation. We're here to provide information and support, whether you choose our services or not.
    `;

    // Send business notification email using EmailJS
    const businessEmailData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: "serenewingscaregivingllc@gmail.com", // Your business email
        from_name: name,
        from_email: email,
        subject: `New Consultation Request from ${name}`,
        message: businessEmailContent,
        client_name: name,
        client_email: email,
        client_phone: phone || "Not provided",
        service_type: formattedServiceType,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        client_address: address || "Not provided",
        additional_notes: notes || "No additional notes provided",
      },
    };

    // Send the business notification email
    const businessEmailResponse = await fetch(EMAILJS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(businessEmailData),
    });

    if (!businessEmailResponse.ok) {
      const errorText = await businessEmailResponse.text();
      console.error("Failed to send business email:", errorText);
      throw new Error(
        `EmailJS business email failed: ${businessEmailResponse.status}`,
      );
    }

    console.log("Business notification email sent successfully");

    // Optional: Send confirmation email to client (you'll need a separate template for this)
    // Uncomment and configure if you want to send confirmation emails to clients
    /*
    const clientEmailData = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: "YOUR_CLIENT_TEMPLATE_ID", // Different template for client confirmation
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        client_name: name,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        service_type: formattedServiceType,
        confirmation_message: clientEmailContent
      }
    };

    const clientEmailResponse = await fetch(EMAILJS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientEmailData),
    });

    if (!clientEmailResponse.ok) {
      console.error("Failed to send client confirmation email");
    } else {
      console.log("Client confirmation email sent successfully");
    }
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: "Consultation request submitted successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error processing consultation request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
