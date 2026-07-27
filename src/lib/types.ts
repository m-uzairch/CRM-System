// Avex CRM TypeScript Type Definitions

export type ContactStatus = 'lead' | 'active' | 'client' | 'inactive';
export type DealStage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type EntityType = 'contact' | 'company' | 'deal' | 'invoice';

export interface Company {
  id: string;
  user_id?: string;
  name: string;
  industry?: string;
  website?: string;
  size?: string;
  notes?: string;
  logo_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  user_id?: string;
  company_id?: string;
  company_name?: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  source: string;
  status: ContactStatus;
  owner: string;
  avatar_url?: string;
  ai_summary?: string;
  created_at: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  user_id?: string;
  contact_id?: string;
  contact_name?: string;
  company_id?: string;
  company_name?: string;
  title: string;
  stage: DealStage;
  value: number;
  currency: string;
  expected_close_date: string;
  ai_score: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  related_to_type?: 'contact' | 'deal' | 'invoice';
  related_to_id?: string;
  related_to_title?: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  reminder_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  user_id?: string;
  entity_type: EntityType;
  entity_id: string;
  content: string;
  author: string;
  created_at: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Invoice {
  id: string;
  user_id?: string;
  invoice_number: string;
  client_id?: string;
  client_name?: string;
  client_email?: string;
  company_id?: string;
  company_name?: string;
  line_items: InvoiceLineItem[];
  tax_rate: number;
  discount: number;
  subtotal: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  user_id?: string;
  contact_id?: string;
  deal_id?: string;
  type: 'call' | 'email' | 'meeting' | 'status_change' | 'note_added' | 'invoice_created';
  title: string;
  description: string;
  timestamp: string;
}

export interface AISummaryRequest {
  contactName: string;
  activities: Activity[];
  notes: Note[];
}

export interface AISummaryResponse {
  summary: string;
  keyInsights?: string[];
}

export interface AILeadScoreRequest {
  contact: Contact;
  activities: Activity[];
  deals: Deal[];
}

export interface AILeadScoreResponse {
  score: number;
  rating: 'Hot' | 'Warm' | 'Cold';
  breakdown: {
    recencyScore: number;
    dealValueScore: number;
    activityVolumeScore: number;
  };
  recommendations: string[];
}
