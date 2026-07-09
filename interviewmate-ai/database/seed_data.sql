-- ============================================
-- INTERVIEWMATE AI - SEED DATA
-- ============================================

USE interviewmate_db;

-- Insert Job Categories
INSERT INTO job_categories (category_name, description, skills, what_to_expect) VALUES
('Software Development', 'Programming, algorithms, system design', '["Python", "Java", "JavaScript", "React", "Node.js"]', 'Technical coding questions and system design'),
('Data Science', 'Machine learning, statistics, data analysis', '["Python", "Machine Learning", "SQL", "Pandas"]', 'ML concepts and statistical problems'),
('Cloud & DevOps', 'Infrastructure, CI/CD, cloud platforms', '["AWS", "Docker", "Kubernetes", "Jenkins"]', 'Cloud architecture and deployment scenarios'),
('Cybersecurity', 'Security protocols, threat analysis', '["Network Security", "Penetration Testing", "Cryptography"]', 'Security concepts and case studies'),
('UI/UX Design', 'User interface and experience design', '["Figma", "Adobe XD", "User Research", "Prototyping"]', 'Design thinking and portfolio review');

-- Insert Companies
INSERT INTO companies (company_name, type, description) VALUES
('TCS', 'service', 'Tata Consultancy Services - Largest Indian IT company'),
('Infosys', 'service', 'Global leader in next-generation digital services'),
('Wipro', 'service', 'Leading global information technology company'),
('Accenture', 'mnc', 'Global professional services company'),
('Google', 'product', 'Multinational technology company'),
('Amazon', 'product', 'E-commerce and cloud computing giant'),
('Microsoft', 'product', 'Multinational technology corporation'),
('IBM', 'mnc', 'Multinational technology and consulting company');

-- Insert Sample Questions
INSERT INTO question_bank (category_id, question_text, difficulty, question_type, expected_keywords, context, time_limit) VALUES
(1, 'Explain the difference between REST and SOAP APIs.', 'medium', 'technical', '["rest", "soap", "api", "http", "xml", "json"]', 'Common backend interview question', 120),
(1, 'What is the time complexity of binary search?', 'easy', 'technical', '["binary search", "O(log n)", "algorithm", "time complexity"]', 'Fundamental algorithm question', 60),
(1, 'Describe a challenging project you worked on and how you handled it.', 'medium', 'behavioral', '["challenge", "project", "solution", "teamwork", "leadership"]', 'Behavioral question for all levels', 180),
(2, 'Explain the difference between supervised and unsupervised learning.', 'easy', 'technical', '["supervised", "unsupervised", "labeled data", "clustering"]', 'Basic ML concept', 90),
(3, 'What is Docker and how does it differ from a virtual machine?', 'medium', 'technical', '["docker", "container", "virtual machine", "isolation"]', 'DevOps fundamental question', 120);

-- Insert STAR Model Answers
INSERT INTO star_model_answers (q_id, situation, task, action, result, full_answer, keywords_covered) VALUES
(3, 'In my previous role, our team faced a tight deadline for a critical client project.', 'I was responsible for leading the backend development and ensuring we met the deadline.', 'I reorganized the task priorities, implemented daily stand-ups, and worked closely with the frontend team to resolve integration issues quickly.', 'We delivered the project two days early, received positive client feedback, and the approach was adopted for future projects.', 'In my previous role... [full answer]', '["challenge", "leadership", "deadline", "teamwork"]');