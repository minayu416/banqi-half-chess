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

export const updatePosition = async (gameId, position, eventMessage) => {
  const docRef = collection(db, `games/${gameId}/position`);
  await addDoc(docRef, {
    position: position,
    eventMessage: eventMessage,
      createdAt: serverTimestamp(),
    });
}

export const fetchLatestPosition = (gameId, callback) => {
  console.log(123)
  const positionCollectionRef = collection(db, `games/${gameId}/position`);
  const positionQuery = query(positionCollectionRef, orderBy('createdAt', 'desc'), limit(1));

  const unsubscribe = onSnapshot(positionQuery, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      const data = latestDoc.data();
      callback(data);
    }
  });

  return unsubscribe;
};

export const updateSide = async (gameId, side) => {
  const docRef = doc(db, "games", gameId);
  await updateDoc(docRef, {
      side: side
    });
}

export const updateSequence = async (gameId, sequence) => {
  const docRef = doc(db, "games", gameId);
  await updateDoc(docRef, {
    sequence: sequence
    });
}

export const createOrJoinGame = async (gameId, user) => {
  const docRef = doc(db, "games", gameId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Existing gameId", docSnap.data());
    // 代表是刷新的
    if (docSnap.data().opponent){

      return {"gameCreator": docSnap.data().creator, 
      "gameOpponent": docSnap.data().opponent,
      "gameSequence": docSnap.data().sequence
    }

    } else {
    const exixtingGameRef = doc(db, "games", gameId);
    await updateDoc(exixtingGameRef, {
      opponent: {"uid": user.uid, "displayName": user.displayName}
    });
    return {"gameCreator": docSnap.data().creator, 
            "gameOpponent": {"uid": user.uid, "displayName": user.displayName}, 
            "gameSequence": docSnap.data().creator.uid}
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No this gameId");
  
    await setDoc(doc(gameRef, gameId), {
      creator: {"uid": user.uid, "displayName": user.displayName}, 
      // opponent: null, 
      sequence: user.uid,
    });
    return {"gameCreator": user, "gameOpponent": {"uid": null, "displayName": null}, "gameSequence": user.uid}
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