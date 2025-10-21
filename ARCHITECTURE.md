# Note Me App - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         App.js (Main)                           │
│  • Manages authentication state                                 │
│  • Coordinates components                                       │
│  • Provides app layout                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      Auth.js             │    │      Notes.js            │
│  • Sign Up Form          │    │  • Create Notes          │
│  • Sign In Form          │    │  • List Notes            │
│  • Sign Out Button       │    │  • Edit Notes            │
│  • Error Handling        │    │  • Delete Notes          │
└──────────────────────────┘    └──────────────────────────┘
                │                           │
                ▼                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       firebase.js                               │
│  • Firebase Initialization                                      │
│  • Auth Service Export                                          │
│  • Firestore Service Export                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                             │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │  Authentication       │    │  Cloud Firestore     │          │
│  │  • Email/Password     │    │  • notes collection  │          │
│  │  • User Sessions      │    │  • Real-time sync    │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Action → Auth.js → Firebase Auth → Update App State → Show/Hide Components
```

### Note Creation Flow
```
User Input → Notes.js → Firestore addDoc() → Real-time Listener → Update UI
```

### Real-time Sync Flow
```
Firestore Change → onSnapshot() → Notes.js State Update → UI Refresh
```

## Component Hierarchy

```
<App>
  ├── <Header>
  │   └── Title & Subtitle
  │
  ├── <Auth user={user}>
  │   ├── Sign Up/In Form (if not authenticated)
  │   └── User Info + Sign Out (if authenticated)
  │
  ├── {user && <Notes user={user}>}
  │   ├── <NoteForm>
  │   │   ├── Title Input
  │   │   ├── Content Textarea
  │   │   └── Submit Button
  │   │
  │   └── <NotesList>
  │       └── <NoteCard> (multiple)
  │           ├── Title
  │           ├── Content
  │           ├── Date
  │           └── Actions (Edit/Delete)
  │
  ├── {!user && <Welcome>}
  │   └── Feature List
  │
  └── <Footer>
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client (Browser)                          │
│  • User Authentication                                          │
│  • Auth Token Storage                                           │
│  • UI Components                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Authenticated Requests
                              │ (with Auth Token)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firestore Security Rules                     │
│  • Verify authentication                                        │
│  • Check userId match                                           │
│  • Allow/Deny operations                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Authorized Access Only
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Firestore Database                        │
│  • User-specific notes                                          │
│  • Encrypted at rest                                            │
│  • Indexed queries                                              │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

```javascript
App.js State:
  └── user: User | null
      └── Managed by onAuthStateChanged()

Notes.js State:
  ├── notes: Note[]
  │   └── Synced via onSnapshot()
  ├── title: string
  ├── content: string
  ├── editingId: string | null
  └── loading: boolean
```

## API Interactions

### Authentication API
```javascript
// Sign Up
createUserWithEmailAndPassword(auth, email, password)

// Sign In
signInWithEmailAndPassword(auth, email, password)

// Sign Out
signOut(auth)

// Listen to Auth State
onAuthStateChanged(auth, callback)
```

### Firestore API
```javascript
// Create Note
addDoc(collection(db, 'notes'), noteData)

// Read Notes (Real-time)
onSnapshot(query(...), callback)

// Update Note
updateDoc(doc(db, 'notes', id), updates)

// Delete Note
deleteDoc(doc(db, 'notes', id))
```

## Performance Considerations

1. **Real-time Listeners**: Only active when user is on the page
2. **Query Scoping**: Only fetch current user's notes
3. **Indexes**: Optimized for userId + createdAt queries
4. **Unsubscribe**: Cleanup listeners on component unmount
5. **Bundle Size**: Optimized production build (~171 KB gzipped)

## Deployment Flow

```
Development:
  npm start → webpack dev server → http://localhost:3000

Production:
  npm run build → Optimized bundle → build/ folder
       │
       ├─→ Firebase Hosting → firebase deploy
       ├─→ Vercel → vercel
       └─→ Netlify → Manual upload or git integration
```

## File Dependencies

```
index.js
  └── imports App.js
      ├── imports Auth.js
      │   └── imports firebase.js
      └── imports Notes.js
          └── imports firebase.js
```

## Environment Configuration

```
.env (git-ignored)
  └── REACT_APP_FIREBASE_*
      └── Used by firebase.js
          └── Injected at build time
              └── Available in production bundle
```
