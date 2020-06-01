import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import Axios from 'axios';

import { useKeyPress } from './hooks/keypress';
import { currentTime } from './services/time';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/global';
import { dark, light, mint } from './styles/theme';
import { getNameByTheme, getThemeByName } from './styles/themeSwitcher';

function App() {
  const [currentTheme, setCurrentTheme] = useState( dark )

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

  // fetch new quote aka reset
  async function fetchQuote() {
    const response = await Axios(process.env.REACT_APP_QUOTE_URL);


    setLeftPadding(new Array(10).fill(' ').join(''));
    setInitialWords(response.data);
    setCurrentChar(response.data.Quote.charAt(0));
    setIncomingChars(response.data.Quote.substr(1));
    setWpm(0);
    setStartTime();
    setWordCount(0);
    setOutgoingChars('');
    setTypedChars('');
  }

  useEffect(() => {
    if (localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', getNameByTheme(currentTheme));
    }
    setCurrentTheme(getThemeByName(localStorage.getItem('theme')));

    fetchQuote();

    document.addEventListener("keydown", pressKeyHandler, false);

    return () => {
      document.removeEventListener("keydown", pressKeyHandler, false);
    };
  }, []);

  const pressKeyHandler = useCallback((event) => {
    if(event.keyCode === 27) {
      fetchQuote();
    }

    if (event.keyCode === 112) {
      setCurrentTheme( light )
      localStorage.setItem('theme', getNameByTheme(light));
    }

    if (event.keyCode === 113) {
      setCurrentTheme( dark )
      localStorage.setItem('theme', getNameByTheme(dark));
    }

    if (event.keyCode === 114) {
      setCurrentTheme( mint )
      localStorage.setItem('theme', getNameByTheme(mint));
    }

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
      setCurrentCharStyle({"color": currentTheme.misstakeColor})
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
    <ThemeProvider theme={currentTheme}>
    <>
    <GlobalStyles />
        <header className="app-header">

          <p className="whole-quote">
            { initialWords.Quote }
          </p>

          <p className="character">
            <input className="hidden-input" ref={input => input && input.focus()}/>
            <span className="character-out">
                {(leftPadding + outgoingChars).slice(-10)}
            </span>
            <span className="character-current" style={currentCharStyle}>{currentChar === ' ' ? '_' : currentChar }</span>
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
