import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dimgfhkbhgxjqybowbmf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbWdmaGtiaGd4anF5Ym93Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3OTIyMjksImV4cCI6MTk5NjM2ODIyOX0.yHc9O5HhHHSdia0T5hVcFF6lIH48da3d3tsYdUBmqkI'
export const supabase = createClient(supabaseUrl, supabaseKey)


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAmpJ-Y0pQpmTx4Nk2xjVSdiL7_zj41jjI",
//   authDomain: "book-app-ded32.firebaseapp.com",
//   projectId: "book-app-ded32",
//   storageBucket: "book-app-ded32.appspot.com",
//   messagingSenderId: "204380763456",
//   appId: "1:204380763456:web:4fece8aafc222c1ac7f6a5",
//   measurementId: "G-9FTLZCF25F"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);