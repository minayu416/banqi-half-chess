import React from "react";
import { useRouter } from "next/navigation";

import { checkGameIdExists } from "./firebase";

import { homeTranslate } from "@/app/[lng]/translate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHouse,
  faCircleQuestion,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export function HeaderBase({ children }) {
  return (
    <div
      className="fixed inset-x-0 top-0 h-12 md:h-12 lg:h-16"
      style={{ backgroundColor: "#B59376" }}
    >
      {children}
    </div>
  );
}

export function HomeHeader({ lng }) {
  const router = useRouter(lng);

  const switchLanguage = () => {
    if (lng === "en") {
      router.push(`/zh-TW/`);
    } else {
      router.push(`/en/`);
    }
  };

  return (
    <>
      <div className="absolute top-0 right-0">
        <div
          className="px-3 py-2 lg:px-5 lg:py-4 font-bold text-xl cursor-pointer"
          onClick={() => switchLanguage()}
          style={{ color: "#F1D6AE" }}
        >
          {lng === "en" ? "中" : "EN"}
        </div>
      </div>
    </>
  );
}

export function GameHeader({
  lng,
  mode,
  gameId,
  setShowChatRoom,
  setShowInstructions,
  menuRef,
  onEndGame,
}) {
  const router = useRouter();

  const extendRoom = () => {
    setShowChatRoom(true);
  };

  const backHome = () => {
    router.push(`/${lng}/`);
  };

  const showInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <>
      <div className="absolute top-0 left-0 flex">
        <div className="p-3 lg:p-5 cursor-pointer" onClick={() => backHome()}>
          <FontAwesomeIcon
            icon={faHouse}
            size="xl"
            style={{ color: "#F1D6AE", borderColor: "#3C3B3B" }}
          />
        </div>
        <div
          ref={menuRef}
          className="p-3 lg:p-5 cursor-pointer"
          onClick={() => showInstructions()}
        >
          <FontAwesomeIcon
            icon={faCircleQuestion}
            size="xl"
            style={{ color: "#F1D6AE", borderColor: "#3C3B3B" }}
          />
        </div>
      </div>
      {mode && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ color: "#FFF3E8", borderColor: "#3C3B3B" }}
        >
          {homeTranslate[lng][mode]}
        </div>
      )}

      {gameId && (
        <div ref={menuRef} className="absolute top-0 right-12 lg:right-16 lg:hidden">
          <div className="p-3" onClick={() => extendRoom()}>
            <FontAwesomeIcon
              icon={faComment}
              size="xl"
              style={{ color: "#F1D6AE", borderColor: "#3C3B3B" }}
            />
          </div>
        </div>
      )}
      {onEndGame && (
        <button
          type="button"
          className="absolute top-0 right-0 p-3 lg:p-5 cursor-pointer"
          onClick={onEndGame}
          aria-label="End game"
          title="End game"
        >
          <FontAwesomeIcon
            icon={faFlag}
            size="xl"
            style={{ color: "#F1D6AE", borderColor: "#3C3B3B" }}
          />
        </button>
      )}
    </>
  );
}

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomCode = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }
  return randomCode;
}

export async function generateUniqueRandomGameCode(maxAttempts = 5) {
  let randomCode;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < maxAttempts) {
    randomCode = generateRandomCode();
    try {
      exists = await checkGameIdExists(randomCode);
    } catch (error) {
      console.error("Error in generateUniqueRandomCode:", error);
      return null;
    }
    attempts++;
  }

  if (exists) {
    throw new Error(
      "Unable to generate a unique game ID after maximum attempts"
    );
  }

  return randomCode;
}
