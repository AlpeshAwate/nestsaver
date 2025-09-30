import React from 'react';
import { DocumentTextIcon } from './icons';

export const TermsOfService: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <DocumentTextIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Terms of Service
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the NestSaver application (the "Service") operated by us.</p>
                <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">1. Use of Our Services</h2>
                    <p>You agree to use our Service for its intended purpose of financial simulation and education. You are responsible for the accuracy of the data you provide. You must not use our Service for any illegal or unauthorized purpose.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">2. Disclaimer of Financial Advice</h2>
                    <p><strong>NestSaver is a financial simulation and educational tool, not a financial advisor.</strong> The information, calculations, and strategies provided by the Service are for illustrative and informational purposes only. They do not constitute financial, investment, legal, or tax advice. You should consult with a qualified professional before making any financial decisions.</p>
                    <p>We do not guarantee the accuracy, completeness, or suitability of any information provided by the Service. Your financial situation is unique, and any decisions you make based on information from our Service are your sole responsibility.</p>
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">3. Accounts</h2>
                    <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">4. Limitation of Liability</h2>
                    <p>In no event shall NestSaver, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">5. Changes</h2>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at: <a href="mailto:legal@nestsaver.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">legal@nestsaver.com</a></p>
                </section>
            </div>
        </div>
    );
};