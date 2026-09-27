
export default function PrivacyPolicy() {
  return (
    <div className="prose prose-blue max-w-none text-gray-600">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
      <p className="text-sm text-gray-400 mb-8">Last updated: [INSERT DATE]</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h3>
      <p>This Privacy Policy explains how SYNERGIA collects, uses, and discloses information when you use our AI-powered team formation and project management platform. Our goal is to facilitate balanced college group projects while protecting your privacy.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Information Students Provide:</strong> Name, email, skills, interests, and preferred roles entered into your profile.</li>
        <li><strong>Information Teachers Provide:</strong> Project descriptions, required skills, and required roles.</li>
        <li><strong>Task & Check-in Information:</strong> Weekly check-in submissions, reported hours, blockers, and task completion statuses.</li>
        <li><strong>Technical Information:</strong> Basic authentication tokens and session data via NextAuth.</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Why We Use Information</h3>
      <p>We use the collected information exclusively to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Authenticate your account securely.</li>
        <li>Match students into balanced teams based on skills and requirements.</li>
        <li>Track project tasks and milestones.</li>
        <li>Provide AI-generated coaching and feedback based on weekly check-ins.</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. AI Processing</h3>
      <p>SYNERGIA utilizes artificial intelligence to process project data. Your profile information, project requirements, and weekly check-ins are sent securely to our AI provider ([INSERT AI PROVIDER, e.g., Google Gemini]) to generate team suggestions and coaching feedback.</p>
      <p><em>Note: AI recommendations are suggestions only and are not authoritative judgments of student capability.</em></p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Data Sharing</h3>
      <p>We do not sell your personal data. Data is only shared with our infrastructure providers (e.g., database hosting) and our AI provider for the sole purpose of operating the application.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h3>
      <p>We implement standard security practices including password hashing (bcrypt), secure session management, and encrypted API transit (HTTPS). While we strive to protect your data, no internet transmission is guaranteed to be completely secure.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h3>
      <p>Project data is retained for [INSERT RETENTION PERIOD, e.g., the duration of the academic semester] to allow teachers and students to review their progress, after which it may be deleted or anonymized.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. User Rights</h3>
      <p>Depending on your jurisdiction (e.g., under the DPDP Act 2023 in India, GDPR, or CCPA), you may have rights to access, correct, or delete your personal data. Please contact us to exercise these rights.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Contact</h3>
      <p>If you have questions about this policy, please contact us at: <strong>[INSERT PRIVACY CONTACT EMAIL]</strong>.</p>
    </div>
  );
}
