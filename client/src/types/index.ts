// Sabi Domain Contracts & Types
// Locked Architecture: Sales Memory & Revenue Recovery Engine

export type MoneyAmount = number;
export type DealStatus = 'open' | 'won' | 'lost';
export type ActivityType = 'captured' | 'followup_copied' | 'followup_sent' | 'won' | 'lost';

export interface Profile {
  id: string;
  business_name: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string | null;
  product_name: string;
  amount: MoneyAmount;
  currency: string;
  status: DealStatus;
  customer_constraint: string | null;
  captured_at: string;
  last_vendor_contact_at: string;
  last_customer_response_at: string | null;
  follow_up_due_at: string;
  won_at: string | null;
  lost_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  deal_id: string;
  activity_type: ActivityType;
  created_at: string;
}

// AI Pipeline Contracts (Strict boundary between untrusted AI and DB)
export interface RawAIExtractionOutput {
  customer_name?: string;
  customer_phone?: string;
  product_name?: string;
  amount?: number;
  customer_constraint?: string;
  likely_customer_last_sender?: boolean;
}

export interface ExtractedDealPayload {
  customer_name: string;
  customer_phone: string | null;
  product_name: string;
  amount: MoneyAmount;
  customer_constraint: string | null;
  suggested_follow_up_due_at: string;
}

export interface FollowUpContext {
  customer_name: string;
  product_name: string;
  amount: MoneyAmount;
  customer_constraint: string | null;
  hours_inactive: number;
}

export interface AIProvider {
  extractDeal(rawChatText: string): Promise<ExtractedDealPayload>;
  generateFollowUp(context: FollowUpContext): Promise<string>;
}
