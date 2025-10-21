# Note Me - Personal Note Management App

A simple yet powerful note-sharing application designed to help users easily create, organize, and manage their personal notes in one place. Built with React and Firebase.

## Features

- 🔐 **Secure Authentication**: Sign up and sign in with Firebase Authentication
- 📝 **Create Notes**: Easily create new notes with titles and content
- ✏️ **Edit Notes**: Update your notes anytime
- 🗑️ **Delete Notes**: Remove notes you no longer need
- ☁️ **Real-time Sync**: Notes are synchronized in real-time across all devices
- 🔒 **Privacy**: Each user's notes are stored individually and privately
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Hosting**: Can be deployed to Firebase Hosting, Vercel, or any static hosting service

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Firebase project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/katsronnie/note-me.git
cd note-me
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password provider
4. Create a **Firestore Database** in production mode
5. Add Firestore security rules (see below)
6. Copy your Firebase configuration

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Firebase configuration values:
   ```
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

### 5. Firestore Security Rules

Add these security rules to your Firestore database to ensure users can only access their own notes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // Users can only read their own notes
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Users can only create notes with their own userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Users can only update their own notes
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Users can only delete their own notes
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Run the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in with your credentials
3. **Create Note**: Enter a title and content, then click "Add Note"
4. **Edit Note**: Click the "Edit" button on any note to modify it
5. **Delete Note**: Click the "Delete" button to remove a note
6. **Sign Out**: Click "Sign Out" to log out of your account

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

### Deploy to Firebase Hosting

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
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Project Structure

```
note-me/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js          # Main application component
│   ├── Auth.js         # Authentication component
│   ├── Notes.js        # Notes management component
│   ├── firebase.js     # Firebase configuration
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── package.json
└── README.md
```

## Security Considerations

- Never commit your `.env` file or Firebase credentials to version control
- Use Firestore security rules to protect user data
- Always validate user input on both client and server side
- Keep your Firebase SDK and dependencies up to date

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- Created as a simple, functional note-taking application

---

Made with ❤️ by [katsronnie](https://github.com/katsronnie)
