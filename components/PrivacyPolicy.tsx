import React from 'react';
import { ShieldCheckIcon } from './icons';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <ShieldCheckIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Privacy Policy
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <p>Welcome to NestSaver. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
                
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Information We Collect</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the application.</li>
                        <li><strong>Financial Data:</strong> Data related to your financial situation, such as loan principal, interest rates, and tenure, that you input into our simulator. This information is used to provide the service and is not used for any other purpose.</li>
                        <li><strong>Usage Data:</strong> We may automatically collect information about your device and how you use the application (such as features used).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">How We Use Your Information</h2>
                    <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                     <ul className="list-disc pl-6 space-y-2">
                        <li>Create and manage your account.</li>
                        <li>Provide you with the core simulation and financial co-pilot services.</li>
                        <li>Analyze usage and trends to improve our application.</li>
                        <li>Communicate with you regarding your account or our services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Data Security</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                </section>
                
                 <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Third-Party Services</h2>
                    <p>Our application uses third-party services for functionality, such as Firebase for authentication and database management, and Google's Gemini API for AI-powered features. We recommend you review their privacy policies.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@nestsaver.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">privacy@nestsaver.com</a></p>
                </section>
            </div>
        </div>
    );
};