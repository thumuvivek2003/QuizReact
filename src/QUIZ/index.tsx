import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import "./Quiz.css";
import Bgm from "../assets/quiz-sounds/bg.mp3";
import Correct from "./correct";
import Wrong from "./wrong";
import { FaMusic, FaVolumeMute, FaCheck, FaClock } from "react-icons/fa";
import axios from "axios";
import { IoMdHelpCircle } from "react-icons/io";
import { BiSolidArrowFromLeft } from "react-icons/bi";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const backgroundMusic = new Howl({
  src: [Bgm],
  autoplay: false,
  loop: true,
  volume: 0.5,
});

const Quiz: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const getQuestionData = async (lang: string) => {
    if (lang === "te") {
      try {
        // Make a GET request to your backend API
        const response = await axios.get(
          "http://82.25.109.126:5050/getQuestion"
        );

        // Assuming the response is in the desired format
        const { question, options, answer } = response.data;

        return {
          question: question,
          options: options,
          answer: answer,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        // Return default data in case of an error
        return {
          question: "Error fetching question",
          options: [],
          answer: "",
        };
      }
    } else {
      return {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars",
      };
    }
  };

  useEffect(() => {
    const fetchQuestionData = async () => {
      const questionData = await getQuestionData("te");
      setQuestion(questionData);

      if (isMusicOn) {
        backgroundMusic.play();
      }

      return () => {
        backgroundMusic.stop();
      };
    };

    fetchQuestionData();
  }, [isMusicOn]);

  useEffect(() => {
    if (!showModal && question) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleOptionClick("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showModal, question]);

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
    setIsCorrect(option === question?.answer);
    setShowModal(true);
  };

  const handleNextQuestion = async (): Promise<void> => {
    setSelectedOption(null);
    setShowModal(false);
    setTimeLeft(30);
    const questionData = await getQuestionData("te");
    setQuestion(questionData);
  };

  const toggleMusic = () => {
    if (isMusicOn) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }
    setIsMusicOn(!isMusicOn);
  };

  if (!question) {
    return (
      <div className="quiz-loading">
        <div className="spinner"></div>
        <p>Preparing your quiz experience...</p>
      </div>
    );
  }

  return (
    <div
      className="quiz-container"
      style={{ borderWidth: 1, borderColor: "white" }}
    >
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-text">Developed by the JCVC Tech Team</div>
        </div>
        <button
          className="sound-button"
          onClick={toggleMusic}
          aria-label="Toggle music"
        >
          {isMusicOn ? <FaMusic /> : <FaVolumeMute />}
        </button>
      </div>

      <div className="quiz-card">
        {!showModal ? (
          <>
            <div className="timer-container">
              <FaClock className="timer-icon" />
              <div className="timer-bar">
                <div
                  className="timer-fill"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
              <span className="timer-text">{timeLeft}s</span>
            </div>

            <div className="question-container">
              <h2 className="question-text">{question.question}</h2>
            </div>

            <div className="options-grid">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-card ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">{option}</div>
                  {selectedOption === option && (
                    <div className="option-check">
                      <FaCheck />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result-container">
            {isCorrect ? (
              <Correct onNext={handleNextQuestion} />
            ) : (
              <Wrong onNext={handleNextQuestion} />
            )}
          </div>
        )}
      </div>

      {/* <div className="quiz-footer">
        <button className="hint-button">
          <IoMdHelpCircle className="hint-icon" />
          <span>Hint</span>
        </button>
        <button className="skip-button" onClick={handleNextQuestion}>
          <span>Skip</span>
          <BiSolidArrowFromLeft className="skip-icon" />
        </button>
      </div> */}
    </div>
  );
};

export default Quiz;
