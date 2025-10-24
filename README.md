# Note Me - Mobile Note-Sharing App 📝

A simple yet powerful React Native note-sharing application built with Firebase Authentication and Firestore Database. Note Me helps users easily create, organize, and manage their personal notes with real-time synchronization across devices.

## ✨ Features

- **🔐 Secure Authentication**: User login and signup with Firebase Authentication
- **📱 Cross-Platform**: Built with React Native and Expo for iOS, Android, and Web
- **☁️ Real-Time Sync**: Instant synchronization across all devices using Firestore
- **✍️ Note Management**: Create, edit, and delete notes effortlessly
- **🔍 Search Functionality**: Quickly find notes by title or content
- **📤 Public Sharing**: Share notes publicly via generated links
- **📝 Markdown Support**: Format your notes with Markdown syntax
- **🎨 Modern UI**: Clean and user-friendly interface with Material Design
- **🔒 Privacy**: Each user's notes are stored individually and securely

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/katsronnie/note-me.git
   cd note-me
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Email/Password** authentication in Authentication settings
   - Create a **Firestore Database** in test mode
   - Copy your Firebase configuration

4. **Configure Firebase**
   
   Open `src/config/firebase.config.js` and replace with your Firebase credentials:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Set up Firestore Security Rules**
   
   In Firebase Console, go to Firestore Database > Rules and add:
   
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /notes/{noteId} {
         // Allow users to read, create, update, and delete their own notes
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         
         // Allow anyone to read public notes
         allow read: if resource.data.isPublic == true;
         
         // Allow authenticated users to create notes
         allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

### Running the App

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on specific platforms**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS (Mac only)
   npm run web      # For Web
   ```

3. **Scan the QR code** with the Expo Go app (iOS/Android) or press the corresponding key to run on emulator/simulator

## 📁 Project Structure

```
note-me/
├── src/
│   ├── config/
│   │   └── firebase.config.js      # Firebase configuration
│   ├── screens/
│   │   ├── LoginScreen.js          # Login screen
│   │   ├── SignupScreen.js         # Signup screen
│   │   ├── HomeScreen.js           # Main notes list screen
│   │   ├── NoteEditorScreen.js     # Create/edit note screen
│   │   ├── NoteDetailScreen.js     # View note details
│   │   ├── PublicNoteScreen.js     # View public shared notes
│   │   └── LoadingScreen.js        # Loading state screen
│   ├── services/
│   │   ├── authService.js          # Authentication functions
│   │   └── noteService.js          # Note CRUD operations
│   ├── theme/
│   │   └── theme.js                # App theme and colors
│   └── utils/
│       └── helpers.js              # Utility functions
├── App.js                          # Main app component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🎯 Usage

### Creating an Account
1. Open the app
2. Tap "Sign Up"
3. Enter your name, email, and password
4. Tap "Sign Up" button

### Creating a Note
1. Log in to your account
2. Tap the **+** button at the bottom right
3. Enter a title and content
4. Optionally toggle "Make this note public" to share it
5. Tap "Save"

### Editing a Note
1. Tap on any note from the home screen
2. Tap the **pencil** icon
3. Make your changes
4. Tap "Save"

### Sharing a Note
1. Open the note you want to share
2. Toggle the "Public" switch to ON
3. Tap the **share** icon
4. Share the link via your preferred method

### Searching Notes
1. On the home screen, use the search bar at the top
2. Type your search query
3. Results will filter automatically

## 🛠️ Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Firebase Authentication** - User authentication
- **Firestore** - Cloud database
- **React Navigation** - Navigation library
- **React Native Paper** - UI component library
- **React Native Markdown Display** - Markdown rendering

## 🎨 Features in Detail

### Markdown Support
Notes support standard Markdown syntax:
- `# Heading` for headings
- `**bold**` for bold text
- `*italic*` for italic text
- `- item` for lists
- `` `code` `` for inline code

### Public Note Sharing
- Toggle any note to public
- Get a shareable link
- Anyone with the link can view (no login required)
- Toggle back to private anytime

### Real-Time Sync
- Notes are instantly saved to Firestore
- Access from any device by logging in
- Automatic synchronization across all devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**katsronnie**

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Expo team for the amazing development platform
- React Native Paper for beautiful UI components
- All contributors and users of this app

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Made with ❤️ by katsronnie