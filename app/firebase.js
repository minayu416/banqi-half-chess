import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { collection, getDocs, addDoc, query, orderBy, limit, getFirestore, onSnapshot, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyA8_NLNJW8mZLaNfnpqO4I9i9Q08IuVnfA",
    authDomain: "banqi-half-chess.firebaseapp.com",
    projectId: "banqi-half-chess",
    storageBucket: "banqi-half-chess.appspot.com",
    messagingSenderId: "666331770434",
    appId: "1:666331770434:web:b8e1df7f15923a346e87db",
    measurementId: "G-FCBJWRHZJL"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);


function writeSendMessage(userId, name, text, imageUrl) {
    const messagesCollectionRef = collection(db, "messages")
    addDoc (messagesCollectionRef, 
      {
        userId: userId,
        displayName: name,
        text: text,
        createdAt: serverTimestamp(),
        photoURL : imageUrl
      }
      );
      console.log(serverTimestamp())
  }
  
function getMessages(callback) {
    return onSnapshot(
        query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc'), limit(20)
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        }
    );
  }
  
function useMessages(){
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
        const unsubscribe = getMessages(setMessages);
        return unsubscribe;
    }, []);
  
    return messages;
  }


export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // console.log(result)
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
    }).catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // const email = error.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error)
    });
  }

 export function SignOut() {
    return auth.currentUser && ( <>
  
        <button className="mr-2 ml-6 rounded-md text-sm font-bold" onClick={() => auth.signOut()}>登出</button>
  
      </>
    )
  }