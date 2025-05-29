// Single Mode Computer

const leftEdge = [0, 8, 16, 24];
const rightEdge = [7, 15, 23, 31];
const cannonLeftEdge = [0, 8, 16, 24, 1, 9, 17, 25];
const cannonRightEdge = [7, 15, 23, 31, 6, 14, 22, 30];

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
      legalMoves.push([activeData, null]);
      continue;
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
        legalMoves.push([activeData, overData]);
      }
      // 不能吃同一方
      if (rules.isSameSide(activeData, overData)) return;
      // 不能吃尚未翻開的棋子
      if (!overData.turned) return;
      // 如果是兵且對方是將，可以吃
      if (rules.isSolderCanCommit(activeData, overData)) {
        legalMoves.push([activeData, overData]);
        return;
      }
      if (rules.isKingCanCommit(activeData, overData)) {
        legalMoves.push([activeData, overData]);
        return;
      }

      if (
        rules.canCommit(activeData, overData) &&
        !rules.isCannon(activeData)
      ) {
        legalMoves.push([activeData, overData]);
        return;
      }

      // 是砲就額外處理
      if (rules.isCannon(activeData)) {
        if (position / 7 < 2) {
          const veticalJump = position + 16;
          const middleChess = position + 8;
          if (
            shuffledChess[middleChess] !== "." &&
            shuffledChess[veticalJump] !== "." &&
            shuffledChess[veticalJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[veticalJump].sn,
              position: shuffledChess[veticalJump].position,
              chess: {
                ...shuffledChess[veticalJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
        }
        if (position / 7 > 1) {
          const veticalJump = position - 16;
          const middleChess = position - 8;
          if (
            shuffledChess[middleChess] !== "." &&
            shuffledChess[veticalJump] !== "." &&
            shuffledChess[veticalJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[veticalJump].sn,
              position: shuffledChess[veticalJump].position,
              chess: {
                ...shuffledChess[veticalJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
        }

        if (cannonLeftEdge.includes(position)) {
          const horizontalJump = position + 2;
          const middleChess = position + 1;
          if (
            shuffledChess[middleChess] !== "." &&
            shuffledChess[horizontalJump] !== "." &&
            shuffledChess[horizontalJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[horizontalJump].sn,
              position: shuffledChess[horizontalJump].position,
              chess: {
                ...shuffledChess[horizontalJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
        } else if (cannonRightEdge.includes(position)) {
          const horizontalJump = position - 2;
          const middleChess = position - 1;
          if (
            shuffledChess[middleChess] !== "." &&
            shuffledChess[horizontalJump] !== "." &&
            shuffledChess[horizontalJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[horizontalJump].sn,
              position: shuffledChess[horizontalJump].position,
              chess: {
                ...shuffledChess[horizontalJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
        } else {
          const leftJump = position - 2;
          const leftMiddleChess = position - 1;
          const rightJump = position + 2;
          const rightMiddleChess = position + 1;
          if (
            shuffledChess[leftMiddleChess] !== "." &&
            shuffledChess[leftJump] !== "." &&
            shuffledChess[leftJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[leftJump].sn,
              position: shuffledChess[leftJump].position,
              chess: {
                ...shuffledChess[leftJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
          if (
            shuffledChess[rightMiddleChess] !== "." &&
            shuffledChess[rightJump] !== "." &&
            shuffledChess[rightJump].sn[0] !== computerSide
          ) {
            overData = {
              sn: shuffledChess[rightJump].sn,
              position: shuffledChess[rightJump].position,
              chess: {
                ...shuffledChess[rightJump],
              },
            };
            legalMoves.push([activeData, overData]);
          }
        }
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
