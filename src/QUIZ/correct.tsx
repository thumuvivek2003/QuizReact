import React, { useMemo, useEffect } from "react";
import { Howl } from "howler";
import CorrectSound from "../assets/quiz-sounds/correct.wav";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import confetti from "canvas-confetti";

interface CorrectProps {
  onNext: () => void;
}

const Correct: React.FC<CorrectProps> = ({ onNext }) => {
  const correctSound = useMemo(() => {
    return new Howl({
      src: [CorrectSound],
      volume: 1,
    });
  }, []);

  useEffect(() => {
    // Play sound effect
    correctSound.play();

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    return () => {
      correctSound.stop();
    };
  }, [correctSound]);

  return (
    <div className="result-modal correct">
      <div className="result-icon">
        <FaCheckCircle />
      </div>
      <h2 className="result-title">Correct!</h2>
      <p className="result-message">Great job! You've answered correctly.</p>

      <button className="next-button" onClick={onNext}>
        <span>Next Question</span>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Correct;
