import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface FlightLogEntry {
  id?: string;
  user_id: string;
  date: string;
  aircraft_type?: string;
  registration?: string;
  route?: string;
  category?: string;
  hours?: number;
  remarks?: string;
  created_at?: string;
}

Deno.serve(async (req: Request) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const method = req.method;
    const userId = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET - Fetch flight logs for a user
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('pilot_flight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // POST - Create a new flight log entry
    if (method === 'POST') {
      const body: FlightLogEntry = await req.json();
      
      const { data, error } = await supabase
        .from('pilot_flight_logs')
        .insert({
          user_id: userId,
          date: body.date,
          aircraft_type: body.aircraft_type,
          registration: body.registration,
          route: body.route,
          category: body.category || 'flight',
          hours: body.hours,
          remarks: body.remarks,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // PUT - Update a flight log entry
    if (method === 'PUT') {
      const body: FlightLogEntry = await req.json();
      const logId = url.searchParams.get('id');

      if (!logId) {
        return new Response(JSON.stringify({ error: 'Log ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('pilot_flight_logs')
        .update({
          date: body.date,
          aircraft_type: body.aircraft_type,
          registration: body.registration,
          route: body.route,
          category: body.category,
          hours: body.hours,
          remarks: body.remarks,
        })
        .eq('id', logId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete a flight log entry
    if (method === 'DELETE') {
      const logId = url.searchParams.get('id');

      if (!logId) {
        return new Response(JSON.stringify({ error: 'Log ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .from('pilot_flight_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in digital-flight-logbook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
