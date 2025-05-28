// Single Mode Computer

// TODO: 先用mockData開發，完成後刪掉
const mockData = [
  {
    position: 0,
    sn: "r-soldier-0",
    turned: false,
    color: "#CC0000",
    type: "soldier",
    weight: 1,
    chineseName: "兵",
  },
  {
    position: 1,
    sn: "r-cannon-1",
    turned: true,
    color: "#CC0000",
    type: "cannon",
    weight: 4,
    chineseName: "炮",
  },
  {
    position: 2,
    sn: "b-elephant-1",
    turned: false,
    color: "#000000",
    type: "elephant",
    weight: 7,
    chineseName: "象",
  },
  {
    position: 3,
    sn: "r-chariot-0",
    turned: true,
    color: "#CC0000",
    type: "chariot",
    weight: 6,
    chineseName: "俥",
  },
  {
    position: 4,
    sn: "b-elephant-0",
    turned: false,
    color: "#000000",
    type: "elephant",
    weight: 7,
    chineseName: "象",
  },
  {
    position: 5,
    sn: "r-king-0",
    turned: true,
    color: "#CC0000",
    type: "king",
    weight: 9,
    chineseName: "帥",
  },
  {
    position: 6,
    sn: "r-soldier-1",
    turned: false,
    color: "#CC0000",
    type: "soldier",
    weight: 1,
    chineseName: "兵",
  },
  {
    position: 7,
    sn: "r-elephant-1",
    turned: false,
    color: "#CC0000",
    type: "elephant",
    weight: 7,
    chineseName: "相",
  },
  {
    position: 8,
    sn: "b-horse-1",
    turned: true,
    color: "#000000",
    type: "horse",
    weight: 5,
    chineseName: "馬",
  },
  {
    position: 9,
    sn: "b-cannon-0",
    turned: false,
    color: "#000000",
    type: "cannon",
    weight: 4,
    chineseName: "砲",
  },
  {
    position: 10,
    sn: "b-king-0",
    turned: true,
    color: "#000000",
    type: "king",
    weight: 9,
    chineseName: "將",
  },
  ".",
  {
    position: 11,
    sn: "b-soldier-4",
    turned: true,
    color: "#000000",
    type: "soldier",
    weight: 1,
    chineseName: "卒",
  },
  {
    position: 13,
    sn: "r-chariot-1",
    turned: true,
    color: "#CC0000",
    type: "chariot",
    weight: 6,
    chineseName: "俥",
  },
  {
    position: 14,
    sn: "b-advisor-1",
    turned: false,
    color: "#000000",
    type: "advisor",
    weight: 8,
    chineseName: "士",
  },
  {
    position: 15,
    sn: "r-elephant-0",
    turned: true,
    color: "#CC0000",
    type: "elephant",
    weight: 7,
    chineseName: "相",
  },
  {
    position: 16,
    sn: "b-soldier-2",
    turned: false,
    color: "#000000",
    type: "soldier",
    weight: 1,
    chineseName: "卒",
  },
  {
    position: 17,
    sn: "r-soldier-2",
    turned: true,
    color: "#CC0000",
    type: "soldier",
    weight: 1,
    chineseName: "兵",
  },
  {
    position: 18,
    sn: "b-soldier-3",
    turned: false,
    color: "#000000",
    type: "soldier",
    weight: 1,
    chineseName: "卒",
  },
  {
    position: 19,
    sn: "b-soldier-0",
    turned: true,
    color: "#000000",
    type: "soldier",
    weight: 1,
    chineseName: "卒",
  },
  {
    position: 20,
    sn: "b-horse-0",
    turned: false,
    color: "#000000",
    type: "horse",
    weight: 5,
    chineseName: "馬",
  },
  {
    position: 21,
    sn: "r-cannon-0",
    turned: true,
    color: "#CC0000",
    type: "cannon",
    weight: 4,
    chineseName: "炮",
  },
  {
    position: 22,
    sn: "r-horse-1",
    turned: true,
    color: "#CC0000",
    type: "horse",
    weight: 5,
    chineseName: "傌",
  },
  ".",
  {
    position: 24,
    sn: "b-chariot-0",
    turned: true,
    color: "#000000",
    type: "chariot",
    weight: 6,
    chineseName: "車",
  },
  {
    position: 25,
    sn: "b-cannon-1",
    turned: true,
    color: "#000000",
    type: "cannon",
    weight: 4,
    chineseName: "砲",
  },
  {
    position: 26,
    sn: "b-chariot-1",
    turned: false,
    color: "#000000",
    type: "chariot",
    weight: 6,
    chineseName: "車",
  },
  {
    position: 27,
    sn: "r-advisor-0",
    turned: true,
    color: "#CC0000",
    type: "advisor",
    weight: 8,
    chineseName: "仕",
  },
  {
    position: 28,
    sn: "b-soldier-1",
    turned: false,
    color: "#000000",
    type: "soldier",
    weight: 1,
    chineseName: "卒",
  },
  {
    position: 29,
    sn: "r-soldier-4",
    turned: true,
    color: "#CC0000",
    type: "soldier",
    weight: 1,
    chineseName: "兵",
  },
  {
    position: 30,
    sn: "r-advisor-1",
    turned: true,
    color: "#CC0000",
    type: "advisor",
    weight: 8,
    chineseName: "仕",
  },
  {
    position: 23,
    sn: "b-advisor-0",
    turned: true,
    color: "#000000",
    type: "advisor",
    weight: 8,
    chineseName: "士",
  },
];

const mockActiveData = {
  sn: "r-soldier-3",
  position: 31,
  chess: {
    position: 31,
    sn: "r-soldier-3",
    turned: true,
    color: "#CC0000",
    type: "soldier",
    weight: 1,
    chineseName: "兵",
  },
};
// "空格"
const mockOverData = {
  position: 23,
  chess: ".",
};

const leftEdge = [0, 8, 16, 24];
const rightEdge = [7, 15, 23, 31];

// TODO: 他會先取得玩家更新後的棋盤
// TODO: 將可以走的部署全部render 成一個 list
// TODO: 隨機取一步，然後下，然後記得要改成玩家
// TODO: 設計一個function當判斷了無可以走，根據最後吃得子跟誰吃得多算分數給win跟lose

const isLegalMove = () => {};

// Easy Computer
export const easyComputer = (
  shuffledChess,
  computerSide,
  rules,
  emitChange
) => {
  let legalMoves = [];
  console.log(shuffledChess);

  for (let i = 0; i < shuffledChess.length; i++) {
    const fromChess = shuffledChess[i];
    const activeData = {
      sn: fromChess.sn,
      position: fromChess.position,
      chess: {
        position: fromChess.position,
        sn: fromChess.sn,
        turned: fromChess.turned,
        color: fromChess.color,
        type: fromChess.type,
        weight: fromChess.weight,
        chineseName: fromChess.chineseName,
      },
    };

    // 如果棋子是空格或者已經翻開但不是電腦方的棋子，就不去動它
    if (fromChess === "." || fromChess.sn[0] !== computerSide) continue;

    // 先判斷是否回 . 再判斷是否為 turned
    if (!fromChess.turned) {
      if (!activeData.sn) console.log(i);
      legalMoves.push([activeData, null]);
    }

    // TODO: 是砲就額外處理
    if (rules.isCannon(activeData)) {
    }

    // 計算可移動範圍

    const { position } = activeData;

    // 根據左右Edge計算可左右移動的位置
    let capableMoves = [];
    if (leftEdge.includes(position)) {
      capableMoves.push(position + 1);
    } else if (rightEdge.includes(position)) {
      capableMoves.push(position - 1);
    } else {
      capableMoves.push(position - 1, position + 1);
    }
    // 根據排數去計算可上下移動的位置
    const line = position / 7;
    // 第一排，只能往下移
    if (line < 1) {
      capableMoves.push(position + 8);
      // 最後一排，只能往上移
    } else if (line > 3) {
      capableMoves.push(position - 8);
    } else {
      capableMoves.push(position - 8, position + 8);
    }

    capableMoves.forEach((move) => {
      const targetPosition = shuffledChess[move];
      let overData;
      if (targetPosition === ".") {
        overData = {
          position: move,
          chess: ".",
        };
      } else {
        overData = {
          sn: targetPosition.sn,
          position: move,
          chess: {
            position: move,
            sn: targetPosition.sn,
            turned: targetPosition.turned,
            color: targetPosition.color,
            type: targetPosition.type,
            weight: targetPosition.weight,
            chineseName: targetPosition.chineseName,
          },
        };
      }

      // 判斷目標位置是否為空
      if (rules.isMoveToEmptyPlace(overData)) {
        if (!activeData.sn) console.log(i, move);
        legalMoves.push([activeData, overData]);
        return;
      }
      // 不能吃同一方
      if (rules.isSameSide(activeData, overData)) return;
      // 不能吃尚未翻開的棋子
      if (!overData.turned) return;
      // 如果是兵且對方是將，可以吃
      if (rules.isSolderCanCommit(activeData, overData)) {
        if (!activeData.sn) console.log(i, move);
        legalMoves.push([activeData, overData]);
        return;
      }
      if (rules.isKingCanCommit(activeData, overData)) {
        if (!activeData.sn) console.log(i, move);
        legalMoves.push([activeData, overData]);
        return;
      }

      if (rules.canCommit(activeData, overData)) {
        if (!activeData.sn) console.log(i, move);

        legalMoves.push([activeData, overData]);
        return;
      }
    });
  }
  console.log(legalMoves);

  // TODO: 判斷輸贏
  if (legalMoves.length === 0) {
    setEventInfo("電腦無法移動");
    return;
  }

  const decidedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  console.log(decidedMove);
  emitChange(decidedMove[0], decidedMove[1]);

  return;
};
