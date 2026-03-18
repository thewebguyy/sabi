-- Performance Indexes for Sabi CRM
-- Run this in your Supabase SQL Editor

-- Users table (id is already primary)
-- CREATE INDEX idx_users_phone ON users(phone);

-- Contacts table
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);

-- Deals table
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_status ON deals(status);

-- Chat Messages table
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_contact_id ON chat_messages(contact_id);
CREATE INDEX idx_chat_messages_deal_id ON chat_messages(deal_id);

-- Payments table
CREATE INDEX idx_payments_deal_id ON payments(deal_id);
CREATE INDEX idx_payments_verified_status ON payments(verified_status);

-- Reminders table
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_deal_id ON reminders(deal_id);
