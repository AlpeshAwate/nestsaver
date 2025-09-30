import React from 'react';
import { BriefcaseIcon, PaperAirplaneIcon } from './icons';

export const Careers: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <BriefcaseIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Join Our Mission
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Help us build the future of financial wellness in India.
                </p>
            </div>

            <div className="space-y-8 text-center text-slate-700 dark:text-slate-300">
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                        No Current Openings
                    </h2>
                    <p className="max-w-2xl mx-auto mb-6">
                        While we don't have any specific roles open at the moment, we're a growing team and are always on the lookout for passionate and talented individuals who believe in our "Clear Loan Early" mission.
                    </p>
                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        We would love to know about you!
                    </p>
                </section>
                
                <section className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        Get in Touch
                    </h2>
                    <p className="mb-6 max-w-2xl mx-auto">
                        If you're excited by what we're building at NestSaver and think you could make a great contribution, please send your resume and a brief note about yourself to our team. We'll keep your information on file and reach out when a suitable role opens up.
                    </p>
                    <a 
                        href="mailto:careers@nestsaver.com?subject=Spontaneous Application"
                        className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
                    >
                        <PaperAirplaneIcon className="w-5 h-5 mr-3" />
                        Email Us Your Resume
                    </a>
                </section>
            </div>
        </div>
    );
};