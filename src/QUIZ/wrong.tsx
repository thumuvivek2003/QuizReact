import React, { useMemo, useEffect } from "react";
import { Howl } from "howler";
import WrongSound from "../assets/quiz-sounds/wrong.wav";
import { FaTimesCircle, FaArrowRight, FaLightbulb } from "react-icons/fa";

interface WrongProps {
  onNext: () => void;
  correctAnswer?: string;
}

const Wrong: React.FC<WrongProps> = ({ onNext, correctAnswer = "Paris" }) => {
  const wrongSound = useMemo(() => {
    return new Howl({
      src: [WrongSound],
      volume: 1,
    });
  }, []);

  useEffect(() => {
    wrongSound.play();

    return () => {
      wrongSound.stop();
    };
  }, [wrongSound]);

  return (
    <div className="result-modal wrong">
      <div className="result-icon">
        <FaTimesCircle />
      </div>
      <h2 className="result-title">Wrong!</h2>
      {/* <div className="correct-answer">
        <FaLightbulb className="bulb-icon" />
        <p>
          The correct answer was: <span className="highlight">{correctAnswer}</span>
        </p>
      </div> */}
      <p className="result-message">
        Don't worry, you'll do better on the next one!
      </p>
      <button className="next-button" onClick={onNext}>
        <span>Next Question</span>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Wrong;
