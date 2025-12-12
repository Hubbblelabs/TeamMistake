# Admin Dashboard Setup Guide

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database. You can use:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
   - Local MongoDB installation

2. **Resend Account**: For email functionality
   - Sign up at [Resend](https://resend.com)
   - Get your API key

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the following values:

- **MONGODB_URI**: Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/database`
  
- **NEXTAUTH_URL**: Your application URL
  - Development: `http://localhost:3000`
  - Production: Your production URL
  
- **NEXTAUTH_SECRET**: Generate a secure secret
  ```bash
  openssl rand -base64 32
  ```

- **RESEND_API_KEY**: Your Resend API key
- **RESEND_FROM**: Your verified sender email (e.g., `noreply@yourdomain.com`)
- **ADMIN_EMAIL**: Email where contact form submissions are sent

- **ADMIN_SETUP_SECRET**: A secret key for creating the first admin (any secure string)

### 2. Install Dependencies

```bash
npm install
```

### 3. Create First Admin User

After setting up environment variables, create your first admin user by sending a POST request to `/api/admin/setup`:

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourSecurePassword123",
    "name": "Admin User",
    "secret": "your_admin_setup_secret_key_here"
  }'
```

**Using JavaScript fetch (in browser console):**

```javascript
fetch('http://localhost:3000/api/admin/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'yourSecurePassword123',
    name: 'Admin User',
    secret: 'your_admin_setup_secret_key_here'
  })
})
.then(r => r.json())
.then(console.log);
```

Replace:
- `admin@example.com` with your admin email
- `yourSecurePassword123` with a secure password
- `your_admin_setup_secret_key_here` with the value from your `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Login with the credentials you created
3. Access the dashboard to view and reply to contact submissions

## Features

### Admin Dashboard
- **View all contact submissions**: See all messages from your contact form
- **Filter by status**: Filter contacts by new, read, or replied
- **Reply to contacts**: Send email replies directly from the dashboard
- **Reply history**: View all previous replies to a contact
- **Status tracking**: Automatically tracks if a message is new, read, or replied

### Contact Form Integration
- All contact form submissions are automatically saved to MongoDB
- Admin receives email notification for new submissions
- Users receive confirmation email
- All communication is stored in the database

## Security Notes

1. **After creating your first admin**, you should:
   - Remove or comment out the admin setup endpoint in production
   - Or add additional protection to the `/api/admin/setup` route

2. **Keep your `.env.local` secure**:
   - Never commit it to version control
   - Use different values for production

3. **Use strong passwords** for admin accounts

4. **Enable HTTPS** in production

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Email Not Sending
- Verify your Resend API key is correct
- Ensure the sender email is verified in Resend
- Check Resend dashboard for error logs

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your application URL
- Clear browser cookies and try again

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form (saves to MongoDB)

### Protected Admin Endpoints
- `GET /api/admin/contacts` - Get all contacts (with optional status filter)
- `GET /api/admin/contacts/[id]` - Get specific contact
- `PATCH /api/admin/contacts/[id]` - Update contact status
- `POST /api/admin/contacts/[id]/reply` - Send reply to contact

### Setup Endpoint
- `POST /api/admin/setup` - Create first admin (should be protected/disabled after use)

## Production Deployment

1. Set all environment variables in your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Ensure MongoDB connection string is for production database
4. Verify Resend sender domain for production
5. Consider disabling or protecting the `/api/admin/setup` endpoint

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Resend Documentation](https://resend.com/docs)
