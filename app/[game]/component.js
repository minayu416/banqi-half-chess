const chessWordMapping = {
    0: {
        "borderColor": "",
        "king": "將",
        "advisor": "士",
        "elephant": "象",
        "chariot": "車",
        "horse": "馬",
        "cannon": "砲",
        "soldier": "卒"
    },
    1: {
        "borderColor": "",
        "king": "帥",
        "advisor": "仕",
        "elephant": "相",
        "chariot": "俥",
        "horse": "傌",
        "cannon": "炮",
        "soldier": "兵"
    }
}

const banqiGeneratePolicy = {
    // black: 0, red: 1
    "colors": [0, 1],
    "chessOptions": {
        "king": 1,
        "advisor": 2,
        "elephant": 2,
        "chariot": 2,
        "horse": 2,
        "cannon": 2,
        "soldier": 5
    }
}

const banqiWeight = {
    "king": 9,
    "advisor": 8,
    "elephant": 7,
    "chariot": 6,
    "horse": 5,
    "cannon": 4,
    "soldier": 1
}



export const ChessGenerator = () => {
    const banqiGeneratedPool = [
    ]
    const { colors, chessOptions } = banqiGeneratePolicy;
    colors.forEach(color => {
        Object.keys(chessOptions).forEach(chess => {
            const sn = `${color}-${chess}`;
            for (let i = 0; i < chessOptions[chess]; i++) {
                banqiGeneratedPool.push({
                    sn: `${sn}-${i}`,
                    color: color === 0 ? "#000000" : "#CC0000",
                    type: chess,
                    weight: banqiWeight[chess],
                    chineseName: chessWordMapping[color][chess]
                });
            }
        });
    });

    return banqiGeneratedPool;
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


export const ChessShuffleHandler = () => {

    let shuffledChess = []
    const banqiPool = ChessGenerator()
    // position
    let i = 0
    shuffleArray(banqiPool).forEach(chess => {
        shuffledChess.push({
            position: i++,
            sn: chess.sn,
            // TODO: 先假設是翻開的。
            turned: true,
            color: chess.color,
            type: chess.type,
            weight: chess.weight,
            chineseName: chess.chineseName
        });
    })
    return shuffledChess;

};