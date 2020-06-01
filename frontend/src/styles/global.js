import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
body {
    margin: 0;
    font-family: Menlo, monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

.app-header {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);

    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
}

.whole-quote {
    width: 60vh;
    opacity: 0.5;
}

.Character {
    white-space: pre;
    line-height: 1.6rem;
    font-size: 2rem;
}

.Character-current {
    color: ${props => props.theme.currentText}
}

.author-paragraph {
    font-size: 1.5rem;
    opacity: 0.5;
}

.Character-out {
    color: ${props => props.theme.typedText};
}

.stats-paragraph {
    opacity: 0.5;
}

`