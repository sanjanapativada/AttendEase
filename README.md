📘 AttendEase

AttendEase is a smart attendance management web application designed to help students track subject-wise attendance, calculate safe classes to skip, receive reminders, and visualize attendance analytics — all in one place.

🔗 Live Demo:
https://attend-ease-orcin.vercel.app/

🚀 Problem Statement

Students often struggle to:

Track attendance across multiple subjects

Know how many classes they can safely skip

Stay above minimum attendance requirements (e.g., 75%)

Get timely reminders for classes

This leads to confusion, stress, and poor academic planning.

💡 Solution

AttendEase simplifies attendance management by providing:

Subject-wise attendance tracking

Automatic calculation of safe classes to skip

Overall attendance alerts

Visual analytics (charts)

Email reminders for classes

Clean, modern UI with dark & light mode

✨ Features
🔐 Login

Guest login supported

Lightweight, no backend authentication

📊 Attendance Calculator

Add subjects with attended & total classes

Calculates:

Attendance percentage

Classes needed to reach minimum attendance

Safe classes that can be skipped

⚠️ Overall Attendance Alert

Floating alert at top:

Warns if attendance < minimum

Shows safe zone message if ≥ minimum

📈 Analytics

Bar chart: subject-wise attendance %

Pie chart: attended vs missed classes

⏰ Email Reminders

Class reminders sent via EmailJS

Email is collected once via prompt

Branded emails sent as AttendEase

🌙 Dark / Light Mode

Fully accessible in both modes

Optimized contrast for readability

🎨 UI & Animations

Mint green & baby blue theme

Smooth page load animations

Hover effects & transitions

🔒 Privacy-First

No database used

All data stored locally in browser (localStorage)

🛠️ Tech Stack

Frontend: HTML, CSS (Tailwind), JavaScript

Charts: Chart.js

Email Service: EmailJS

Storage: Browser Local Storage

Deployment: Vercel

🧠 Architecture Overview
User Browser
   ↓
HTML + CSS + JavaScript
   ↓
LocalStorage (Attendance Data)
   ↓
EmailJS → Gmail (for reminders)


No backend server

No SQL / No database

Fast, reliable, hackathon-friendly

📦 Installation & Setup (Local)

Clone the repository:

git clone https://github.com/<your-username>/AttendEase.git


Open index.html in a browser
(or use Live Server)


🏆 Hackathon Highlights

Frontend-only architecture

Privacy-focused design

Clean UX with real-world utility

Easily extensible for future backend integration

🔮 Future Enhancements

User authentication

Cloud database (Firebase / SQL)

Cross-device sync

Push notifications

Weekly attendance reports

College-wide admin dashboard

👩‍💻 Author

Built with ❤️ for hackathon submission by AttendEase Team
