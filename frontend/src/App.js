import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import Axios from 'axios';

import { useKeyPress } from './hooks/keypress';
import { currentTime } from './services/time';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from "./styles/global";
import { darkTheme } from "./styles/theme";


function App() {
  const [initialWords, setInitialWords] = useState({ Quote: ''})
  const [leftPadding, setLeftPadding] = useState(new Array(10).fill(' ').join(''));
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState('');
  const [incomingChars, setIncomingChars] = useState('');

  const [currentCharStyle, setCurrentCharStyle] = useState();
  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  async function fetchQuote() {
    const response = await Axios(process.env.REACT_APP_QUOTE_URL);


    setOutgoingChars('')
    setLeftPadding(new Array(10).fill(' ').join(''))
    setInitialWords(response.data);
    setCurrentChar(response.data.Quote.charAt(0));
    setIncomingChars(response.data.Quote.substr(1));
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  const escFunction = useCallback((event) => {
    if(event.keyCode === 27) {
      fetchQuote();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useKeyPress(key => {
    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    if (key === currentChar) {
      setCurrentCharStyle()

      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      updatedOutgoingChars += currentChar;
 
      setOutgoingChars(updatedOutgoingChars);
      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      setIncomingChars(updatedIncomingChars);

      if (incomingChars.charAt(0) === ' ') {
        setWordCount(wordCount + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
    } else {
      setCurrentCharStyle({"color": '#f73859'})
    }

    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);
    setAccuracy(
      (
        (updatedOutgoingChars.length * 100) / updatedTypedChars.length)
        .toFixed(2),
    );
  });

  return (
    <ThemeProvider theme={darkTheme}>
    <>
    <GlobalStyles />

        <header className="app-header">

          <p className="whole-quote">
            { initialWords.Quote }
          </p>

          <p className="Character">
            <span className="Character-out">
                {(leftPadding + outgoingChars).slice(-10)}
            </span>
            <span className="Character-current" style={currentCharStyle}>{currentChar === ' ' ? '_' : currentChar }</span>
            <span>{incomingChars.substr(0, 20)}</span>
          </p>

          <br/>

          <p className="author-paragraph">
            © { initialWords.Author }
          </p>

          <h4 className="stats-paragraph">
            WPM: {wpm} | ACC: {accuracy}%
          </h4>

        </header>

      </>
    </ThemeProvider>
  );
}

export default App;
