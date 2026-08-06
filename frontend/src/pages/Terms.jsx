import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Eligibility & Driver Requirements',
    content: `To rent a vehicle with AMK Motors & AutoCare, you must be at least 21 years of age (25 for certain premium/exotic vehicles) and hold a valid driver's license issued at least 1 year prior to the rental date. International customers must present both their foreign license and an International Driving Permit (IDP). All drivers must present a valid government-issued photo ID and a credit card in their own name.

Additional drivers must meet the same eligibility requirements and must be registered at the time of pickup. AMK Motors & AutoCare reserves the right to refuse rental to any individual who does not meet these requirements.`
  },
  {
    title: '2. Reservations & Booking',
    content: `Reservations are confirmed only upon receipt of full payment or a valid credit card authorization. A reservation confirmation email will be sent to the email address provided at booking. AMK Motors & AutoCare reserves the right to cancel any booking in cases of fraud, unavailability, or erroneous pricing.

Prices displayed are per day (24-hour period) unless otherwise stated. Weekly and monthly rates are available as described in our Pricing section. All prices are in GHS and are subject to applicable taxes and fees.`
  },
  {
    title: '3. Cancellation & Modification Policy',
    content: `Economy Plan: Free cancellation up to 48 hours before the scheduled pickup time. Cancellations within 48 hours will incur a fee equal to one day's rental.

Premium Plan: Free cancellation up to 24 hours before pickup. Cancellations within 24 hours will incur a fee equal to one day's rental.

Elite Plan: Free cancellation at any time before pickup with no charge.

No-shows (failure to pick up without cancellation) will be charged the full rental amount. Modifications to reservations are subject to availability and may affect pricing.`
  },
  {
    title: '4. Vehicle Use & Restrictions',
    content: `Rented vehicles may only be used for lawful purposes on paved public roads. The following uses are strictly prohibited:

• Off-road driving or driving on unpaved surfaces
• Racing, speed testing, or any competitive events
• Transporting illegal substances, contraband, or unauthorized persons
• Subletting or re-renting the vehicle to third parties
• Crossing international borders without prior written authorization from AMK Motors & AutoCare
• Towing or pushing any trailer, vehicle, or object

Violation of any of these restrictions will result in immediate termination of the rental agreement, forfeiture of all deposits, and the renter will be held liable for all resulting damages and costs.`
  },
  {
    title: '5. Insurance & Liability',
    content: `All rentals include basic Collision Damage Waiver (CDW) and Theft Protection. This coverage includes a deductible as specified in your rental agreement. Comprehensive zero-deductible coverage is available as an add-on or is included in Premium and Elite plans.

The renter accepts full responsibility for any damage, theft, or loss not covered by the included insurance. AMK Motors & AutoCare strongly recommends reviewing your personal auto insurance policy and credit card benefits, as they may provide additional coverage.

The renter is personally liable for all traffic violations, tolls, parking fines, and other charges incurred during the rental period.`
  },
  {
    title: '6. Fuel Policy',
    content: `All vehicles are provided with a full tank of fuel. Renters are required to return the vehicle with a full tank. If the vehicle is returned with less than a full tank, a refueling service charge will be applied at our standard rate (currently GHS 8.99/gallon plus a GHS 25 service fee).

Electric vehicles must be returned with at least 80% charge. A recharging fee of GHS 35 applies if the vehicle is returned below this level.`
  },
  {
    title: '7. Mileage',
    content: `Economy Plan rentals include 100 km per day. Excess mileage is charged at GHS 0.25 per km. Premium and Elite Plan rentals include unlimited mileage unless otherwise specified on the rental agreement.

Mileage is calculated from pickup to return based on the vehicle's odometer reading.`
  },
  {
    title: '8. Late Returns',
    content: `Vehicles must be returned at the agreed-upon date and time. A grace period of one hour is granted. Returns between 1–3 hours late will incur a charge equal to one-quarter of the daily rate. Returns more than 3 hours late will be charged an additional full day's rental at the standard rate.

If you anticipate a late return, please contact our team as soon as possible to arrange an extension, subject to availability.`
  },
  {
    title: '9. Governing Law & Disputes',
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising from these terms or your use of AMK Motors & AutoCare services shall be subject to the exclusive jurisdiction of the courts of Ghana.

If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`
  },
];

export default function Terms() {
  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="active">Terms & Conditions</span></div>
          <h1>Terms & Conditions</h1>
          <p>Last updated: January 1, 2026. Please read these terms carefully before using our services.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="legal-layout">
            {/* TOC */}
            <aside className="legal-toc">
              <div className="toc-inner">
                <h4>Table of Contents</h4>
                <ul>
                  {sections.map((s, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`}>{s.title.split('. ')[1] || s.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Content */}
            <article className="legal-content">
              <div className="legal-intro">
                <p>By accessing or using AMK Motors & AutoCare's website, mobile application, or rental services, you agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you ("Customer," "Renter," or "You") and AMK Motors & AutoCare Inc. ("AMK Motors & AutoCare," "We," or "Us").</p>
              </div>

              {sections.map((s, i) => (
                <div key={i} id={`section-${i}`} className="legal-section">
                  <h3>{s.title}</h3>
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              ))}

              <div className="legal-contact">
                <h3>Contact Us</h3>
                <p>If you have questions about these Terms, please contact us:</p>
                <p><strong>AMK Motors & AutoCare Inc.</strong><br />Koforidua, Eastern Region, Ghana<br />hello@amkmotors.com<br />+233 547 129 448</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <style>{`
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
        .legal-section h3 { font-size: 19px; font-weight: 700; margin-bottom: 14px; color: var(--white); }
        .legal-section p { color: var(--gray-1); font-size: 15px; line-height: 1.8; margin-bottom: 12px; }
        .legal-contact { background: var(--dark-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-top: 16px; }
        .legal-contact h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .legal-contact p { color: var(--gray-1); font-size: 15px; line-height: 1.7; margin-bottom: 8px; }
        @media (max-width: 900px) { .legal-layout { grid-template-columns: 1fr; } .legal-toc { position: static; } }
      `}</style>
    </main>
  );
}
