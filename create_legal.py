import os

base = r"C:\opencode\SYNERGIA\synergia-pnpm\src\app\(legal)"

privacy = """
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
"""

terms = """
export default function TermsAndConditions() {
  return (
    <div className="prose prose-blue max-w-none text-gray-600">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
      <p className="text-sm text-gray-400 mb-8">Last updated: [INSERT DATE]</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
      <p>By accessing and using SYNERGIA, you accept and agree to be bound by these Terms & Conditions.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of SYNERGIA</h3>
      <p>SYNERGIA is an educational tool designed to help teachers form balanced student groups and assist students in managing project tasks and weekly check-ins.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. AI-Generated Suggestions</h3>
      <p>SYNERGIA utilizes artificial intelligence to suggest team formations and provide project coaching. <strong>AI suggestions may be incomplete, biased, or incorrect.</strong> Users are solely responsible for reviewing and verifying AI decisions. Teachers retain final authority over team formation and project grading.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Academic Integrity</h3>
      <p>SYNERGIA is a collaboration tool. It does not guarantee academic outcomes, grades, or project success. Students are expected to uphold the academic integrity policies of their respective institutions.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. User Responsibilities</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Teachers:</strong> Responsible for validating team formations and monitoring actual student progress beyond automated AI health indicators.</li>
        <li><strong>Students:</strong> Responsible for providing accurate skill profiles and truthful weekly check-in data.</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Acceptable Use</h3>
      <p>You agree not to use the platform to submit harassing, abusive, or harmful check-ins, or attempt to manipulate the team-generation algorithm maliciously.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h3>
      <p>SYNERGIA is provided "as is". In no event shall the creators be liable for academic disputes, project failures, or indirect damages arising out of the use of this software.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Governing Law</h3>
      <p>These terms shall be governed by the laws of <strong>[INSERT GOVERNING JURISDICTION]</strong>.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Contact</h3>
      <p>For legal inquiries, contact: <strong>[INSERT LEGAL CONTACT EMAIL]</strong>.</p>
    </div>
  );
}
"""

cookies = """
export default function CookiePolicy() {
  return (
    <div className="prose prose-blue max-w-none text-gray-600">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h2>
      <p className="text-sm text-gray-400 mb-8">Last updated: [INSERT DATE]</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. What are Cookies?</h3>
      <p>Cookies are small text files stored on your device that help web applications remember your state and preferences.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How SYNERGIA Uses Cookies</h3>
      <p>SYNERGIA prioritizes your privacy. We currently only use strictly necessary cookies required for the application to function. <strong>We do not use optional advertising, tracking, or third-party analytics cookies.</strong></p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Categories of Cookies Used</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Strictly Necessary Cookies:</strong> We use authentication cookies (via NextAuth.js) to keep you securely logged into your Teacher or Student account. The application cannot function without these cookies.</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cookie Consent</h3>
      <p>Because SYNERGIA only uses technically necessary cookies required for authentication and security, we do not require a cookie consent banner for optional tracking.</p>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Managing Cookies</h3>
      <p>You can configure your browser to block all cookies; however, doing so will prevent you from logging into the SYNERGIA dashboard.</p>
      
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Contact</h3>
      <p>If you have questions about our limited use of cookies, contact us at: <strong>[INSERT PRIVACY CONTACT EMAIL]</strong>.</p>
    </div>
  );
}
"""

with open(os.path.join(base, "privacy", "page.tsx"), 'w') as f: f.write(privacy)
with open(os.path.join(base, "terms", "page.tsx"), 'w') as f: f.write(terms)
with open(os.path.join(base, "cookies", "page.tsx"), 'w') as f: f.write(cookies)

# also cleanup any old root pages if they exist
old_privacy = r"C:\opencode\SYNERGIA\synergia-pnpm\src\app\privacy.tsx"
if os.path.exists(old_privacy): os.remove(old_privacy)
old_terms = r"C:\opencode\SYNERGIA\synergia-pnpm\src\app\terms.tsx"
if os.path.exists(old_terms): os.remove(old_terms)

print("Created legal pages.")
