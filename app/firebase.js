import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { collection, doc, getDoc, getDocs, updateDoc, addDoc, setDoc, query, orderBy, limit, getFirestore, onSnapshot, serverTimestamp } from "firebase/firestore"

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
export const db = getFirestore(app);
const gameRef = collection(db, "games");
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

export const createOrJoinGame = async (gameId, user) => {
  const docRef = doc(db, "games", gameId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // TODO: 避免刷新
    console.log("Existing gameId", docSnap.data());
    const exixtingGameRef = doc(db, "games", gameId);
    await updateDoc(exixtingGameRef, {
      opponent: {"uid": user.uid, "displayName": user.displayName}
    });
    return {"gameCreator": docSnap.data().creator, 
            "gameOpponent": {"uid": user.uid, "displayName": user.displayName}, 
            "gameSequence": docSnap.data().creator}

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No this gameId");
  
    await setDoc(doc(gameRef, gameId), {
      creator: {"uid": user.uid, "displayName": user.displayName}, 
      // opponent: null, 
      sequence: user.uid,
    });
    return {"gameCreator": user, "gameOpponent": {"uid": null, "displayName": null}, "gameSequence": user}
  }
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