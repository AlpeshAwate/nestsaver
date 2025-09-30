import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Simulator } from './components/Simulator';
import { SimulationInput, ModalTab } from './types';
import { BanknotesIcon } from './components/icons';
import { InterestRateInsightsModal } from './components/InterestRateInsightsModal';
import { Footer } from './components/Footer';
import { About } from './components/About';
import { Careers } from './components/Careers';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { Contact } from './components/Contact';
import { GoogleAd } from './components/GoogleAd';
import { FinGptAssistant } from './components/FinGptAssistant';

const DEFAULTS: SimulationInput = {
  principal: 3000000,
  interestRate: 8.5,
  tenureYears: 30,
  monthlyEMI: 0,
  extraAnnualPrepayment: 0,
  monthlySIP: 0,
  sipReturnRate: 12,
  inflationRate: 6,
};

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Simulator');
  const [inputs, setInputs] = useState<SimulationInput>(DEFAULTS);
  const [isInsightsModalOpen, setInsightsModalOpen] = useState(false);
  const [insightsInitialTab, setInsightsInitialTab] = useState<ModalTab>('learn');
  const [showAd, setShowAd] = useState(true);
  const [isFinGptOpen, setFinGptOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  );

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleOpenInsightsModal = (initialTab: ModalTab = 'learn') => {
    setInsightsInitialTab(initialTab);
    setInsightsModalOpen(true);
  };

  const TABS = [
    { name: 'Simulator', icon: <BanknotesIcon className="w-5 h-5 mr-2" /> },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col">
      <Header 
        theme={theme} 
        setTheme={handleSetTheme}
        onRepoRateClick={() => handleOpenInsightsModal('learn')}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {showAd && (
          <div className="mb-8">
            <GoogleAd onClose={() => setShowAd(false)} />
          </div>
        )}
        
        <div className="mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`${
                    activeTab === tab.name
                      ? 'border-emerald-500 text-emerald-500'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'Simulator' && (
          <Simulator 
            inputs={inputs}
            onInputsChange={setInputs}
            defaultValues={DEFAULTS}
            onTaxInsightsRequest={() => handleOpenInsightsModal('tax')}
            theme={theme}
          />
        )}
        {activeTab === 'About' && (
          <About onNavigate={setActiveTab} />
        )}
        {activeTab === 'Careers' && (
          <Careers />
        )}
        {activeTab === 'Privacy Policy' && (
          <PrivacyPolicy />
        )}
        {activeTab === 'Terms of Service' && (
          <TermsOfService />
        )}
        {activeTab === 'Contact' && (
          <Contact />
        )}
      </main>
      <Footer onNavigate={setActiveTab} />
      <InterestRateInsightsModal 
        isOpen={isInsightsModalOpen}
        onClose={() => setInsightsModalOpen(false)}
        userInterestRate={inputs.interestRate}
        principal={inputs.principal}
        onSwitchTab={setActiveTab}
        initialTab={insightsInitialTab}
      />
      <FinGptAssistant 
        simulationInputs={inputs}
        isOpen={isFinGptOpen}
        onOpen={() => setFinGptOpen(true)}
        onClose={() => setFinGptOpen(false)}
      />
    </div>
  );
};

export default App;