(function () {
  emailjs.init("4gq2mZz0u0xmMWEcX");
})();

function sendClassReminder(subject, time) {
  let userEmail = localStorage.getItem("userEmail");

  // Ask once if not present
  if (!userEmail) {
    userEmail = prompt("Enter your email to receive reminders:");

    // Cancelled or empty
    if (!userEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("userEmail", userEmail);
  }

  emailjs
    .send(
      "service_3lnibac",
      "template_sy8vleh",
      {
        subject: subject,
        time: time,
        to_email: userEmail
      }
    )
    .then(
      () => alert("📧 Email sent successfully!"),
      (err) => {
        console.error("EmailJS Error:", err);
        alert("❌ Email failed. Please try again.");
      }
    );
}
