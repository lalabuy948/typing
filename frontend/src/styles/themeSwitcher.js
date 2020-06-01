import { dark, light, mint } from './theme';


export function getNameByTheme(theme) {
    switch(theme) {
        case dark:
            return 'dark'
        case light:
            return 'light'
        case mint:
            return 'mint'
    };
};

export function getThemeByName(name) {
    switch(name) {
        case 'dark':
            return dark
        case 'light':
            return light
        case 'mint':
            return mint
    };
};
