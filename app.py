from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Site data — kept here so the template stays clean and content is easy to
# update without touching markup.
# ---------------------------------------------------------------------------

SKILLS = [
    {"name": "Python", "icon": "python"},
    {"name": "HTML5", "icon": "html5"},
    {"name": "CSS3", "icon": "css3"},
    {"name": "JavaScript", "icon": "javascript"},
    {"name": "Flask", "icon": "flask"},
    {"name": "Django", "icon": "django"},
    {"name": "MySQL", "icon": "mysql"},
    {"name": "SQL", "icon": "sql"},
    {"name": "SQLite", "icon": "sqlite"},
    {"name": "Pandas", "icon": "pandas"},
    {"name": "NumPy", "icon": "numpy"},
    {"name": "Matplotlib", "icon": "matplotlib"},
    {"name": "Git", "icon": "git"},
    {"name": "GitHub", "icon": "github"},
]

PROJECTS = [
    {
        "title": "Personal Expense Tracker",
        "description": "A web application for managing daily expenses with full CRUD "
                       "functionality, category management, and expense tracking.",
        "tech": ["Python", "Flask", "HTML", "CSS", "SQLite"],
        "github": "https://github.com/SaiHimaSindhu/Personal-Expense-Tracker",
        "demo": "https://personal-expense-tracker-hazel-three.vercel.app/",
        "illustration": "wallet",
    },
    {
        "title": "Student Management System",
        "description": "A database application to manage student records — adding, "
                       "updating, deleting, and searching student information using "
                       "Python and MySQL.",
        "tech": ["Python", "MySQL", "HTML","CSS","Django"],
        "github": "https://github.com/SaiHimaSindhu/Student_Management_System",
        "demo": "https://student-management-system-inky-rho.vercel.app/",
        "illustration": "dashboard",
    },
    {
        "title": "Diwali Sales Analysis",
        "description": "A data analysis project that examines Diwali sales data to "
                       "uncover customer purchasing behavior, sales trends, and "
                       "business insights using Python visualization libraries.",
        "tech": ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
        "github": "https://github.com/SaiHimaSindhu/Diwali_Sales_Data",
        "demo": "#",
        "illustration": "analytics",
    },
]

INTERNSHIP = {
    "company": "Infosys Springboard",
    "type": "Virtual Internship",
    "role": "Python Full Stack Development",
    "duration": "September 2025 \u2013 November 2025",
    "description": (
        "Successfully completed the Infosys Springboard Virtual Internship, where I "
        "gained hands-on experience in Python programming, data analysis, data "
        "visualization, machine learning, SQL, MySQL, and front-end web development. "
        "Worked on practical assignments using NumPy, Pandas, Matplotlib, Seaborn, and "
        "Scikit-learn, strengthening analytical thinking, programming, and software "
        "development skills."
    ),
    "skills": [
        "Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "HTML", "CSS",
        "Scikit-learn", "Machine Learning", "SQL", "MySQL",
    ],
    "certificate_url": "https://drive.google.com/file/d/1cCxuT8lKuhMxjkVH5FgNav6hWX4GSpA1/view?usp=sharing",
}

TYPING_ROLES = ["Software Engineer", "Python Developer", "Software Developer"]

RESUME_FILENAME = "SaiHimaSindhu_Resume.pdf"


@app.route("/")
def index():
    return render_template(
        "index.html",
        skills=SKILLS,
        projects=PROJECTS,
        internship=INTERNSHIP,
        typing_roles=TYPING_ROLES,
    )


@app.route("/resume")
def download_resume():
    """Serve the resume as a downloadable file."""
    resume_dir = os.path.join(app.root_path, "static", "resume")
    return send_from_directory(resume_dir, RESUME_FILENAME, as_attachment=True)


@app.route("/contact", methods=["POST"])
def contact():
    """Handle the contact form submission.

    This is a placeholder handler: it validates the payload and returns a
    JSON response so the frontend can show a success message. Wire this up
    to an email service (e.g. Flask-Mail) when going to production.
    """
    data = request.get_json(silent=True) or request.form

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Please fill in every field."}), 400

    # In production: send an email / store the message here.
    #print(f"[contact form] {name} <{email}>: {message}")

    sender_email = os.environ.get("EMAIL_USER")
    app_password = os.environ.get("EMAIL_PASSWORD")

    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

    sender_email = "sindhukancherla2003@gmail.com"
    

    subject = "New Portfolio Contact Message"

    body = f"""
        Name: {name}
        Email: {email}
        Message:{message}
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = sender_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email,app_password)
        server.send_message(msg)
        server.quit()

    except Exception as e:
        print("Email Error:", e)

    return jsonify({"success": True, "message": "Thanks for reaching out! I'll get back to you soon."})


if __name__ == "__main__":
    app.run(debug=True)
