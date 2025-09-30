import React from 'react';
import { ChartBarIcon, XIcon, LinkedInIcon, FacebookIcon, RedditIcon } from './icons';

interface FooterProps {
  onNavigate: (tabName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, tabName: string) => {
      e.preventDefault();
      onNavigate(tabName);
  };

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding and Disclaimer */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-emerald-500 mr-3" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Paisabridge</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Empowering your financial journey from loan management to wealth creation.
            </p>
             <p className="text-xs text-slate-500 dark:text-slate-500">
              <strong>Disclaimer:</strong> This is a simulation tool for illustrative purposes only and does not constitute financial advice.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Tools</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Simulator')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Simulator</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Balance Transfer')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Balance Transfer</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Fund Explorer')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Fund Explorer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" onClick={(e) => handleNavClick(e, 'About')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Careers')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Careers</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Contact')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Privacy Policy')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, 'Terms of Service')} className="text-base text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} Paisabridge. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-500 hover:text-emerald-500" aria-label="X (formerly Twitter)"><XIcon className="h-6 w-6" /></a>
            <a href="#" className="text-slate-500 hover:text-emerald-500" aria-label="Reddit"><RedditIcon className="h-6 w-6" /></a>
            <a href="#" className="text-slate-500 hover:text-emerald-500" aria-label="LinkedIn"><LinkedInIcon className="h-6 w-6" /></a>
            <a href="#" className="text-slate-500 hover:text-emerald-500" aria-label="Facebook"><FacebookIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};