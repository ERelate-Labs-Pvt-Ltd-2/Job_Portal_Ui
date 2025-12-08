-- Create Database
CREATE DATABASE IF NOT EXISTS jobportal;
USE jobportal;

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary VARCHAR(255),
  experience VARCHAR(255),
  job_type VARCHAR(50),
  skills TEXT,
  description TEXT,
  responsibilities TEXT,
  qualifications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------------------------------------------------------------
--sample jobs

INSERT INTO jobs (title, company, location, salary, experience, job_type, skills, description, responsibilities, qualifications)
VALUES
('Python Developer', 'Infosys', 'Pune', '5 LPA', '1-3 years', 'Full Time', 'Python, Flask, SQL', 'Develop web apps...', 'Backend work...', 'Graduation'),
('Java Developer', 'TCS', 'Mumbai', '6 LPA', '3+ years', 'Full Time', 'Java, Spring Boot, MySQL', 'Build APIs...', 'Team collaboration...', 'Bachelor Degree');

-------------------------------------------------------------------
