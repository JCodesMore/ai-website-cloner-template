import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      intro={
        <>
          <p>Loan Ranger Finance Pty Ltd trading as FundUp</p>
          <p>
            Credit Representative 571356 of LMG Broker Services Pty Ltd ACN 632
            405 504 Australian Credit Licence 517192
          </p>
          <p>Effective: May 2025 | Last reviewed: April 2026</p>
        </>
      }
      footnote={
        <p>
          Loan Ranger Finance Pty Ltd trading as FundUp is a Credit
          Representative 571356 of LMG Broker Services Pty Ltd ACN 632 405 504
          Australian Credit Licence 517192. Credit assistance is subject to
          lender credit criteria, fees, charges, and terms and conditions. FundUp
          does not hold an Australian Financial Services Licence and does not
          provide financial product advice. All mortgage broking activities are
          conducted in accordance with the National Consumer Credit Protection
          Act 2009 (Cth).
        </p>
      }
    >
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the FundUp website at fundup.com.au (the Site) or
          by engaging FundUp&apos;s mortgage broking services, you agree to be
          bound by these Terms and Conditions (Terms).
        </p>
        <p>
          These Terms apply to all visitors, users, and enquirers. If you do not
          agree to these Terms, you must not use the Site or engage our services.
        </p>
        <p>
          We may update these Terms from time to time. The current version is
          always published at fundup.com.au/terms. Continued use of the Site or
          our services after any update constitutes your acceptance of the
          revised Terms.
        </p>
      </section>

      <section>
        <h2>2. About Us</h2>
        <p>
          The Site and services are operated by Loan Ranger Finance Pty Ltd (ABN
          to be inserted), trading as FundUp.
        </p>
        <p>
          We are a Credit Representative (Credit Representative Number 571356) of
          LMG Broker Services Pty Ltd ACN 632 405 504, which holds Australian
          Credit Licence 517192. Our credit activities are regulated under the
          National Consumer Credit Protection Act 2009 (Cth) (NCCP Act).
        </p>
        <p>
          FundUp provides mortgage broking services, including credit assistance
          for home loans, investment loans, refinancing, and asset finance. We do
          not provide financial product advice as defined under the Corporations
          Act 2001 (Cth) and do not hold an Australian Financial Services Licence
          (AFSL).
        </p>
      </section>

      <section>
        <h2>3. Nature of Our Services</h2>

        <h3>3.1 Credit assistance only</h3>
        <p>
          FundUp provides credit assistance as defined under the NCCP Act. This
          means we help you identify, apply for, and obtain credit products from
          our panel of lenders. We do not lend money directly.
        </p>
        <p>
          All credit products are subject to the lending criteria, terms,
          conditions, fees, and approval processes of the relevant lender. FundUp
          does not guarantee that any loan application will be approved.
        </p>

        <h3>3.2 Best Interests Duty</h3>
        <p>
          As a mortgage broker, we are subject to the Best Interests Duty under
          Part 3-5A of the NCCP Act and ASIC Regulatory Guide 273. We are legally
          required to act in your best interests when providing credit
          assistance.
        </p>
        <p>
          This means we will take reasonable steps to act in a way that we
          reasonably believe is in your best interests when recommending a credit
          product. Our recommendations are based on the information you provide
          to us. It is important that the information you give us is accurate and
          complete.
        </p>

        <h3>3.3 How we are paid</h3>
        <p>
          FundUp receives commission from lenders when a loan is settled. This may
          include an upfront commission and a trail commission paid over the life
          of the loan. The specific commission amounts will be disclosed to you
          in our Credit Guide and in any written quote or recommendation we
          provide.
        </p>
        <p>
          We do not charge you a fee for our broking services in most
          circumstances. If a fee is applicable in your situation, we will notify
          you in writing before providing any services.
        </p>

        <h3>3.4 Credit Guide</h3>
        <p>
          Before providing credit assistance, we will give you a Credit Guide as
          required by the NCCP Act. The Credit Guide contains information about
          us, our services, how we are remunerated, and how to make a complaint.
          Please read it carefully.
        </p>
      </section>

      <section>
        <h2>4. Information You Provide to Us</h2>
        <p>
          To provide credit assistance, we will ask you to provide personal and
          financial information. You agree to:
        </p>
        <ul>
          <li>provide accurate, complete, and up-to-date information</li>
          <li>
            notify us promptly if any information you have given us changes
          </li>
          <li>not provide false or misleading information</li>
        </ul>
        <p>
          We rely on the information you provide to assess your needs and make
          recommendations. If information you provide is inaccurate or
          incomplete, we may not be able to assist you, and any recommendations
          we make may not be appropriate for your circumstances.
        </p>
        <p>
          Providing false or misleading information in a credit application is a
          serious matter and may constitute an offence under Australian law.
        </p>
      </section>

      <section>
        <h2>5. No Guarantee of Credit Approval</h2>
        <p>
          FundUp does not guarantee that any loan application will be approved by
          a lender. Approval is entirely at the discretion of the relevant lender
          and is subject to the lender&apos;s credit assessment, policies, and
          criteria at the time of application.
        </p>
        <p>
          Factors that affect approval include but are not limited to: your
          credit history, income, existing liabilities, property type and value,
          loan-to-value ratio, and the lender&apos;s current credit policy.
        </p>
        <p>
          Indicative borrowing capacity estimates provided during a consultation
          are for guidance only. They are not a commitment to lend and do not
          constitute pre-approval unless confirmed in writing by a lender.
        </p>
      </section>

      <section>
        <h2>6. Use of This Website</h2>

        <h3>6.1 Permitted use</h3>
        <p>
          You may use the Site for lawful purposes only. You must not use the
          Site in any way that:
        </p>
        <ul>
          <li>
            breaches any applicable Australian or international law or regulation
          </li>
          <li>is fraudulent, deceptive, or misleading</li>
          <li>transmits unsolicited bulk communications</li>
          <li>introduces viruses, malware, or other harmful code</li>
          <li>
            attempts to gain unauthorised access to any part of the Site or its
            related systems
          </li>
          <li>
            infringes the intellectual property rights of FundUp or any third
            party
          </li>
        </ul>

        <h3>6.2 Calculators and tools</h3>
        <p>
          Any loan calculators, repayment estimators, or borrowing capacity tools
          on the Site are provided for illustrative purposes only. Results are
          estimates based on the inputs you provide and general assumptions. They
          do not constitute financial advice, a credit assessment, or a lending
          commitment.
        </p>
        <p>
          You should not rely on calculator outputs as the basis for any
          financial decision. We strongly recommend you obtain a formal
          assessment from us or another qualified professional before making any
          borrowing decisions.
        </p>

        <h3>6.3 Third-party links</h3>
        <p>
          The Site may contain links to third-party websites. These links are
          provided for your convenience only. FundUp does not control, endorse,
          or accept responsibility for the content, privacy practices, or terms
          of any third-party site. You access third-party sites at your own risk.
        </p>
      </section>

      <section>
        <h2>7. Information on This Site</h2>
        <p>
          The content on this Site is provided for general information purposes
          only. It does not constitute financial advice, legal advice, tax
          advice, or credit advice. You should not rely on any content on this
          Site as a substitute for professional advice tailored to your specific
          circumstances.
        </p>
        <p>
          Interest rates, product features, lender policies, and market
          conditions change frequently. While we take reasonable steps to keep
          content current, we do not warrant that any information on the Site is
          accurate, complete, or up to date at any given time.
        </p>
        <p>
          Any reference to specific interest rates on the Site is for
          illustrative purposes only. Actual rates offered to you will depend on
          your circumstances, the lender&apos;s current rates, and applicable
          comparison rates. Where a rate is referenced, a comparison rate based
          on a loan of $150,000 over 25 years will be disclosed. The comparison
          rate is a guide only and may not reflect the full cost of the loan in
          your specific situation.
        </p>
      </section>

      <section>
        <h2>8. Intellectual Property</h2>
        <p>
          All content on this Site, including but not limited to text, graphics,
          logos, icons, images, and software, is the property of Loan Ranger
          Finance Pty Ltd or its licensors and is protected by Australian and
          international copyright and intellectual property laws.
        </p>
        <p>
          You may view, print, and download content from the Site for your
          personal, non-commercial use only. You must not reproduce, republish,
          distribute, modify, or create derivative works from any content on this
          Site without our prior written consent.
        </p>
        <p>
          The FundUp name and logo are trademarks of Loan Ranger Finance Pty Ltd.
          You must not use our trademarks without our prior written permission.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, FundUp and its officers,
          employees, and agents exclude all liability for any loss or damage
          (including direct, indirect, incidental, or consequential loss) arising
          from:
        </p>
        <ul>
          <li>your use of, or inability to use, the Site</li>
          <li>any reliance on information contained on the Site</li>
          <li>
            any error, omission, or inaccuracy in the content of the Site
          </li>
          <li>any unauthorised access to or use of our servers or systems</li>
          <li>
            any interruption or cessation of the Site&apos;s availability
          </li>
          <li>
            any decision made in reliance on credit assistance we provide, where
            that decision is based on inaccurate information you have supplied
          </li>
        </ul>
        <p>
          Nothing in these Terms excludes, restricts, or modifies any right or
          remedy, or any guarantee, warranty, or other term or condition, implied
          or imposed by any legislation that cannot lawfully be excluded or
          limited. This includes consumer guarantees under the Australian
          Consumer Law (Schedule 2 of the Competition and Consumer Act 2010
          (Cth)).
        </p>
        <p>
          Where our liability cannot be excluded but can be limited, our
          liability is limited to resupplying the relevant services.
        </p>
      </section>

      <section>
        <h2>10. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless FundUp, its officers,
          employees, contractors, and agents from and against any claims,
          liabilities, damages, losses, costs, and expenses (including reasonable
          legal fees) arising from:
        </p>
        <ul>
          <li>your breach of these Terms</li>
          <li>
            any false, inaccurate, or misleading information you provide to us
          </li>
          <li>any violation of applicable law by you</li>
          <li>
            your use of the Site in a manner not authorised by these Terms
          </li>
        </ul>
      </section>

      <section>
        <h2>11. Privacy</h2>
        <p>
          Your privacy is important to us. We collect, use, and disclose personal
          information in accordance with the Privacy Act 1988 (Cth) and the
          Australian Privacy Principles.
        </p>
        <p>
          Our Privacy Policy, available at fundup.com.au/privacy, explains what
          information we collect, why we collect it, how we use and disclose it,
          and how you can access and correct it. The Privacy Policy forms part of
          these Terms. By using the Site or our services, you consent to the
          collection and use of your information as described in our Privacy
          Policy.
        </p>
      </section>

      <section>
        <h2>12. Complaints and Dispute Resolution</h2>

        <h3>12.1 Internal complaints</h3>
        <p>
          If you have a complaint about our services, please contact us in the
          first instance. We will acknowledge your complaint within 5 business
          days and provide a substantive response within 30 days.
        </p>
        <p>
          To lodge a complaint, contact us using the details in clause 15 and
          mark your communication as a complaint.
        </p>

        <h3>12.2 External dispute resolution</h3>
        <p>
          If you are not satisfied with our response, you may escalate your
          complaint to the Australian Financial Complaints Authority (AFCA). AFCA
          provides free, independent dispute resolution for financial services
          complaints.
        </p>
        <p>
          <strong>Australian Financial Complaints Authority (AFCA)</strong>
        </p>
        <p>
          Website: afca.org.au | Phone: 1800 931 678 | Mail: GPO Box 3, Melbourne
          VIC 3001
        </p>
        <p>
          You also have the right to make a complaint to the Australian
          Securities and Investments Commission (ASIC) at asic.gov.au or by
          calling 1300 300 630.
        </p>
      </section>

      <section>
        <h2>13. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Queensland, Australia. You
          agree to submit to the non-exclusive jurisdiction of the courts of
          Queensland and any courts competent to hear appeals from those courts.
        </p>
        <p>
          Nothing in this clause limits any rights you may have under the
          Australian Consumer Law or other applicable Commonwealth legislation.
        </p>
      </section>

      <section>
        <h2>14. General</h2>

        <h3>14.1 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid, unlawful, or
          unenforceable, that provision will be severed from the remaining Terms,
          which will continue in full force and effect.
        </p>

        <h3>14.2 Waiver</h3>
        <p>
          A failure or delay by FundUp to exercise any right or remedy under
          these Terms does not constitute a waiver of that right or remedy. A
          waiver of any breach of these Terms does not constitute a waiver of any
          subsequent breach.
        </p>

        <h3>14.3 Entire agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and any Credit Guide or
          written engagement letter we provide to you, constitute the entire
          agreement between you and FundUp in relation to your use of the Site
          and our services. They supersede all prior representations,
          agreements, and understandings.
        </p>

        <h3>14.4 Assignment</h3>
        <p>
          You must not assign or transfer any rights or obligations under these
          Terms without our prior written consent. We may assign our rights and
          obligations under these Terms to a related entity or in connection with
          a sale or transfer of our business, without your consent.
        </p>

        <h3>14.5 Force majeure</h3>
        <p>
          We are not liable for any failure or delay in performing our
          obligations where that failure or delay results from circumstances
          beyond our reasonable control, including but not limited to acts of
          God, natural disasters, government action, system outages, or internet
          disruptions.
        </p>
      </section>

      <section>
        <h2>15. Contact Us</h2>
        <p>
          For all enquiries relating to these Terms, complaints, or our services,
          contact us:
        </p>
        <p>
          <strong>FundUp — Loan Ranger Finance Pty Ltd</strong>
        </p>
        <p>Phone: 0412 885 734</p>
        <p>Email: hello@fundup.com.au</p>
        <p>Website: fundup.com.au</p>
        <p>
          Please mark your communication with the relevant subject (e.g.,
          &apos;Terms Enquiry&apos; or &apos;Complaint&apos;) so we can direct it
          promptly.
        </p>
      </section>
    </LegalPage>
  );
}
