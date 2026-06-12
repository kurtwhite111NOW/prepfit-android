import { usePageTitle } from "@/hooks/use-page-title";

export default function PrivacyPage() {
  usePageTitle("Privacy Policy", "PrepFit Privacy Policy — how we collect, use, and protect your data.");

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-foreground mb-1">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">
          PrepFit — bestappsmade LLC · Last updated: June 11, 2026
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Applies to: PrepFit web app (prepfit.fit) and PrepFit Android app (Google Play, package: com.prepfit.app)
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">1. Overview</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit ("we," "us," or "our") is a fitness and meal prep application operated by bestappsmade LLC. This Privacy Policy explains what information we collect, how we use it, and the choices you have. It applies to both the PrepFit web application at{" "}
          <a href="https://prepfit.fit" className="text-primary underline">prepfit.fit</a> and the PrepFit Android app available on Google Play. By using either version of PrepFit, you agree to this policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">2. Information We Collect</h2>

        <h3 className="font-semibold text-sm text-foreground">a) Data you provide directly</h3>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Meal plans you create (name, calorie goal, meals per day)</li>
          <li>Meal items generated within your plans</li>
          <li>Food photos you upload or capture for calorie scanning (stored as image data)</li>
          <li>Body weight entries you log (weight, unit, optional notes)</li>
          <li>Water intake logs</li>
          <li>Account information (email address) provided when signing in via Clerk</li>
        </ul>

        <h3 className="font-semibold text-sm text-foreground mt-3">b) Data stored locally on your device</h3>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Light/dark theme preference</li>
          <li>Daily water glass counts</li>
          <li><strong>Android app only:</strong> subscription status cached by RevenueCat SDK</li>
        </ul>

        <h3 className="font-semibold text-sm text-foreground mt-3">c) Camera and photo library access (Android app)</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The Android app requests access to your device camera and photo library solely to let you capture or select meal photos for AI calorie analysis. Photos are sent to OpenAI for processing and, if you choose to save them, stored in our database. We do not access your camera or photos for any other purpose.
        </p>

        <h3 className="font-semibold text-sm text-foreground mt-3">d) Payment information</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong>Web app:</strong> Payments are processed by <strong>Stripe, Inc.</strong> PrepFit never sees, stores, or has access to your credit card number or full payment details. Stripe's privacy policy applies:{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">stripe.com/privacy</a>.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong>Android app:</strong> In-app subscriptions are managed entirely by <strong>Google Play Billing</strong>. PrepFit never sees your payment card details. Google Play's privacy policy applies:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">policies.google.com/privacy</a>. Subscription status is tracked via <strong>RevenueCat, Inc.</strong>; their privacy policy applies:{" "}
          <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">revenuecat.com/privacy</a>.
        </p>

        <h3 className="font-semibold text-sm text-foreground mt-3">e) Authentication</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign-in is handled by <strong>Clerk, Inc.</strong> Clerk collects your email address and manages authentication on our behalf. Clerk's privacy policy applies:{" "}
          <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">clerk.com/privacy</a>.
        </p>

        <h3 className="font-semibold text-sm text-foreground mt-3">f) AI processing</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Meal plan generation, grocery list generation, and food photo analysis are powered by <strong>OpenAI's API</strong>. Meal preferences and food photos you submit are sent to OpenAI for processing and are subject to OpenAI's privacy policy:{" "}
          <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">openai.com/privacy</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">3. How We Use Your Information</h2>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>To display your meal plans, weight history, water logs, and saved meals within the app</li>
          <li>To generate AI-powered meal plans and grocery lists tailored to your goals</li>
          <li>To analyze food photos and estimate calories using AI</li>
          <li>To manage your subscription and verify access to premium features</li>
          <li>To remember your preferences (theme, water intake) across sessions</li>
        </ul>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We do not sell your data to third parties. We do not use your data for advertising purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">4. Data Storage &amp; Security</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your meal plans, weight entries, water logs, and saved meals are stored in a secure PostgreSQL database. Local preferences are stored on your device and never transmitted to our servers.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We take reasonable technical measures to protect your data, but no internet transmission is 100% secure. Use PrepFit at your own risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">5. Data Retention</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your data is retained as long as you use the app. You can delete individual meal plans, saved meals, and weight entries directly within the app at any time. To request full deletion of all your data, contact us at the email below and we will action it within 30 days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">6. Permissions (Android App)</h2>
        <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li><strong>Camera</strong> — used only to capture meal photos for calorie analysis. Never used for any other purpose.</li>
          <li><strong>Photo Library / Storage</strong> — used only to let you select existing photos for calorie analysis.</li>
          <li><strong>Internet</strong> — required to sync your data, generate AI meal plans, and process payments.</li>
        </ul>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You can revoke camera and photo permissions at any time in your Android device Settings → Apps → PrepFit → Permissions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">7. Cookies &amp; Tracking</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit does not use tracking cookies or advertising cookies. The web app uses browser localStorage (not cookies) to store your preferences. The Android app uses device storage for the same purpose. Clerk, Stripe, Google Play, and RevenueCat may collect usage data governed by their own privacy policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">8. Children's Privacy</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PrepFit is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us data, please contact us and we will delete it promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">9. Your Rights</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Depending on your location, you may have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, contact us at the email below. We will respond within 30 days.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong>Android subscriptions:</strong> To cancel your PrepFit subscription, go to Google Play → Subscriptions → PrepFit → Cancel. Refund requests are handled by Google Play under their refund policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">10. Changes to This Policy</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of PrepFit after changes means you accept the updated policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-lg text-foreground">11. Contact Us</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          For any privacy questions or data deletion requests, contact:<br />
          <strong>bestappsmade LLC</strong><br />
          <a href="mailto:privacy@prepfit.fit" className="text-primary underline">privacy@prepfit.fit</a>
        </p>
      </section>
    </div>
  );
}
