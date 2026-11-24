const webpush = require('web-push');

const VAPID_PUBLIC = 'BO8doExnGUgrR7LiCTmvPlkb9bufHmnfwxVmTwiMsht9q5I73ToxmZ6xeEUkHWdy4U9Uy5ztD2XFyJSGCIZnVBg';
const VAPID_PRIVATE = 'R5HZUvgEH8OuZW8dIQ72kUqdnvWrypWZjFPSRoV6R4A';

webpush.setVapidDetails('mailto:couple-chat@example.com', VAPID_PUBLIC, VAPID_PRIVATE);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, status: 'web-push alive' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!body.subscription || !body.subscription.endpoint) {
      return res.status(400).json({ ok: false, error: 'Missing push subscription' });
    }
    const payload = JSON.stringify({
      title: body.title || 'Наш Чат',
      body: body.body || 'Новое сообщение 💕'
    });
    await webpush.sendNotification(body.subscription, payload);
    return res.status(200).json({ ok: true });
  } catch (err) {
    const code = err.statusCode || 500;
    return res.status(code).json({ ok: false, error: err.message || 'Push failed' });
  }
};
