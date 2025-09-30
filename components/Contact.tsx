import React from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, BriefcaseIcon, ShieldCheckIcon } from './icons';

export const Contact: React.FC = () => {
    const contactOptions = [
        {
            title: 'General Inquiries',
            description: 'For any general questions, feedback, or partnership opportunities, please reach out to our main team.',
            email: 'contact@paisabridge.com',
            icon: <PaperAirplaneIcon className="w-6 h-6 mr-3" />
        },
        {
            title: 'Careers',
            description: 'Interested in joining our mission? We\'d love to hear from you. Send us your resume and tell us about yourself.',
            email: 'careers@paisabridge.com',
            icon: <BriefcaseIcon className="w-6 h-6 mr-3" />
        },
        {
            title: 'Privacy & Legal',
            description: 'For questions regarding our Privacy Policy, Terms of Service, or any other legal matters.',
            email: 'legal@paisabridge.com',
            icon: <ShieldCheckIcon className="w-6 h-6 mr-3" />
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <EnvelopeIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Contact Us
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    We're here to help. Reach out to us through the appropriate channel below.
                </p>
            </div>

            <div className="space-y-6">
                {contactOptions.map(option => (
                    <div key={option.title} className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-shrink-0 text-emerald-500 mb-4 sm:mb-0 sm:mr-6">
                            {React.cloneElement(option.icon, { className: "w-10 h-10" })}
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{option.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">{option.description}</p>
                            <a 
                                href={`mailto:${option.email}`}
                                className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                {option.icon}
                                {option.email}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};