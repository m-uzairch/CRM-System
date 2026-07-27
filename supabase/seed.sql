-- Avex CRM Supabase Seed SQL
-- Initial sample data for demonstration & testing

-- Companies
INSERT INTO public.companies (id, name, industry, website, size, notes) VALUES
('c1000000-0000-0000-0000-000000000001', 'Apex Design Labs', 'Design Agency', 'https://apexlabs.io', '11-50', 'High growth UI/UX creative studio in NYC.'),
('c1000000-0000-0000-0000-000000000002', 'Vortex Software', 'Enterprise SaaS', 'https://vortexsoft.com', '51-200', 'Cloud infrastructure provider seeking frontend overhaul.'),
('c1000000-0000-0000-0000-000000000003', 'Lumina Health', 'Digital Health', 'https://luminahealth.co', '1-10', 'Healthtech startup launching new patient mobile portal.');

-- Contacts
INSERT INTO public.contacts (id, company_id, name, email, phone, tags, source, status, owner, avatar_url, ai_summary) VALUES
('c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Elena Rostova', 'elena@apexlabs.io', '+1 (555) 234-5678', ARRAY['VIP', 'Design Lead', 'Agency'], 'Inbound Web', 'active', 'Alex Avex', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Elena is leading the digital rebranding project. Requested a revised design system scope with launch target set for next month.'),
('c2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Marcus Vance', 'marcus@vortexsoft.com', '+1 (555) 876-5432', ARRAY['Enterprise', 'CTO'], 'LinkedIn Outreach', 'lead', 'Sarah Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Evaluated technical requirements for frontend architecture refactor. Proposal sent and awaiting security audit feedback.'),
('c2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Sophia Lin', 'sophia@luminahealth.co', '+1 (555) 901-2345', ARRAY['Startup', 'Founder'], 'Referral', 'client', 'Alex Avex', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Recently signed retainer contract for 6-month product build. Kickoff scheduled for next Tuesday.');

-- Deals
INSERT INTO public.deals (id, contact_id, company_id, title, stage, value, currency, expected_close_date, ai_score, notes) VALUES
('d3000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Aptitude Brand Refresh & Design System', 'proposal', 18500.00, 'USD', '2026-08-15', 88, 'Includes component library, pitch deck design, and marketing website.'),
('d3000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Vortex Next.js Cloud Portal Refactor', 'negotiation', 42000.00, 'USD', '2026-08-30', 74, 'Final negotiation phase for enterprise SLA and support retainer.'),
('d3000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Lumina Mobile Health App MVP', 'won', 29000.00, 'USD', '2026-07-20', 95, 'Deal closed successfully! Invoiced initial 50% deposit.');

-- Tasks
INSERT INTO public.tasks (id, title, related_to_type, related_to_id, due_date, status, priority, reminder_at) VALUES
('t4000000-0000-0000-0000-000000000001', 'Send updated proposal to Marcus Vance', 'deal', 'd3000000-0000-0000-0000-000000000002', NOW() + INTERVAL '1 day', 'todo', 'high', NOW() + INTERVAL '18 hours'),
('t4000000-0000-0000-0000-000000000002', 'Schedule onboarding workshop with Sophia', 'contact', 'c2000000-0000-0000-0000-000000000003', NOW() + INTERVAL '2 days', 'todo', 'medium', NOW() + INTERVAL '1 day'),
('t4000000-0000-0000-0000-000000000003', 'Review Elena wireframes & component specs', 'deal', 'd3000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours', 'in_progress', 'high', NOW() - INTERVAL '6 hours');

-- Invoices
INSERT INTO public.invoices (id, invoice_number, client_id, company_id, line_items, tax_rate, discount, subtotal, total, status, issue_date, due_date, notes) VALUES
('i5000000-0000-0000-0000-000000000001', 'INV-2026-001', 'c2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', '[{"description":"Mobile App MVP Development - Sprint 1 & 2 Deposit","quantity":1,"unit_price":14500}]'::jsonb, 0.00, 0.00, 14500.00, 14500.00, 'paid', '2026-07-21', '2026-08-04', 'Thank you for choosing Avex Agency!'),
('i5000000-0000-0000-0000-000000000002', 'INV-2026-002', 'c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '[{"description":"Brand Guidelines & Design Tokens Workshop","quantity":1,"unit_price":4500},{"description":"UI Asset Export & Component Library","quantity":1,"unit_price":3000}]'::jsonb, 5.00, 500.00, 7500.00, 7375.00, 'sent', '2026-07-24', '2026-08-07', 'Payment due within 14 days.');

-- Activities
INSERT INTO public.activities (id, contact_id, deal_id, type, title, description, timestamp) VALUES
('a6000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'd3000000-0000-0000-0000-000000000001', 'meeting', 'Discovery Call with Elena', 'Discussed brand overhaul goals, timeline, and design system requirements.', NOW() - INTERVAL '2 days'),
('a6000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'd3000000-0000-0000-0000-000000000002', 'email', 'Sent Technical Architecture Spec', 'Emailed full PDF breakdown of Next.js App Router refactor for Vortex Software.', NOW() - INTERVAL '1 day'),
('a6000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003', 'd3000000-0000-0000-0000-000000000003', 'status_change', 'Deal Won & Deposit Invoiced', 'Moved deal to Won stage and issued deposit invoice INV-2026-001.', NOW() - INTERVAL '5 days');
