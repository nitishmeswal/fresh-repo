import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: models, error } = await supabase
      .from('ai_models')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching AI models' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const json = await request.json();
    const { modelConfig } = json;

    const { data, error } = await supabase
      .from('ai_models')
      .insert(modelConfig)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, model: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating AI model' },
      { status: 500 }
    );
  }
}
