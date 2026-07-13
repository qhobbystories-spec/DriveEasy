import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Trash2, Settings, Mail } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a booking, or contact our support team. This includes:

Personal identification: Name, date of birth, driver's license number, government-issued ID
Contact information: Email address, phone number, postal address
Payment information: Credit/debit card details (processed securely through our PCI-DSS compliant payment processor — we do not store full card numbers)
Booking details: Rental dates, locations, vehicle preferences, and transaction history
Communications: Messages, feedback, and support requests

We also collect information automatically when you use our services:

Usage data: Pages visited, features used, time spent, referring URLs
Device information: Browser type, operating system, IP address, device identifiers
Location data: General location based on IP address (precise location only with your explicit consent)`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Process and manage your bookings and payments
• Send booking confirmations, receipts, and updates
• Provide customer support and respond to inquiries
• Personalize your experience and make recommendations
• Send promotional communications (only with your consent, unsubscribe anytime)
• Improve our services through analytics and user feedback
• Detect and prevent fraud, abuse, and security incidents
• Comply with legal obligations and enforce our Terms of Service
• Calculate and manage our loyalty rewards program`
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties for marketing purposes.

We may share your information with:

Service providers: Trusted third-party vendors who help us operate our business (payment processors, email services, analytics providers). These parties are contractually bound to protect your data.

Insurance partners: As required to provide rental insurance coverage.

Legal authorities: When required by law, court order, or to protect the rights, property, or safety of DriveElite, our customers, or others.

Business transfers: In connection with a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before such a transfer occurs.

We require all third parties to respect the security of your personal data and treat it in accordance with the law.`
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information including:

• 256-bit SSL/TLS encryption for all data transmission
• PCI-DSS compliant payment processing
• Regular security audits and penetration testing
• Strict access controls and employee data handling training
• Secure, encrypted data storage with regular backups

While we take every precaution, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and keep your account credentials confidential.`
  },
  {
    title: '5. Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files stored on your device.

Types of cookies we use:
• Essential cookies: Required for the site to function (login sessions, booking state)
• Analytics cookies: Help us understand how visitors use our site (Google Analytics)
• Preference cookies: Remember your settings and preferences
• Marketing cookies: Deliver relevant advertisements (only with your consent)

You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect site functionality.`
  },
  {
    title: '6. Your Rights & Choices',
    content: `You have the following rights regarding your personal data:

Access: Request a copy of the personal information we hold about you.
Correction: Request correction of inaccurate or incomplete data.
Deletion: Request deletion of your personal information ("right to be forgotten"), subject to legal retention requirements.
Portability: Request your data in a portable, machine-readable format.
Objection: Object to certain types of processing, including direct marketing.
Withdrawal of consent: Withdraw consent at any time where processing is based on consent.

To exercise any of these rights, contact us at privacy@driveelite.com. We will respond within 30 days.`
  },
  {
    title: '7. Data Retention',
    content: `We retain personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Booking records are retained for 7 years for accounting and legal compliance purposes. Account information is retained until you request deletion or close your account. Marketing preferences and consent records are retained until you withdraw consent.

When information is no longer needed, we securely delete or anonymize it.`
  },
  {
    title: '8. Children\'s Privacy',
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately at privacy@driveelite.com and we will delete it promptly.`
  },
];

export default function Privacy() {
  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">Privacy Policy</span></div>
          <h1>Privacy Policy</h1>
          <p>Last updated: January 1, 2026. We respect your privacy and are committed to protecting your personal data.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Key commitments */}
          <div className="privacy-highlights">
            {[
              { icon: Shield, title: 'We Protect Your Data', desc: 'Industry-leading encryption and security standards for all your information.' },
              { icon: Lock, title: 'No Data Selling', desc: 'We never sell your personal data to third parties. Period.' },
              { icon: Eye, title: 'Full Transparency', desc: 'We clearly explain what data we collect and why.' },
              { icon: Trash2, title: 'Your Right to Delete', desc: 'Request complete deletion of your data at any time.' },
            ].map((h, i) => (
              <div key={i} className="privacy-highlight">
                <div className="ph-icon"><h.icon size={20} /></div>
                <div className="ph-title">{h.title}</div>
                <div className="ph-desc">{h.desc}</div>
              </div>
            ))}
          </div>

          <div className="legal-layout">
            <aside className="legal-toc">
              <div className="toc-inner">
                <h4>Table of Contents</h4>
                <ul>
                  {sections.map((s, i) => (
                    <li key={i}><a href={`#psec-${i}`}>{s.title.replace(/^\d+\.\s/, '')}</a></li>
                  ))}
                </ul>
              </div>
            </aside>

            <article className="legal-content">
              <div className="legal-intro">
                <p>This Privacy Policy explains how DriveElite Inc. ("we," "our," or "us") collects, uses, shares, and protects your personal information when you use our car rental services, website, and mobile application.</p>
              </div>

              {sections.map((s, i) => (
                <div key={i} id={`psec-${i}`} className="legal-section">
                  <h3>{s.title}</h3>
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              ))}

              <div className="legal-contact">
                <h3>Contact Our Privacy Team</h3>
                <p>For any privacy-related questions, concerns, or to exercise your rights:</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                  <a href="mailto:privacy@driveelite.com" className="btn btn-outline btn-sm"><Mail size={14} /> privacy@driveelite.com</a>
                  <a href="tel:+18005550100" className="btn btn-secondary btn-sm">+1 (800) 555-0100</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <style>{`
        .privacy-highlights {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          margin-bottom: 56px;
        }
        .privacy-highlight {
          background: var(--dark-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px 20px; text-align: center;
          transition: all var(--transition);
        }
        .privacy-highlight:hover { border-color: var(--primary); transform: translateY(-2px); }
        .ph-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(230,57,70,0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .ph-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .ph-desc { font-size: 13px; color: var(--gray-1); line-height: 1.5; }
        .legal-layout { display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: start; }
        .legal-toc { position: sticky; top: 90px; }
        .toc-inner { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .toc-inner h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-1); margin-bottom: 14px; }
        .toc-inner ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .toc-inner a { font-size: 13px; color: var(--gray-1); display: block; padding: 6px 10px; border-radius: 8px; transition: all 0.2s; text-decoration: none; }
        .toc-inner a:hover { background: rgba(255,255,255,0.05); color: var(--primary); }
        .legal-intro { background: rgba(230,57,70,0.06); border-left: 3px solid var(--primary); padding: 16px 20px; border-radius: 0 var(--radius) var(--radius) 0; margin-bottom: 32px; font-size: 15px; color: var(--gray-1); line-height: 1.7; }
        .legal-section { margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid var(--border); }
        .legal-section:last-of-type { border-bottom: none; }
        .legal-section h3 { font-size: 19px; font-weight: 700; margin-bottom: 14px; }
        .legal-section p { color: var(--gray-1); font-size: 15px; line-height: 1.8; margin-bottom: 12px; }
        .legal-contact { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
        .legal-contact h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .legal-contact p { color: var(--gray-1); font-size: 15px; }
        @media (max-width: 1024px) { .privacy-highlights { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) { .legal-layout { grid-template-columns: 1fr; } .legal-toc { position: static; } }
        @media (max-width: 640px) { .privacy-highlights { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
