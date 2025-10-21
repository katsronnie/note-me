# Firebase Setup Guide for Note Me App

This guide will walk you through setting up Firebase for the Note Me application.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "note-me-app")
4. Follow the prompts to complete project creation

## Step 2: Register Your Web App

1. In the Firebase Console, click on the **Web icon** (</>) to add a web app
2. Give your app a nickname (e.g., "Note Me Web")
3. Check the box for **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object - you'll need this for the next step

## Step 3: Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=note-me-app.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=note-me-app
   REACT_APP_FIREBASE_STORAGE_BUCKET=note-me-app.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

   **Important**: Never commit the `.env` file to version control. It's already added to `.gitignore`.

## Step 4: Enable Authentication

1. In the Firebase Console, navigate to **Authentication** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable **"Email/Password"** (the first toggle)
6. Click **"Save"**

## Step 5: Create Firestore Database

1. In the Firebase Console, navigate to **Firestore Database** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add security rules next)
4. Select your Firestore location (choose one closest to your users)
5. Click **"Enable"**

## Step 6: Set Up Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // Users can only read their own notes
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Users can only create notes with their own userId
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.userId
                    && request.resource.data.keys().hasAll(['title', 'content', 'userId', 'createdAt', 'updatedAt']);
      
      // Users can only update their own notes
      allow update: if request.auth != null 
                    && request.auth.uid == resource.data.userId
                    && request.resource.data.userId == resource.data.userId;
      
      // Users can only delete their own notes
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **"Publish"** to save the rules

**Note**: These rules are included in the `firestore.rules` file and can be deployed using Firebase CLI.

## Step 7: Create Firestore Index

1. In Firestore Database, go to the **"Indexes"** tab
2. Click **"Add index"**
3. Configure the index:
   - Collection ID: `notes`
   - Fields to index:
     - Field 1: `userId` (Ascending)
     - Field 2: `createdAt` (Descending)
   - Query scope: Collection
4. Click **"Create index"**
5. Wait for the index to build (may take a few minutes)

**Note**: This index configuration is included in the `firestore.indexes.json` file and can be deployed using Firebase CLI.

## Step 8: Run the Application

1. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app should open in your browser at `http://localhost:3000`

## Step 9: Test the Application

1. Click **"Sign Up"** to create a new account
2. Enter an email and password (minimum 6 characters)
3. After signing up, you'll be automatically logged in
4. Try creating, editing, and deleting notes
5. Sign out and sign back in to verify that your notes persist

## Step 10: Deploy to Firebase Hosting (Optional)

If you want to deploy your app to Firebase Hosting:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select **Hosting** and **Firestore**
   - Choose your existing Firebase project
   - Use `build` as your public directory
   - Configure as a single-page app: **Yes**
   - Don't overwrite index.html: **No**

4. Build the production version:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

6. Your app will be live at `https://your-project-id.web.app`

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"

- Make sure your `.env` file exists and contains all required variables
- Restart the development server after adding environment variables

### "Missing or insufficient permissions"

- Check that your Firestore security rules are correctly set up
- Ensure you're signed in before trying to access notes

### Index not found error

- Create the required index in the Firestore console
- Wait for the index to finish building

### Notes not appearing

- Check the browser console for errors
- Verify that the Firestore security rules allow read access
- Ensure you're signed in with the same account that created the notes

## Security Best Practices

1. **Never commit your `.env` file** - It contains sensitive credentials
2. **Use environment variables** for all Firebase configuration
3. **Keep Firestore rules strict** - Only allow users to access their own data
4. **Validate user input** on both client and server side
5. **Keep dependencies updated** to patch security vulnerabilities
6. **Use HTTPS** in production (Firebase Hosting provides this automatically)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Firebase Tutorial](https://firebase.google.com/docs/web/setup)

## Support

If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Review the Firebase documentation
3. Open an issue on GitHub with details about your problem
