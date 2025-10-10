import React, { useState } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

/*
data örneği:
export const data = [
  {
    question: "2 + 2 = ?",
    option1: "1",
    option2: "2",
    option3: "4",
    option4: "5",
    ans: 3 // doğru seçeneğin 1-4 arası indexi
  },
  ...
];
*/

export default function Quiz() {
  const [index, setIndex] = useState(0);         // aktif soru
  const [selected, setSelected] = useState(null); // tıklanan seçenek (1-4)
  const [locked, setLocked] = useState(false);    // soru kilitli mi?
  const [score, setScore] = useState(0);          // doğru sayısı
  const [finished, setFinished] = useState(false); // test bitti mi?

  const question = data[index];
  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ];

  const handlePick = (pickIdx) => {
    if (locked) return;
    setSelected(pickIdx);
    setLocked(true);
    if (pickIdx === Number(question.ans)) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (!locked) return; // cevap seçilmeden geçilmesin
    const last = index === data.length - 1;
    if (last) {
      setFinished(true);
      return;
    }
    // sonraki soruya geç
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
  };

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="container" style={{ top: 0 }}>
      <h1>Quiz App</h1>
      <hr />

      {!finished ? (
        <>
          <h2>
            {index + 1}. {question.question}
          </h2>

          <ul>
            {options.map((opt, i) => {
              const idx = i + 1; // 1..4
              // Kilitlendiğinde: doğru yeşil, yanlış seçtiğin kırmızı
              let cls = "";
              if (locked) {
                if (idx === Number(question.ans)) cls = "correct";
                else if (idx === selected) cls = "wrong";
              }
              return (
                <li
                  key={idx}
                  className={cls}
                  onClick={() => handlePick(idx)}
                >
                  {opt}
                </li>
              );
            })}
          </ul>

          <button onClick={next}>
            {index === data.length - 1 ? "Finish" : "Next"}
          </button>

          <div className="index">
            {index + 1} of {data.length} Questions — Score: {score}
          </div>
        </>
      ) : (
        <>
          <h2>
            You scored {score} out of {data.length}
          </h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
}