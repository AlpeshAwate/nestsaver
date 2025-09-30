

import React, { useState, useEffect } from 'react';
// FIX: Changed import to use scoped @firebase/auth package
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    AuthError 
} from '@firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { XMarkIcon, ExclamationTriangleIcon } from './icons';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose }) => {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'signup') {
        if (!name) {
          setError('Please enter your name.');
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (e) {
      const authError = e as AuthError;
      setError(getFriendlyErrorMessage(authError.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Welcome to NestSaver</h2>
            <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-2 bg-slate-100 dark:bg-slate-900/50">
            <div className="flex justify-center">
                <button 
                    onClick={() => setActiveTab('login')} 
                    className={`flex-1 py-2 text-center font-semibold rounded-t-md transition-colors ${activeTab === 'login' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    Log In
                </button>
                <button 
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-2 text-center font-semibold rounded-t-md transition-colors ${activeTab === 'signup' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    Sign Up
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 p-3 rounded-md text-sm flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-3 flex-shrink-0"/>
                {error}
            </div>
          )}
          {activeTab === 'signup' && (
             <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5" htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
            </div>
          )}
          <div>
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5" htmlFor="email">Email</label>
             <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          <div>
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5" htmlFor="password">Password</label>
             <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark