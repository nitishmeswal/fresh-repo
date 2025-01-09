import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user's profile with credits
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .single();

    if (profileError) throw profileError;

    // Get recent transactions
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (txError) throw txError;

    return NextResponse.json({ balance: profile?.credits || 0, transactions });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching wallet data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const json = await request.json();
    const { amount, type, description } = json;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    // Start a transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount,
        type,
        status: 'completed',
        description,
      })
      .select()
      .single();

    if (txError) throw txError;

    // Update user's credits
    const modifier = type === 'credit' ? amount : -amount;
    const { error: updateError } = await supabase.rpc('update_user_credits', {
      user_id: user.id,
      credit_change: modifier,
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing transaction' },
      { status: 500 }
    );
  }
}
