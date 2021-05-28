const bold = '\x1b[1m';
const italic = '\x1b[3m';
const underline = '\x1b[4';
const strikethrough = '\x1b[9';

const foregrounds: any = {
    black:          '\x1b[30m',
    darkRed:        '\x1b[31m',
    darkGreen:      '\x1b[32m',
    darkYellow:     '\x1b[33m',
    darkBlue:       '\x1b[34m',
    darkMagenta:    '\x1b[35m',
    darkCyan:       '\x1b[36m',
    lightGray:      '\x1b[37m',
    gray:           '\x1b[90m',
    red:            '\x1b[91m',
    green:          '\x1b[92m',
    yellow:         '\x1b[93m',
    blue:           '\x1b[94m',
    magenta:        '\x1b[95m',
    cyan:           '\x1b[96m',
    white:          '\x1b[97m',
}

const backgrounds: any = {
    black:          '\x1b[40m',
    darkRed:        '\x1b[41m',
    darkGreen:      '\x1b[42m',
    darkYellow:     '\x1b[43m',
    darkBlue:       '\x1b[44m',
    darkMagenta:    '\x1b[45m',
    darkCyan:       '\x1b[46m',
    lightGray:      '\x1b[47m',
    gray:           '\x1b[100m',
    red:            '\x1b[101m',
    green:          '\x1b[102m',
    yellow:         '\x1b[103m',
    blue:           '\x1b[104m',
    magenta:        '\x1b[105m',
    cyan:           '\x1b[106m',
    white:          '\x1b[107m',
}

function getFG(name: string): string {

    name = name.toLowerCase();
    let fg: string|undefined = Object.keys(foregrounds).find(
        (key: string) => key.toLowerCase() === name
    );
    return fg? foregrounds[fg]: null;
}

function getBG(name: string): string {

    name = name.toLowerCase();
    let bg: string|undefined = Object.keys(backgrounds).find(
        (key: string) => key.toLowerCase() === name
    );
    return bg? backgrounds[bg]: null;
}

function createANSI(
    isBold: boolean = false,
    isItalic: boolean = false,
    isUnderlined: boolean = false,
    isStrikenThrough: boolean = false,
    fg?: string,
    bg?: string
    ) {
        let style: string = '';

        if(isBold)
            style += bold;
        if(isItalic)
            style += italic;
        if(isUnderlined)
            style += underline;
        if(isStrikenThrough)
            style += strikethrough;
        if(fg) 
            style += fg;
        if(bg)
            style += fg;

        return style;
}

export default function(text: string): string {

    const TOKENIZER = /(?:<)(\/?)([^:>]+)(((?::)[^:>]+)*)(?:>)/gm;

    const BOLD_TOKEN = 'bold';
    const ITALIC_TOKEN = 'italic';
    const UNDERLINE_TOKEN = 'underline';
    const STRIKETHROUGH_TOKEN = 'strike';
    const FG_TOKEN = 'fg';
    const BG_TOKEN = 'bg';
    const RESET = '\x1b[0m';

    let bolds: number = 0;
    let italics: number = 0;
    let underlines: number = 0;
    let strikethroughs: number = 0;
    let fgs: string[] = [];
    let bgs: string[] = [];

    return text.replace(/(?:<)(\/?)([^:>]+)(((?::)[^:>]+)*)(?:>)/gm, (_0, slash: string, main: string, _1, subs: string) => {
        let sub_tokens = subs?.substring(1).split(':') ?? [];
        if(slash) {
            switch(main.toLowerCase()) {
            case BOLD_TOKEN.toLowerCase():
                if(bolds > 0)
                    --bolds;
                break;
            case ITALIC_TOKEN.toLowerCase():
                if(italics > 0)
                    --italics;
                break;
            case UNDERLINE_TOKEN.toLowerCase():
                if(underlines > 0)
                    --underlines;
                break;
            case STRIKETHROUGH_TOKEN.toLowerCase():
                if(strikethroughs > 0)
                    --strikethroughs;
                break;
            case FG_TOKEN:
                if(sub_tokens[0]) {
                    let index = fgs.lastIndexOf(getFG(sub_tokens[0]));
                    if(index >= 0)
                        fgs.splice(index, 1);
                } else {
                    fgs.pop();
                }
                break;
            case BG_TOKEN:
                if(sub_tokens[0]) {
                    let index = bgs.lastIndexOf(getBG(sub_tokens[0]));
                    if(index >= 0)
                        bgs.splice(index, 1);
                } else {
                    bgs.pop();
                }
                break;
            }
            return RESET + createANSI(bolds > 0, italics > 0, underlines > 0, strikethroughs > 0, fgs[fgs.length - 1], bgs[bgs.length - 1]);
        } else {
            switch(main.toLowerCase()) {
            case BOLD_TOKEN.toLowerCase():
                ++bolds;
                return bold;
            case ITALIC_TOKEN.toLowerCase():
                ++italics;
                return italic;
            case UNDERLINE_TOKEN.toLowerCase():
                ++underlines;
                return underline;
            case STRIKETHROUGH_TOKEN.toLowerCase():
                ++strikethroughs;
                return strikethrough;
            case FG_TOKEN:
                if(sub_tokens[0]) {
                    let fg = getFG(sub_tokens[0]);
                    if(fg) {
                        fgs.push(fg);
                        return fg;
                    }
                }
                break;
            case BG_TOKEN:
                let bg = getBG(sub_tokens[0]);
                if(bg) {
                    bgs.push(bg);
                    return bg;
                }
                break;
            }
        }
        return '';
    });
}