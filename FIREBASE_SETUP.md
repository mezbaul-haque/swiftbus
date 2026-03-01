# Firebase Setup Guide for SwiftBus

Your SwiftBus app now uses Firebase for global user authentication and data storage. Follow these steps to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create project"**
3. Enter project name (e.g., "SwiftBus")
4. Choose your preferred region
5. Click **"Create project"** and wait for it to complete

## Step 2: Register Your Web App

1. In Firebase Console, click the **gear icon** (⚙️) → **Project settings**
2. Go to the **General** tab
3. Under **"Your apps"**, click **"Add app"** → **Web** (</> icon)
4. Enter app name (e.g., "SwiftBus Web")
5. Click **"Register app"**

## Step 3: Get Your Firebase Credentials

1. Copy the firebaseConfig object from the code shown in Firebase Console
2. It should look like:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

## Step 4: Set Up Environment Variables

1. In your project root, create a file named `.env.local` (if it doesn't exist)
2. Add the following variables using your Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

3. Save the file (it's in .gitignore, so it won't be committed)

## Step 5: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, click **Email/Password**
4. Enable **"Email/Password"** and **"Email link (passwordless sign-in)"** (optional)
5. Click **"Save"**

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select your preferred region
5. Click **"Create"**

## Step 7: Set Up Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bookings collection - users can only read/write their own
    match /bookings/{bookingId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test Your App

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Go to `http://localhost:5173/swiftbus/`
4. Register a new account with your email
5. Create a booking
6. Log out and log back in - your booking should appear!

## Troubleshooting

**"Firebase is not configured"** - Make sure `.env.local` is in your project root and contains all 6 variables

**"Permission denied" when booking** - Check Firestore rules (Step 7)

**Auth not working** - Make sure Email/Password is enabled in Firebase Authentication settings

**Database not syncing** - Check browser console for errors and verify network connectivity

## Security Notes

- Never commit `.env.local` to git
- These credentials are public-facing (it's okay for Firebase Web Apps)
- Firestore rules protect your data (users can only see their own bookings)
- Use Firebase Console for monitoring and analytics

## Next Steps

- Set up email verification for users
- Add custom user profiles (display name, phone number, etc.)
- Set up Firebase Hosting to deploy your app
- Add Firebase Analytics to track usage
