import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const { userId, rawText, subject } = await req.json();

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    await supabase.from('profiles').update({ ai_status: 'Analyzing Knowledge...' }).eq('id', userId);

    const response = await fetch('https://groq.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are the ICCS Autonomous Brain designed by Ayush Kumar Pal (BTech 1st Year CSE AIML Student).`
          },
          { role: 'user', content: `Student: ${profile.full_name}, Subject: ${subject}. Content: ${rawText}` }
        ]
      }),
    });

    const aiData = await response.json();
    const aiOutput = aiData.choices.message.content;

    await supabase.from('knowledge_base').insert({
      user_id: userId,
      content: aiOutput,
      subject: subject
    });

    await supabase.from('profiles').update({ ai_status: 'P2P Sync Ready' }).eq('id', userId);

    return NextResponse.json({ success: true, insights: aiOutput });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

