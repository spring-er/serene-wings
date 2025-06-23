function sendEmail(event) {
  event.preventDefault(); // Prevent page reload

  // Show loading state
  const submitButton = document.querySelector(
    '#appointment-form button[type="submit"]',
  );
  const originalButtonText = submitButton.innerHTML;
  submitButton.innerHTML =
    '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>Submitting...';
  submitButton.disabled = true;

  // Gather form data
  const templateParams = {
    from_name: document.querySelector("#consultName").value.trim(),
    from_email: document.querySelector("#consultEmail").value.trim(),
    phone:
      document.querySelector("#consultPhone").value.trim() || "Not provided",
    service_type: document.querySelector("#serviceType").value,
    preferred_date: document.querySelector("#preferredDate").value,
    preferred_time: document.querySelector("#preferredTime").value,
    address: document.querySelector("#address").value.trim() || "Not provided",
    notes:
      document.querySelector("#notes").value.trim() ||
      "No additional notes provided",
    to_email: "serenewingscaregivingllc@gmail.com",
    subject: `New Consultation Request from ${document.querySelector("#consultName").value.trim()}`,
    message: `New consultation request received:\n\nClient: ${document.querySelector("#consultName").value.trim()}\nEmail: ${document.querySelector("#consultEmail").value.trim()}\nPhone: ${document.querySelector("#consultPhone").value.trim() || "Not provided"}\nService: ${document.querySelector("#serviceType").value}\nDate: ${document.querySelector("#preferredDate").value}\nTime: ${document.querySelector("#preferredTime").value}\nAddress: ${document.querySelector("#address").value.trim() || "Not provided"}\nNotes: ${document.querySelector("#notes").value.trim() || "No additional notes"}`,
  };

  // Validate required fields
  if (
    !templateParams.from_name ||
    !templateParams.from_email ||
    !templateParams.preferred_date ||
    !templateParams.preferred_time ||
    !templateParams.service_type
  ) {
    alert(
      "Please fill in all required fields: Name, Email, Preferred Date, Preferred Time, and Service Type.",
    );
    // Reset button
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
    return;
  }

  // Send email using EmailJS
  emailjs
    .send("service_h9wqduy", "template_xryflbn", templateParams)
    .then(function (response) {
      console.log("Email sent successfully:", response);

      // Show success message
      alert(
        "🎉 Request Received Successfully!\n\nThank you! We've received your consultation request and will be in touch within 2-4 hours to confirm your appointment. Check your email for confirmation details.",
      );

      // Reset form
      document.getElementById("appointment-form").reset();

      // Show additional success message after a delay
      setTimeout(() => {
        alert(
          "📧 Confirmation Email Sent\n\nWe've sent a confirmation email with next steps. If you don't see it, please check your spam folder.",
        );
      }, 1000);
    })
    .catch(function (error) {
      console.error("Email sending failed:", error);

      // Show error message with helpful information
      alert(
        "Submission Error\n\nThere was an issue submitting your request. Please call us directly at (919) 888-1810 and we'll be happy to help you schedule your consultation.",
      );
    })
    .finally(function () {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
}

// Attach event listener after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("appointment-form");
  if (form) {
    form.addEventListener("submit", sendEmail);
    console.log("Form event listener attached successfully");
  } else {
    console.error("Appointment form not found");
  }
});
