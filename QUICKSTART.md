# Quick Start Script for Admin Dashboard

## Option 1: Using this script (Automated)

1. Copy `.env.example` to `.env.local` and fill in all values
2. Run this script to create your first admin:

```bash
# Make sure you have your .env.local set up first!
# Then run this in your project directory

# Start the dev server in the background
npm run dev &

# Wait for server to start
sleep 5

# Create admin user (edit the values below)
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teammistake.com",
    "password": "YourSecurePassword123!",
    "name": "Admin",
    "secret": "your_admin_setup_secret_from_env"
  }'

echo "\n\n✅ Admin user created! Visit http://localhost:3000/admin/login to sign in"
```

## Option 2: Manual Setup

### Step 1: Set up environment variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in:
   - MongoDB connection string
   - NextAuth secret (generate with: `openssl rand -base64 32`)
   - Resend API key and email settings
   - Admin setup secret (any secure string)

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start development server

```bash
npm run dev
```

### Step 4: Create first admin user

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-admin@email.com",
    "password": "YourSecurePassword",
    "name": "Admin Name",
    "secret": "your_admin_setup_secret_from_env"
  }'
```

Or use this JavaScript code in your browser console (while on localhost:3000):

```javascript
fetch('/api/admin/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-admin@email.com',
    password: 'YourSecurePassword',
    name: 'Admin Name',
    secret: 'your_admin_setup_secret_from_env'
  })
})
.then(r => r.json())
.then(console.log);
```

### Step 5: Access admin dashboard

1. Go to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Start managing contact submissions!

## What's Included

✅ **MongoDB Integration**: All contact submissions saved to database  
✅ **Admin Authentication**: Secure login with NextAuth  
✅ **Contact Management**: View, filter, and reply to submissions  
✅ **Email Replies**: Send replies directly from dashboard  
✅ **Status Tracking**: Automatic status updates (new/read/replied)  
✅ **Reply History**: View all previous replies  
✅ **Responsive UI**: Beautiful gradient design matching your site  

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Admin dashboard UI
│   │   └── login/
│   │       └── page.tsx          # Admin login page
│   └── api/
│       ├── admin/
│       │   ├── contacts/         # Contact management APIs
│       │   └── setup/            # Admin user creation
│       ├── auth/
│       │   └── [...nextauth]/    # NextAuth configuration
│       └── contact/
│           └── route.ts          # Contact form submission (updated)
├── components/
│   └── AuthProvider.tsx          # Session provider wrapper
├── lib/
│   ├── auth.ts                   # NextAuth options
│   └── mongodb.ts                # MongoDB connection
├── models/
│   ├── Admin.ts                  # Admin user model
│   └── Contact.ts                # Contact submission model
└── middleware.ts                 # Route protection
```

## Security Notes

⚠️ **Important**: After creating your first admin user:
1. Consider removing or protecting the `/api/admin/setup` endpoint
2. Use strong passwords
3. Keep your `.env.local` secure and never commit it
4. Use HTTPS in production

## Troubleshooting

**Can't connect to MongoDB?**
- Check your connection string format
- Whitelist your IP in MongoDB Atlas
- Verify database user permissions

**Authentication not working?**
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your app URL

**Emails not sending?**
- Verify Resend API key
- Ensure sender email is verified
- Check Resend dashboard for errors

Need help? Check `ADMIN_SETUP.md` for detailed documentation.
