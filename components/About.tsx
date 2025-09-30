import React from 'react';
import { ChartBarIcon, RocketLaunchIcon, LightBulbIcon } from './icons';

interface AboutProps {
    onNavigate: (tabName: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <ChartBarIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Meet NestSaver
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Your partner in transforming debt into a bridge towards financial freedom.
                </p>
            </div>

            <div className="space-y-12 text-slate-700 dark:text-slate-300">
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                        <RocketLaunchIcon className="w-7 h-7 mr-3 text-emerald-500" />
                        Our "Clear Loan Early" Mission
                    </h2>
                    <p className="mb-4">
                        At our core, we are driven by a single, powerful mission: <strong>to help you clear your loans early.</strong> We believe that a loan shouldn't be a lifelong burden, but a temporary stepping stone. For too long, managing a loan has been a passive, often confusing, process. We're here to change that.
                    </p>
                    <p>
                        We started by building powerful, intuitive tools to give you clarity. Our <span className="font-semibold text-emerald-600 dark:text-emerald-400">real-time simulator</span> lets you see the future, showing you exactly how small changes like prepayments or investments can shave years off your loan and save you lakhs in interest. We're focused on providing the best simulation experience to empower your financial decisions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                        <LightBulbIcon className="w-7 h-7 mr-3 text-emerald-500" />
                        Our Philosophy
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">Clarity</h3>
                            <p className="text-sm">We cut through the jargon to make complex financial decisions simple and transparent. No more guesswork.</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">Proactivity</h3>
                            <p className="text-sm">We believe in being one step ahead. Our tools don't just react; they anticipate and guide you towards better outcomes.</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">Empowerment</h3>
                            <p className="text-sm">We provide the knowledge, confidence, and technology for you to take decisive control of your financial future.</p>
                        </div>
                    </div>
                </section>
                
                 <section className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        Join Us on the Journey
                    </h2>
                    <p className="mb-6">
                        Whether you're just starting your loan or are years in, it's never too late to optimize your path to being debt-free. Explore the simulator and see what's possible.
                    </p>
                    <button 
                        onClick={() => onNavigate('Simulator')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
                    >
                        Start Simulating
                    </button>
                </section>
            </div>
        </div>
    );
};