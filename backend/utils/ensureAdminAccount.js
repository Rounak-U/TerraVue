const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'Lead Concierge';

async function ensureAdminAccount() {
    if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
        console.warn('Admin credentials missing; admin console will be disabled.');
        return;
    }

    let admin = await Admin.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (!admin) {
        const hashed = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
        admin = await Admin.create({
            name: DEFAULT_ADMIN_NAME,
            email: DEFAULT_ADMIN_EMAIL,
            password: hashed,
        });
        console.log(`✓ Provisioned default admin (${admin.email})`);
        return;
    }

    // Optionally sync password when env overrides default credential
    if (process.env.ADMIN_PASSWORD) {
        const matches = await bcrypt.compare(process.env.ADMIN_PASSWORD, admin.password);
        if (!matches) {
            admin.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await admin.save();
            console.log(`✓ Updated admin credential for ${admin.email}`);
        }
    }
}

module.exports = ensureAdminAccount;
