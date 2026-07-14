export async function onRequest(context) {
  var req = context.request, env = context.env;

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'METHOD NOT ALLOWED' }), {
      status: 405, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }

  try {
    var data = await req.json();
    var name = (data.name || '').trim(), email = (data.email || '').trim(), message = (data.message || '').trim(), hp = data._hp || '';

    if (hp) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'ALL FIELDS REQUIRED' }), {
        status: 400, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return new Response(JSON.stringify({ error: 'FIELD TOO LONG' }), {
        status: 400, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'INVALID EMAIL' }), {
        status: 400, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'SERVER CONFIG ERROR' }), {
        status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    var esc = function(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };

    var res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'jacquesd264160@gmail.com',
        subject: 'Portfolio message from ' + esc(name),
        html: '<p><strong>Name:</strong> ' + esc(name) + '</p>'
           + '<p><strong>Email:</strong> ' + esc(email) + '</p>'
           + '<p><strong>Message:</strong></p><p>' + esc(message).replace(/\n/g,'<br>') + '</p>'
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      console.error('Resend error:', res.status, errText);
      return new Response(JSON.stringify({ error: 'FAILED TO SEND' }), {
        status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('Contact error:', e);
    return new Response(JSON.stringify({ error: 'INTERNAL ERROR' }), {
      status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }
}
