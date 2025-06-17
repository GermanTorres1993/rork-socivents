# Database Setup Instructions for Socivents App

## Resolving "relation 'public.users' does not exist" Error

You're seeing this error because the necessary database tables haven't been created in your Supabase instance. Let's fix this by applying the database schema.

### Steps to Apply Database Schema

1. **Log in to Supabase Dashboard**:
   - Go to [app.supabase.com](https://app.supabase.com)
   - Sign in with your credentials
   - Select your project for the Socivents app

2. **Access SQL Editor**:
   - In the left sidebar, click on "SQL"
   - Click on "New query" or "+ New SQL snippet"

3. **Copy the Database Setup Script**:
   - Open the file `lib/database-setup.sql` in your project
   - Copy all the contents of this file

4. **Execute the SQL Script**:
   - Paste the copied SQL script into the Supabase SQL editor
   - Click "RUN" or "Execute" to apply the schema
   - You should see a success message if everything runs correctly

5. **Verify Tables Creation**:
   - In the Supabase dashboard, click on "Table" in the left sidebar
   - You should now see tables like `users`, `events`, `tickets`, `chat_rooms`, and `chat_messages` under the "public" schema

### Troubleshooting Permission Errors

If you encounter an error like "ERROR: 42501: must be owner of table users" or similar permission issues:

1. **Check Your Role**:
   - Ensure you are logged in as the project owner or with a role that has sufficient permissions to create tables and policies.
   - If you're not the owner, ask the project owner to execute the script or grant you the necessary permissions.

2. **Modified Script**:
   - The provided script has been updated to use `IF NOT EXISTS` clauses to avoid conflicts with existing tables or policies.
   - It also avoids directly altering system tables like `auth.users` which might require higher permissions.

3. **Contact Supabase Support**:
   - If permission issues persist, reach out to Supabase support for assistance with your project permissions.

### If You're Still Having Issues

If the error persists after running the script:

1. **Check Database Connection**:
   - Ensure your app is connecting to the correct Supabase project
   - Verify your Supabase URL and key in your environment variables (in `.env` file)

2. **Check for Errors in SQL Execution**:
   - Look for any error messages in the Supabase SQL editor after running the script
   - Common issues might include syntax errors or permission issues

3. **Reset Database (if needed)**:
   - As a last resort, you can reset your database in Supabase
   - Be aware this will delete all existing data
   - Then re-run the setup script

### Testing the Fix
After applying the schema:
- Restart your app
- Try logging in or accessing features that interact with the database
- The error should be resolved if the tables are created successfully

If you continue to face issues, please contact Supabase support or check their documentation for additional troubleshooting steps.