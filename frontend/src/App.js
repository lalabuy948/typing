import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import Axios from 'axios';

import { ESCAPE_KEY_CODE, LEFT_ARROW_KEY_CODE, RIGHT_ARROW_KEY_CODE } from './constants'

import { useKeyPress } from './hooks/keypress';
import { currentTime } from './services/time';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/global';
import { themesArray } from './styles/theme';

function App() {
  const [ currentThemeIndex, setCurrentThemeIndex ] = useState(0);

  const [ initialWords, setInitialWords ] = useState({ Quote: '' })
  const [ leftPadding, setLeftPadding ] = useState(new Array(10).fill(' ').join(''));
  const [ outgoingChars, setOutgoingChars ] = useState('');
  const [ currentChar, setCurrentChar ] = useState('');
  const [ incomingChars, setIncomingChars ] = useState('');

  const [ currentCharStyle, setCurrentCharStyle ] = useState();
  const [ statsStyle, setStatsStyle ] = useState({ 'opacity': 0.5 })

  const [ startTime, setStartTime ] = useState();
  const [ wordCount, setWordCount ] = useState(0);
  const [ wpm, setWpm ] = useState(0);
  const [ accuracy, setAccuracy ] = useState(0);
  const [ typedChars, setTypedChars ] = useState('');

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

  const pressKeyHandler = useCallback((event) => {

    if(event.keyCode == ESCAPE_KEY_CODE) {
      fetchQuote();
    }

    if (event.keyCode === LEFT_ARROW_KEY_CODE) {
      const curTheme = localStorage.getItem('theme');
      if (curTheme !== null) {
        const nextTheme = curTheme - 1;
        if (nextTheme >= 0) {
          setCurrentThemeIndex(nextTheme);
          localStorage.setItem('theme', nextTheme);
        }
      }
    }

    if (event.keyCode === RIGHT_ARROW_KEY_CODE) {
      const curTheme = localStorage.getItem('theme');
      if (curTheme !== null) {
        const nextTheme = parseInt(curTheme) + 1;
        if (nextTheme < themesArray.length) {
          setCurrentThemeIndex(nextTheme);
          localStorage.setItem('theme', nextTheme);
        }
      }
    }

  }, []);

  useEffect(() => {
    if (localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', currentThemeIndex);
    }
    setCurrentThemeIndex(localStorage.getItem('theme'));

    fetchQuote();

    document.addEventListener('keydown', pressKeyHandler, false);

    return () => {
      document.removeEventListener('keydown', pressKeyHandler, false);
    };
  }, []);

  useKeyPress(key => {
    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    if (key === currentChar) {
      setCurrentCharStyle();

      if (incomingChars === '') {
        setStatsStyle({
          'opacity': 1,
        });
      } else {
        setStatsStyle({
          'opacity': 0.5,
        });
      }

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
      setCurrentCharStyle({ 'color': themesArray[ currentThemeIndex ].mistakeColor });
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
      <ThemeProvider theme={ themesArray[ currentThemeIndex ] }>
          <>
              <GlobalStyles />
              <header className="app-header">

                  <p className="whole-quote">
                      { initialWords.Quote }
                  </p>

                  <p className="character">
                      <input className="hidden-input" ref={ input => input && input.focus() }/>
                      <span className="character-out">
                          {(leftPadding + outgoingChars).slice(-10)}
                      </span>
                      <span className="character-current" style={ currentCharStyle }>{currentChar === ' ' ? '_' : currentChar }</span>
                      <span>{incomingChars.substr(0, 20)}</span>
                  </p>

                  <br/>

                  <p className="author-paragraph">
                      © { initialWords.Author }
                  </p>

                  <h4 className="stats-paragraph" style={ statsStyle }>
                      WPM: {wpm} | ACC: {accuracy}%
                  </h4>

                  <div className="footer">theme: { themesArray[ currentThemeIndex ].name } | <a href="https://github.com/lalabuy948/typing">github</a></div>
              </header>
          </>
      </ThemeProvider>
  );
}

export default App;
