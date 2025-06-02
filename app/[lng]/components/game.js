import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { instruction } from "@/app/[lng]/translate";

export const i18nChessMapping = {
  en: {
    b: "Black",
    r: "Red",
    chess: {
      b: {
        king: "King (將)",
        advisor: "Advisor (士)",
        elephant: "Elephant (象)",
        chariot: "Chariot (車)",
        horse: "Horse (馬)",
        cannon: "Cannon (砲)",
        soldier: "Soldier (卒)",
      },
      r: {
        king: "King (帥)",
        advisor: "Advisor (仕)",
        elephant: "Elephant (相)",
        chariot: "Chariot (俥)",
        horse: "Horse (傌)",
        cannon: "Cannon (炮)",
        soldier: "Soldier (兵)",
      },
    },
  },
  "zh-TW": {
    b: "黑方",
    r: "紅方",
    chess: {
      b: {
        king: "將",
        advisor: "士",
        elephant: "象",
        chariot: "車",
        horse: "馬",
        cannon: "砲",
        soldier: "卒",
      },
      r: {
        king: "帥",
        advisor: "仕",
        elephant: "相",
        chariot: "俥",
        horse: "傌",
        cannon: "炮",
        soldier: "兵",
      },
    },
  },
};

export const chessStyle = {
  b: {
    color: "#000000",
    king: "將",
    word: "黑方",
  },
  r: {
    color: "#CC0000",
    king: "帥",
    word: "紅方",
  },
};

const chessWordMapping = {
  b: {
    borderColor: "",
    king: "將",
    advisor: "士",
    elephant: "象",
    chariot: "車",
    horse: "馬",
    cannon: "砲",
    soldier: "卒",
  },
  r: {
    borderColor: "",
    king: "帥",
    advisor: "仕",
    elephant: "相",
    chariot: "俥",
    horse: "傌",
    cannon: "炮",
    soldier: "兵",
  },
};

const banqiGeneratePolicy = {
  // black: b, red: r
  colors: ["b", "r"],
  chessOptions: {
    king: 1,
    advisor: 2,
    elephant: 2,
    chariot: 2,
    horse: 2,
    cannon: 2,
    soldier: 5,
  },
};

const banqiWeight = {
  king: 9,
  advisor: 8,
  elephant: 7,
  chariot: 6,
  horse: 5,
  cannon: 4,
  soldier: 1,
};

export const ChessGenerator = () => {
  const banqiGeneratedPool = [];
  const { colors, chessOptions } = banqiGeneratePolicy;
  colors.forEach((color) => {
    Object.keys(chessOptions).forEach((chess) => {
      const sn = `${color}-${chess}`;
      for (let i = 0; i < chessOptions[chess]; i++) {
        banqiGeneratedPool.push({
          sn: `${sn}-${i}`,
          color: color === "b" ? "#000000" : "#CC0000",
          type: chess,
          weight: banqiWeight[chess],
          chineseName: chessWordMapping[color][chess],
        });
      }
    });
  });

  return banqiGeneratedPool;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const ChessShuffleHandler = () => {
  let shuffledChess = [];
  const banqiPool = ChessGenerator();
  // position
  let i = 0;
  shuffleArray(banqiPool).forEach((chess) => {
    shuffledChess.push({
      position: i++,
      sn: chess.sn,
      turned: false,
      color: chess.color,
      type: chess.type,
      weight: chess.weight,
      chineseName: chess.chineseName,
    });
  });
  return shuffledChess;
};

export function Instructions({ lng, setShowInstructions }) {
  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <>
      <div
        className="absolute w-full h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 4 }}
      ></div>
      <div
        className="absolute h-4/5 w-4/6 text-md lg:h-2/6 xl:w-3/6 2xl:w-2/5 top-[10%] left-[20%] rounded-md border-4 p-4"
        style={{
          backgroundColor: "#F1D6AE",
          borderColor: "#B59376",
          zIndex: 5,
        }}
      >
        <div
          className="absolute top-0 right-0 p-1 cursor-pointer"
          onClick={() => closeInstructions()}
        >
          <FontAwesomeIcon
            icon={faXmark}
            size="2xl"
            style={{ color: "#B59376" }}
          />
        </div>
        <p className="font-bold" style={{ color: "#96602E" }}>
          1. {instruction[lng].rule1}
        </p>
        <p className="font-bold" style={{ color: "#96602E" }}>
          2. {instruction[lng].rule2}
        </p>
        <p className="font-bold" style={{ color: "#96602E" }}>
          3. {instruction[lng].rule3}
        </p>
        <p className="font-bold" style={{ color: "#96602E" }}>
          4. {instruction[lng].rule4}
        </p>
        <p className="font-bold" style={{ color: "#96602E" }}>
          5. {instruction[lng].rule5}
        </p>
      </div>
    </>
  );
}
