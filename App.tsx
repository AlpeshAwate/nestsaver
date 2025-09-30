import React, { useState, useEffect } from 'react';
// FIX: Changed import to use scoped @firebase/auth package
import { onAuthStateChanged, User } from '@firebase/auth';
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Header } from './components/Header';
import { Simulator } from './components/Simulator';
import { FinGptAssistant } from './components/FinGptAssistant';
import { SimulationInput, SavedScenario, UserProfile, ModalTab } from './types';
import { BanknotesIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon, BookmarkSquareIcon, RocketLaunchIcon } from './components/icons';
import { SavedScenarios } from './components/SavedScenarios';
import { auth, db } from './services/firebase';
import { AuthModal } from './components/AuthModal';
import { InterestRateInsightsModal } from './components/InterestRateInsightsModal';
import { BalanceTransfer } from './components/BalanceTransfer';
import { FundExplorer } from './components/FundExplorer';
import { Footer } from './components/Footer';
import { CoPilot } from './components/Roadmap';
import { About } from './components/About';
import { Careers } from './components/Careers';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { Contact } from './components/Contact';

// To test features that require login, set this to `true`.
// This will bypass Firebase Auth and log in a dummy user.
const DEV_MODE_DUMMY_USER = true;


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
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isFinGptOpen, setFinGptOpen] = useState(false);
  const [isInsightsModalOpen, setInsightsModalOpen] = useState(false);
  const [insightsInitialTab, setInsightsInitialTab] = useState<ModalTab>('learn');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
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

  useEffect(() => {
    if (DEV_MODE_DUMMY_USER) {
      console.log("DEV MODE: Bypassing Firebase Auth and setting dummy user.");
      const dummyUser: User = {
        uid: 'dummy-uid-for-dev',
        email: 'dev@paisabridge.com',
      } as unknown as User; // Cast to User type for dev purposes

      const dummyProfile: UserProfile = {
        name: 'Dev User',
        email: 'dev@paisabridge.com',
        createdAt: new Date(),
      };

      setUser(dummyUser);
      setUserProfile(dummyProfile);
      setSavedScenarios([]); // Ensure no scenarios are loaded for the dummy user
      setLoadingAuth(false);
      return; // Skip real auth listener
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
        
        // Fetch saved scenarios
        const scenariosQuery = query(collection(db, `users/${currentUser.uid}/scenarios`), orderBy('savedAt', 'desc'));
        const querySnapshot = await getDocs(scenariosQuery);
        const scenarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedScenario));
        setSavedScenarios(scenarios);

      } else {
        setUserProfile(null);
        setSavedScenarios([]); // Clear scenarios on logout
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenInsightsModal = (initialTab: ModalTab = 'learn') => {
    setInsightsInitialTab(initialTab);
    setInsightsModalOpen(true);
  };

  const TABS = [
    { name: 'Simulator', icon: <BanknotesIcon className="w-5 h-5 mr-2" /> },
    { name: 'Co-Pilot', icon: <RocketLaunchIcon className="w-5 h-5 mr-2" /> },
    { name: 'Balance Transfer', icon: <ArrowsRightLeftIcon className="w-5 h-5 mr-2" /> },
    { name: 'Fund Explorer', icon: <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> },
    { name: 'Saved Scenarios', icon: <BookmarkSquareIcon className="w-5 h-5 mr-2" /> },
  ];

  const handleSaveScenario = async () => {
    if (!user) {
        openAuthModal('login');
        return;
    }
    const scenarioName = prompt("Enter a name for this scenario:", `Scenario - ${new Date().toLocaleDateString()}`);
    if (scenarioName) {
      const newScenarioData = {
        ...inputs,
        name: scenarioName,
        savedAt: serverTimestamp(),
      };
      const scenariosCollectionRef = collection(db, `users/${user.uid}/scenarios`);
      const docRef = await addDoc(scenariosCollectionRef, newScenarioData);

      const newScenario: SavedScenario = {
        ...newScenarioData,
        id: docRef.id,
        savedAt: new Date().toISOString(), // Use client-side date for immediate UI update
      };

      setSavedScenarios(prev => [newScenario, ...prev]);
    }
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    const { id, name, savedAt, ...scenarioInputs } = scenario;
    setInputs(scenarioInputs);
    setActiveTab('Simulator');
  };
  
  const handleDeleteScenario = async (id: string) => {
     if (!user) return;
    if (window.confirm("Are you sure you want to delete this scenario?")) {
        const scenarioDocRef = doc(db, `users/${user.uid}/scenarios`, id);
        await deleteDoc(scenarioDocRef);
        setSavedScenarios(prev => prev.filter(s => s.id !== id));
    }
  };
  
  const handleSelectFund = (rate: number) => {
    setInputs(prev => ({ ...prev, sipReturnRate: rate }));
    setActiveTab('Simulator');
  };

  if (loadingAuth) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col">
      <Header 
        user={user} 
        userProfile={userProfile} 
        onLogin={() => openAuthModal('login')} 
        onSignUp={() => openAuthModal('signup')} 
        theme={theme} 
        setTheme={handleSetTheme}
        onRepoRateClick={() => handleOpenInsightsModal('learn')}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
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
            onSave={handleSaveScenario}
            defaultValues={DEFAULTS}
            user={user}
            onLoginRequest={() => openAuthModal('login')}
            onRenegotiateRequest={() => setFinGptOpen(true)}
            onBalanceTransferRequest={() => setActiveTab('Balance Transfer')}
            onTaxInsightsRequest={() => handleOpenInsightsModal('tax')}
            theme={theme}
          />
        )}
        {activeTab === 'Co-Pilot' && (
          <CoPilot inputs={inputs} />
        )}
        {activeTab === 'Balance Transfer' && (
          <BalanceTransfer 
            currentLoan={inputs}
            onApplyOffer={(newRate) => {
              setInputs(prev => ({...prev, interestRate: newRate}));
              setActiveTab('Simulator');
            }}
          />
        )}
        {activeTab === 'Saved Scenarios' && (
            <SavedScenarios 
                scenarios={savedScenarios}
                onLoad={handleLoadScenario}
                onDelete={handleDeleteScenario}
                user={user}
                onLoginRequest={() => openAuthModal('login')}
            />
        )}
        {activeTab === 'Fund Explorer' && (
          <FundExplorer onSelectFund={handleSelectFund} />
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
      <FinGptAssistant 
        simulationInputs={inputs}
        isOpen={isFinGptOpen}
        onOpen={() => setFinGptOpen(true)}
        onClose={() => setFinGptOpen(false)}
      />
      {isAuthModalOpen && <AuthModal mode={authMode} onClose={() => setAuthModalOpen(false)} />}
      <InterestRateInsightsModal 
        isOpen={isInsightsModalOpen}
        onClose={() => setInsightsModalOpen(false)}
        userInterestRate={inputs.interestRate}
        principal={inputs.principal}
        onSwitchTab={setActiveTab}
        initialTab={insightsInitialTab}
      />
    </div>
  );
};

export default App;