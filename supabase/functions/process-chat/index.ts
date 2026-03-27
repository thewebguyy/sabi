import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import OpenAI from "https://esm.sh/openai@4.28.0"

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
})

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Only process inbound messages
    if (record.direction !== 'inbound') {
      return new Response("Not an inbound message", { status: 200 })
    }

    const body = record.body
    
    // 1. AI Extraction
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: 'Analysis of a vendor-customer chat regarding a business deal. Return JSON: { is_deal, title, amount, summary, customer_constraint, ai_reply }' }, 
        { role: "user", content: body }
      ],
      response_format: { type: "json_object" }
    })
    
    const aiResult = JSON.parse(response.choices[0].message.content)

    // 2. If it's a deal, create it and link back to chat_message
    if (aiResult.is_deal) {
      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert([{
          user_id: record.user_id,
          contact_id: record.contact_id,
          title: aiResult.title || 'Inquiry',
          amount: aiResult.amount || 0,
          summary: aiResult.summary,
          customer_constraint: aiResult.customer_constraint,
          ai_suggested_reply: aiResult.ai_reply,
          status: 'pending'
        }])
        .select()
        .single()

      if (dealError) throw dealError

      // Link the message to the deal
      await supabase
        .from('chat_messages')
        .update({ deal_id: deal.id })
        .eq('id', record.id)
        
      console.log(`[AI] Created deal ${deal.id} for message ${record.id}`)
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" } 
    })
  } catch (error) {
    console.error(`[AI ERROR] ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    })
  }
})
