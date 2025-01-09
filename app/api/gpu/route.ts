import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: gpus, error } = await supabase
      .from('gpu_configurations')
      .select('*')
      .order('price_per_hour', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ gpus });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching GPUs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const json = await request.json();
    const { gpuId } = json;

    // Check if GPU is available
    const { data: gpu, error: fetchError } = await supabase
      .from('gpu_configurations')
      .select('*')
      .eq('id', gpuId)
      .single();

    if (fetchError || !gpu) {
      throw new Error('GPU not found');
    }

    if (gpu.status !== 'available') {
      throw new Error('GPU not available');
    }

    // Update GPU status
    const { error: updateError } = await supabase
      .from('gpu_configurations')
      .update({ status: 'in-use' })
      .eq('id', gpuId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, gpu });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error updating GPU' },
      { status: 500 }
    );
  }
}
