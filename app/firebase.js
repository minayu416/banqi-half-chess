import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { collection, doc, getDoc, updateDoc, addDoc, setDoc, query, orderBy, limit, getFirestore, onSnapshot, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
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

export const checkGameIdExists = async (gameId) => {
  try {
    const docRef = doc(db, "games", gameId);
    const docSnap = await getDoc(docRef);
  return docSnap.exists();
} catch (error) {
    console.error("Error when checking game ID:", error);
  throw error;
}
};

export const createOrJoinGame = async (gameId, user) => {
  const docRef = doc(db, "games", gameId);
  const docSnap = await getDoc(docRef);

  // 已經有game的資料
  if (docSnap.exists()) {
    // 有game資料，也有 opponent，代表是使用者重新整理或掉線
    if (docSnap.data().opponent){

      return {"gameCreator": docSnap.data().creator, 
      "gameOpponent": docSnap.data().opponent,
      "gameSequence": docSnap.data().sequence
    }
    // 有 game 資料，1. 如果currentUser === creator 不理他, 2. 如果不是，則設定 opponent
    } else {
      let setOpponent
      if(user.uid !== docSnap.data().creator.uid){
        setOpponent = {"uid": user.uid, "displayName": user.displayName, "photoURL": user.photoURL}
        const exixtingGameRef = doc(db, "games", gameId);
        await updateDoc(exixtingGameRef, {
          opponent: setOpponent
        });
      }
      else {
        setOpponent = {"uid": null, "displayName": null}
      }
    return {"gameCreator": docSnap.data().creator, 
            "gameOpponent": setOpponent, 
            "gameSequence": docSnap.data().creator.uid}
    }
  // 沒有 game 的資料 -> 創新的遊戲、設立currentUser為
  } else {
    // docSnap.data() will be undefined in this case
  
    await setDoc(doc(gameRef, gameId), {
      creator: {"uid": user.uid, "displayName": user.displayName, "photoURL": user.photoURL}, 
      // opponent: null, 
      sequence: user.uid,
      createdAt: serverTimestamp(),
    });
    return {"gameCreator": user, "gameOpponent": {"uid": null, "displayName": null}, "gameSequence": user.uid}
  }
}

export const fetchNewMessages = (gameId, callback) => {
  const positionCollectionRef = collection(db, `games/${gameId}/messages`);
  const positionQuery = query(positionCollectionRef, orderBy('createdAt', 'desc'), limit(10));

  const unsubscribe = onSnapshot(positionQuery, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    messages.reverse();
      callback(messages);
    }
  });

  return unsubscribe;
};

export function writeSendMessage(gameId, userId, name, photoURL, text) {
  const messagesCollectionRef = collection(db, `games/${gameId}/messages`);
  addDoc (messagesCollectionRef, 
    {
      userId: userId,
      displayName: name,
      photoURL: photoURL,
      text: text,
      createdAt: serverTimestamp(),
    }
    );
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