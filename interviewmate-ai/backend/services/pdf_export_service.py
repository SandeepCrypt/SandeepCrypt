# ============================================
# INTERVIEWMATE AI - PDF EXPORT SERVICE
# ============================================

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from models import InterviewSession, ConfidenceReport, User
from datetime import datetime
import os

class PdfExportService:
    def __init__(self):
        self.report_folder = os.environ.get('REPORT_FOLDER', 'reports')
        os.makedirs(self.report_folder, exist_ok=True)
    
    def generate_report_pdf(self, session_id):
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        if not report:
            return None
        
        session = InterviewSession.query.get(session_id)
        user = session.user if session else None
        
        filename = f"report_{session_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(self.report_folder, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        title_style = ParagraphStyle(
            'CustomTitle', parent=styles['Heading1'],
            fontSize=24, textColor=colors.HexColor('#2563eb'),
            spaceAfter=30, alignment=TA_CENTER
        )
        
        story.append(Paragraph("InterviewMate AI - Confidence Report", title_style))
        story.append(Spacer(1, 20))
        
        # Info table
        info_data = [
            ['Candidate:', user.name if user else 'Unknown'],
            ['Date:', session.created_at.strftime('%Y-%m-%d %H:%M') if session else 'Unknown'],
            ['Overall Score:', f"{float(report.overall_score):.1f}%" if report.overall_score else 'N/A']
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 20))
        
        # Score breakdown
        score_data = [['Metric', 'Score', 'Weight', 'Weighted']]
        score_data.append(['Facial Expressions', f"{float(report.facial_score):.1f}%", '25%', f"{float(report.facial_score)*0.25:.1f}%"])
        score_data.append(['Speech Emotion', f"{float(report.speech_score):.1f}%", '20%', f"{float(report.speech_score)*0.20:.1f}%"])
        score_data.append(['Speech Clarity', f"{float(report.clarity_score):.1f}%", '15%', f"{float(report.clarity_score)*0.15:.1f}%"])
        score_data.append(['Answer Quality', f"{float(report.answer_score):.1f}%", '25%', f"{float(report.answer_score)*0.25:.1f}%"])
        score_data.append(['Eye Contact', f"{float(report.eye_contact_score):.1f}%", '15%', f"{float(report.eye_contact_score)*0.15:.1f}%"])
        score_data.append(['Overall', '', '', f"{float(report.overall_score):.1f}%"])
        
        score_table = Table(score_data, colWidths=[2.5*inch, 1.5*inch, 1*inch, 1.5*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#dbeafe')),
            ('GRID', (0, 0), (-1, -2), 1, colors.HexColor('#e5e7eb')),
            ('GRID', (0, -1), (-1, -1), 2, colors.HexColor('#2563eb')),
        ]))
        story.append(score_table)
        
        # Tips
        if report.improvement_tips:
            story.append(Spacer(1, 20))
            story.append(Paragraph("Improvement Tips", styles['Heading2']))
            for tip in report.improvement_tips:
                story.append(Paragraph(f"<b>{tip.get('title', 'Tip')}</b>", styles['Heading4']))
                story.append(Paragraph(tip.get('description', ''), styles['Normal']))
        
        doc.build(story)
        return filepath