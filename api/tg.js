module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, description: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const tgRes = await fetch(`https://api.telegram.org/bot${encodeURIComponent(body.token)}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: body.chat_id, text: body.text })
    });
    const data = await tgRes.json();
    return res.status(tgRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, description: e.message || 'Server error' });
  }
};
