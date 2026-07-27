'use me';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, Company, Deal, Task, Note, Invoice, Activity, DealStage } from '../types';
import { initialContacts, initialCompanies, initialDeals, initialTasks, initialNotes, initialInvoices, initialActivities } from '../mockData';
import { useAuth } from '../auth/auth-context';

interface CRMContextType {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  notes: Note[];
  invoices: Invoice[];
  activities: Activity[];
  
  // Actions
  addContact: (contact: Omit<Contact, 'id' | 'created_at'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  addCompany: (company: Omit<Company, 'id' | 'created_at'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addDeal: (deal: Omit<Deal, 'id' | 'created_at'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  deleteDeal: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  addNote: (note: Omit<Note, 'id' | 'created_at'>) => void;
  deleteNote: (id: string) => void;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at'>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;

  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  updateContactAISummary: (contactId: string, summary: string) => void;
  updateDealAIScore: (dealId: string, score: number) => void;
  resetDemoData: () => void;
  loadSampleDatasetForAccount: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'demo_guest';
  const STORAGE_KEY = `avex_crm_state_v2_${userId}`;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize state from local storage or fresh workspace per user account
  useEffect(() => {
    setIsLoaded(false);
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setContacts(parsed.contacts || []);
        setCompanies(parsed.companies || []);
        setDeals(parsed.deals || []);
        setTasks(parsed.tasks || []);
        setNotes(parsed.notes || []);
        setInvoices(parsed.invoices || []);
        setActivities(parsed.activities || []);
      } else {
        // If it's default demo user load initial mock data, otherwise start fresh account
        if (userId === 'usr_demo_alex' || userId === 'demo_guest') {
          setContacts(initialContacts);
          setCompanies(initialCompanies);
          setDeals(initialDeals);
          setTasks(initialTasks);
          setNotes(initialNotes);
          setInvoices(initialInvoices);
          setActivities(initialActivities);
        } else {
          // Fresh workspace for new account
          setContacts([]);
          setCompanies([]);
          setDeals([]);
          setTasks([]);
          setNotes([]);
          setInvoices([]);
          setActivities([]);
        }
      }
    } catch (e) {
      console.warn('Failed to load CRM state from localStorage:', e);
      setContacts([]);
      setCompanies([]);
      setDeals([]);
      setTasks([]);
      setNotes([]);
      setInvoices([]);
      setActivities([]);
    }
    setIsLoaded(true);
  }, [STORAGE_KEY, userId]);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = { contacts, companies, deals, tasks, notes, invoices, activities };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to persist CRM state:', e);
    }
  }, [contacts, companies, deals, tasks, notes, invoices, activities, isLoaded, STORAGE_KEY]);

  // Actions
  const addContact = (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    const newContact: Contact = {
      ...contactData,
      id: 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setContacts(prev => [newContact, ...prev]);

    // Log Activity
    addActivity({
      contact_id: newContact.id,
      type: 'status_change',
      title: 'Contact Created',
      description: `Added ${newContact.name} as a new ${newContact.status}.`,
    });
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addCompany = (companyData: Omit<Company, 'id' | 'created_at'>) => {
    const newCompany: Company = {
      ...companyData,
      id: 'co' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setCompanies(prev => [newCompany, ...prev]);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(co => co.id === id ? { ...co, ...updates, updated_at: new Date().toISOString() } : co));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(co => co.id !== id));
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'created_at'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: 'd' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setDeals(prev => [newDeal, ...prev]);

    if (newDeal.contact_id) {
      addActivity({
        contact_id: newDeal.contact_id,
        deal_id: newDeal.id,
        type: 'status_change',
        title: `Deal Created: ${newDeal.title}`,
        description: `New deal worth $${newDeal.value.toLocaleString()} added to ${newDeal.stage} stage.`,
      });
    }
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
  };

  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals(prev => {
      const deal = prev.find(d => d.id === dealId);
      if (!deal || deal.stage === newStage) return prev;

      if (deal.contact_id) {
        addActivity({
          contact_id: deal.contact_id,
          deal_id: deal.id,
          type: 'status_change',
          title: `Deal Stage Updated`,
          description: `Moved "${deal.title}" to ${newStage.toUpperCase()} stage.`,
        });
      }

      return prev.map(d => d.id === dealId ? { ...d, stage: newStage, updated_at: new Date().toISOString() } : d);
    });
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    const newTask: Task = {
      ...taskData,
      id: 't' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return { ...t, status: nextStatus, updated_at: new Date().toISOString() };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'created_at'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'n' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);

    if (newNote.entity_type === 'contact') {
      addActivity({
        contact_id: newNote.entity_id,
        type: 'note_added',
        title: 'Note Added',
        description: `"${newNote.content.substring(0, 50)}${newNote.content.length > 50 ? '...' : ''}"`,
      });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'created_at'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: 'i' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: new Date().toISOString(),
    };
    setInvoices(prev => [newInvoice, ...prev]);

    if (newInvoice.client_id) {
      addActivity({
        contact_id: newInvoice.client_id,
        type: 'invoice_created',
        title: `Invoice Issued: ${newInvoice.invoice_number}`,
        description: `Issued invoice for $${newInvoice.total.toLocaleString()} (${newInvoice.status}).`,
      });
    }
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status, updated_at: new Date().toISOString() } : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: 'a' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const updateContactAISummary = (contactId: string, summary: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, ai_summary: summary } : c));
  };

  const updateDealAIScore = (dealId: string, score: number) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ai_score: score } : d));
  };

  const resetDemoData = () => {
    setContacts([]);
    setCompanies([]);
    setDeals([]);
    setTasks([]);
    setNotes([]);
    setInvoices([]);
    setActivities([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadSampleDatasetForAccount = () => {
    setContacts(initialContacts);
    setCompanies(initialCompanies);
    setDeals(initialDeals);
    setTasks(initialTasks);
    setNotes(initialNotes);
    setInvoices(initialInvoices);
    setActivities(initialActivities);
  };

  return (
    <CRMContext.Provider
      value={{
        contacts,
        companies,
        deals,
        tasks,
        notes,
        invoices,
        activities,
        addContact,
        updateContact,
        deleteContact,
        addCompany,
        updateCompany,
        deleteCompany,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        addNote,
        deleteNote,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addActivity,
        updateContactAISummary,
        updateDealAIScore,
        resetDemoData,
        loadSampleDatasetForAccount,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
