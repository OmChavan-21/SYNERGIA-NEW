
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
