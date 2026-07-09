-- ============================================
-- INTERVIEWMATE AI - DATABASE SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS interviewmate_db;
USE interviewmate_db;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(200),
    branch VARCHAR(100),
    year INT,
    avatar_url VARCHAR(255),
    role ENUM('user', 'counselor', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job Categories table
CREATE TABLE job_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_path VARCHAR(255),
    skills JSON,
    what_to_expect TEXT,
    companies JSON
);

-- Companies table
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    type ENUM('mnc', 'startup', 'product', 'service'),
    special_focus TEXT,
    website VARCHAR(255),
    description TEXT
);

-- Question Bank table
CREATE TABLE question_bank (
    q_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    company_id INT,
    question_text TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    question_type ENUM('technical', 'behavioral', 'hr', 'situational') DEFAULT 'technical',
    expected_keywords JSON,
    context TEXT,
    hints JSON,
    time_limit INT DEFAULT 120,
    FOREIGN KEY (category_id) REFERENCES job_categories(category_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- STAR Model Answers table
CREATE TABLE star_model_answers (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    q_id INT NOT NULL,
    situation TEXT NOT NULL,
    task TEXT NOT NULL,
    action TEXT NOT NULL,
    result TEXT NOT NULL,
    full_answer TEXT NOT NULL,
    keywords_covered JSON,
    FOREIGN KEY (q_id) REFERENCES question_bank(q_id) ON DELETE CASCADE
);

-- Interview Sessions table
CREATE TABLE interview_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    company_id INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT,
    overall_score DECIMAL(5,2),
    status ENUM('active', 'completed', 'aborted') DEFAULT 'active',
    num_questions INT DEFAULT 10,
    time_per_question INT DEFAULT 120,
    difficulty ENUM('easy', 'medium', 'hard', 'mixed') DEFAULT 'mixed',
    resume_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(category_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Responses table
CREATE TABLE responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    q_id INT NOT NULL,
    audio_path VARCHAR(255),
    transcript TEXT,
    facial_emotion_data JSON,
    speech_emotion_data JSON,
    answer_score DECIMAL(5,2),
    star_compliance_score DECIMAL(5,2),
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (q_id) REFERENCES question_bank(q_id)
);

-- Confidence Reports table
CREATE TABLE confidence_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL UNIQUE,
    facial_score DECIMAL(5,2),
    speech_score DECIMAL(5,2),
    clarity_score DECIMAL(5,2),
    answer_score DECIMAL(5,2),
    eye_contact_score DECIMAL(5,2),
    overall_score DECIMAL(5,2) NOT NULL,
    improvement_tips JSON,
    pdf_path VARCHAR(255),
    emotion_timeline JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id) ON DELETE CASCADE
);

-- Progress Tracking table
CREATE TABLE progress_tracking (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    session_count INT DEFAULT 0,
    avg_score DECIMAL(5,2),
    best_score DECIMAL(5,2),
    weakest_area VARCHAR(100),
    strongest_area VARCHAR(100),
    trend JSON,
    last_session_date TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);