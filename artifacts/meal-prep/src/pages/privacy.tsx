import { usePageTitle } from "@/hooks/use-page-title";

export default function PrivacyPage() {
  usePageTitle("Privacy Policy", "PrepFit Privacy Policy — how we collect, use, and protect your data.");

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-foreground mb-1">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">
          PrepFit — bestappsmade LLC · Last updated: May 14, 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">1. Overview</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit ("we," "us," or "our") is a web application operated by bestappsmade LLC. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using PrepFit at <a href="https://prepfit.fit" className="text-primary underline">prepfit.fit</a>, you agree to this policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">2. Information We Collect</h2>
        <h3 className="font-semibold text-sm text-foreground">a) Data you provide directly</h3>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Meal plans you create (name, calorie goal, meals per day)</li>
          <li>Meal items generated within your plans</li>
          <li>Food photos you upload for calorie scanning (stored as image data)</li>
          <li>Body weight entries you log (weight, unit, optional notes)</li>
          <li>Water intake logs</li>
          <li>Email address entered when accessing the Stripe billing portal</li>
        </ul>
        <h3 className="font-semibold text-sm text-foreground mt-3">b) Data stored locally on your device</h3>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Trial start date (to track your 3-day free trial)</li>
          <li>Light/dark theme preference</li>
          <li>Daily water glass counts</li>
        </ul>
        <h3 className="font-semibold text-sm text-foreground mt-3">c) Payment information</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Payments are processed by <strong>Stripe, Inc.</strong> PrepFit never sees, stores, or has access to your credit card number, billing address, or full payment details. Stripe's privacy policy applies to all payment data: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">stripe.com/privacy</a>.
        </p>
        <h3 className="font-semibold text-sm text-foreground mt-3">d) AI processing</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Meal plan generation and food photo analysis are powered by OpenAI's API. Photos and meal preferences you submit are sent to OpenAI for processing. OpenAI's privacy policy applies: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">openai.com/privacy</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">3. How We Use Your Information</h2>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>To display your meal plans, weight history, and saved meals within the app</li>
          <li>To generate AI-powered meal plans and grocery lists tailored to your goals</li>
          <li>To analyze food photos and estimate calories using AI</li>
          <li>To manage your subscription and process payments through Stripe</li>
          <li>To remember your preferences (theme, water intake) across sessions</li>
        </ul>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We do not sell your data to third parties. We do not use your data for advertising purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">4. Data Storage & Security</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your meal plans, weight entries, and saved meals are stored in a secure PostgreSQL database hosted on Replit's infrastructure. Local preferences (theme, water, trial status) are stored in your browser's localStorage and never transmitted to our servers.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We take reasonable technical measures to protect your data, but no internet transmission is 100% secure. Use PrepFit at your own risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">5. Data Retention</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your data is retained as long as you use the app. You can delete individual meal plans, saved meals, and weight entries directly within the app at any time. To request full deletion of all your data, contact us at the email below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">6. Cookies</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit does not use tracking cookies or analytics cookies. We use browser localStorage (not cookies) to store your preferences. Stripe may set cookies as part of the payment process; see Stripe's policy for details.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">7. Children's Privacy</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us and we will delete it promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">8. Your Rights</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Depending on your location, you may have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, contact us at the email below. We will respond within 30 days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">9. Changes to This Policy</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. Continued use of PrepFit after changes means you accept the updated policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">10. Contact Us</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          For any privacy questions or data deletion requests, contact:<br />
          <strong>bestappsmade LLC</strong><br />
          <a href="mailto:privacy@prepfit.fit" className="text-primary underline">privacy@prepfit.fit</a>
        </p>
      </section>
    </div>
  );
}
