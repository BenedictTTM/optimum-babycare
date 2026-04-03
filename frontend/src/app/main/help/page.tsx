'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 sm:px-10 bg-white border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: January 12, 2026</p>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-600 leading-relaxed">

            <section>
              <p>
                Welcome to Babylist (“we,” “our,” or “us”). By accessing or using the Babylist mobile application,
                website, or related services (collectively, the “Service”), you agree to be bound by these Terms and
                Conditions (“Terms”). If you do not agree to these Terms, please discontinue use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Eligibility</h2>
              <p>
                You must be at least the minimum legal age required under applicable laws to use this Service.
                By using Babylist, you confirm that you meet this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Account Registration</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Certain features require account creation.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate, complete, and up-to-date information.</li>
                <li>You are responsible for all activities that occur under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Orders and Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All prices are displayed in the applicable currency and may include taxes where required.</li>
                <li>Babylist reserves the right to refuse, cancel, or limit any order.</li>
                <li>Payments are processed through secure, trusted third-party payment providers.</li>
                <li>Babylist does not store full payment card details on its servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping and Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Delivery timelines are estimates and may vary due to logistics, location, or external factors.</li>
                <li>Babylist is not liable for delays caused by third-party delivery services or circumstances beyond our control.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Returns and Refunds</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Returns and refunds are governed by our Return & Refund Policy.</li>
                <li>Items must meet eligibility criteria to qualify for returns or refunds.</li>
                <li>Certain items may be non-refundable for hygiene or safety reasons.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Acceptable Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the Service for illegal, fraudulent, or unauthorized purposes</li>
                <li>Attempt to access restricted systems or data</li>
                <li>Interfere with the operation, security, or integrity of the Service</li>
                <li>Upload malicious code or engage in abusive behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
              <p>
                All content on Babylist—including text, graphics, logos, icons, designs, software, and trademarks—is
                owned by or licensed to Babylist and protected by applicable intellectual property laws. Unauthorized
                use, reproduction, or distribution is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. User Data and Security</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Babylist is committed to protecting user data and maintaining high security standards.</li>
                <li>We use industry-standard security practices such as encryption, secure servers, and access controls.</li>
                <li>User data is protected against unauthorized access, disclosure, alteration, or destruction.</li>
                <li>While no digital system can guarantee absolute security, we continuously monitor and improve our safeguards to protect your information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Privacy</h2>
              <p className="mb-2">
                Your privacy is important to us. Personal data collected through Babylist is handled in accordance with
                our Privacy Policy, which explains:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>What data we collect</li>
                <li>How and why it is used</li>
                <li>How it is protected</li>
                <li>Your rights and choices regarding your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
              <p className="mb-2">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Babylist shall not be liable for indirect, incidental, or consequential damages.</li>
                <li>Babylist’s total liability shall not exceed the amount paid by you for the Service, if any.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at our discretion if you violate these Terms
                or engage in harmful, unlawful, or abusive conduct.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to These Terms</h2>
              <p>
                Babylist may update these Terms from time to time. Any changes will be effective immediately upon posting.
                Continued use of the Service after changes are posted constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and interpreted in accordance with the laws of the applicable jurisdiction
                in which Babylist operates, without regard to conflict of law principles.
              </p>
            </section>

          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Babylist. All rights reserved.
        </div>
      </div>
    </div>
  );
}