from flask import Flask, render_template, request, redirect, url_for
import pymysql
from datetime import datetime

app = Flask(__name__)

# Database connection
db = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="jobportal"
)


# ---------------- HOME / JOB LIST WITH FILTERS ----------------
@app.route("/")
def home():
    q = request.args.get("q", "").strip()
    location = request.args.get("location", "").strip()
    job_type = request.args.get("job_type", "all")
    exp = request.args.get("exp", "any")

    cursor = db.cursor(pymysql.cursors.DictCursor)

    query = "SELECT * FROM jobs WHERE 1=1"
    params = []

    if q:
        query += " AND (title LIKE %s OR company LIKE %s OR skills LIKE %s)"
        like_q = f"%{q}%"
        params.extend([like_q, like_q, like_q])

    if location:
        query += " AND location LIKE %s"
        params.append(f"%{location}%")

    if job_type != "all":
        query += " AND job_type = %s"
        params.append(job_type)

    if exp != "any":
        # experience is stored as text, we just match substring
        query += " AND experience LIKE %s"
        params.append(f"%{exp}%")

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    jobs = cursor.fetchall()
    cursor.close()

    # Compute "posted X days ago"
    now = datetime.now()
    for job in jobs:
        created = job.get("created_at")
        if isinstance(created, datetime):
            days = (now - created).days
            if days == 0:
                job["posted_ago"] = "Today"
            elif days == 1:
                job["posted_ago"] = "1 day ago"
            else:
                job["posted_ago"] = f"{days} days ago"
        else:
            job["posted_ago"] = ""

    return render_template(
        "jobs.html",
        jobs=jobs,
        q=q,
        location_filter=location,
        job_type_filter=job_type,
        exp_filter=exp,
        total=len(jobs)
    )


# ---------------- CREATE JOB ----------------
@app.route("/submit-job", methods=["POST"])
def submit_job():
    data = (
        request.form["title"],
        request.form["company"],
        request.form["location"],
        request.form["salary"],
        request.form["experience"],
        request.form["job_type"],
        request.form["skills"],
        request.form["description"],
        request.form["responsibilities"],
        request.form["qualifications"],
    )

    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO jobs 
        (title, company, location, salary, experience, job_type, skills, description, responsibilities, qualifications)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        data,
    )
    db.commit()
    cursor.close()

    return redirect(url_for("home"))


# ---------------- UPDATE JOB (FROM EDIT MODAL) ----------------
@app.route("/update-job/<int:id>", methods=["POST"])
def update_job(id):
    data = (
        request.form["title"],
        request.form["company"],
        request.form["location"],
        request.form["salary"],
        request.form["experience"],
        request.form["job_type"],
        request.form["skills"],
        request.form["description"],
        request.form["responsibilities"],
        request.form["qualifications"],
        id,
    )

    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE jobs SET
        title=%s, company=%s, location=%s, salary=%s,
        experience=%s, job_type=%s, skills=%s,
        description=%s, responsibilities=%s, qualifications=%s
        WHERE id=%s
        """,
        data,
    )
    db.commit()
    cursor.close()

    return redirect(url_for("home"))


# ---------------- DELETE JOB ----------------
@app.route("/delete-job/<int:id>")
def delete_job(id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM jobs WHERE id=%s", (id,))
    db.commit()
    cursor.close()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)
