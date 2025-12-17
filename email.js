<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script>
emailjs.init("YOUR_PUBLIC_KEY");

function sendClassReminder(subject,time){
  emailjs.send("SERVICE_ID","TEMPLATE_ID",{subject,time});
  alert("Email sent!");
}
</script>

