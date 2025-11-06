import AnimatedPoster from "@/components/AnimatedPoster";
export const metadata = {
  title: "Privacy Policy | Blogcafeai Free Online Games Website",
  description:
    "Review our privacy policy for Blogcafeai, your go-to site for fun and free online games, browser games, mobile games to play without download, and more fun.",
};

export default function Page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20 max-md:px-4">
      <div className="py-20  px-[20.2rem]  max-lg:px-5 media_resp  max-md:px-0">
        <AnimatedPoster className="h-[45vh]" title="PRIVACY POLICY" />

        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Privacy Policy</h1>
        </div>

        <div className="text-[18px] doc">
          <p className="mb-2">
            Welcome to Blogcafeai.com – your go-to destination for instant, fun, and distraction-free online gaming!
          </p>
          <p className="mb-2">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit or use our platform.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>1. Information We Collect</h2>
          </div>
          <p className="mb-2">
            Blogcafeai.com is designed to offer games without requiring sign-ups, downloads, or logins. However, we may collect certain data automatically to enhance user experience, ensure security, and improve our services.
          </p>
          <div className="mt-4 mb-1 font-semibold text-[22px] text-[#4280bf]">
            <h3>a. Non-Personal Information (Automatically Collected):</h3>
          </div>
          <ul className="list-disc ps-6 mb-4">
            <li>Device type and browser</li>
            <li>IP address and general location (e.g., city or country)</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on site</li>
            <li>Game interactions and preferences</li>
            <li>Referring website or link</li>
          </ul>
          <div className="mt-4 mb-1 font-semibold text-[22px] text-[#4280bf]">
            <h3>b. Cookies and Tracking Technologies:</h3>
          </div>
          <p className="mb-2">We use cookies and similar technologies to:</p>
          <ul className="list-disc ps-6 mb-4">
            <li>Remember your game preferences</li>
            <li>Improve site performance and usability</li>
            <li>Analyze usage data (via tools like Google Analytics)</li>
          </ul>
          <p className="mb-2">
            You can disable cookies in your browser settings, but this may affect some features of the site.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>2. How We Use Your Information</h2>
          </div>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc ps-6 mb-4">
            <li>Deliver and optimize our gaming services</li>
            <li>Understand user behavior to improve the platform</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Monitor performance and fix issues</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mb-2">We do not sell or rent your personal data.</p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>3. Third-Party Services</h2>
          </div>
          <p className="mb-2">
            We may use trusted third-party tools and services (e.g., analytics or advertising networks) that may collect data on our behalf. These third parties are governed by their own privacy policies.
          </p>
          <p className="mb-2">Examples:</p>
          <ul className="list-disc ps-6 mb-4">
            <li>Google Analytics</li>
            <li>Ad networks for displaying game-related ads</li>
          </ul>
          <p className="mb-2">
            We recommend reviewing the privacy policies of these providers for more information.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>4. Data Security</h2>
          </div>
          <p className="mb-2">
            We implement industry-standard security measures to safeguard your information from unauthorized access, loss, misuse, or alteration.
          </p>
          <p className="mb-2">
            However, no method of online transmission or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>5. Children’s Privacy</h2>
          </div>
          <p className="mb-2">
            Blogcafeai.com is intended for users of all ages, including children. We do not knowingly collect personally identifiable information from children under the age of 13. If we learn that we have collected such information without parental consent, we will delete it promptly.
          </p>
          <p className="mb-2">
            Parents and guardians are encouraged to supervise their children’s online activities.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>6. Your Privacy Choices</h2>
          </div>
          <p className="mb-2">You can:</p>
          <ul className="list-disc ps-6 mb-4">
            <li>Disable cookies in your browser</li>
            <li>Use incognito/private browsing</li>
            <li>Contact us to request deletion of any data we may have collected</li>
          </ul>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>7. Updates to This Policy</h2>
          </div>
          <p className="mb-2">
            We may update this Privacy Policy from time to time. When we do, we will revise the “Last Updated” date at the top. We encourage you to review this page periodically for any changes.
          </p>

          <div className="mt-8 mb-2 font-semibold text-[28px] text-[#4280bf]">
            <h2>8. Contact Us</h2>
          </div>
          <p className="mb-2">Have questions or concerns about your privacy?</p>
          <p className="mb-2">Email: help.Blogcafeai@gmail.com</p>
          <p className="mb-2">Website: https://Blogcafeai.com</p>
          <p className="mb-2">We’re here to help!</p>
        </div>
      </div>
    </div>
  );
}
