import Admin from '../models/Admin.js';

export const ensureDefaultAdmin = async () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.warn('ADMIN_USERNAME or ADMIN_PASSWORD not set in .env — skipping default admin creation');
    return;
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Default admin already exists:', username);
    return;
  }

  const admin = new Admin({ username, password, role: 'SUPERADMIN' });
  await admin.save();
  console.log(`Default superadmin created: ${username}`);
};
