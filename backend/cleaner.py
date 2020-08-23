import json


def is_ascii(s):
    return all(ord(c) < 128 for c in s)


def main():
    filtered_quotes = []
    with open('quotes.json') as json_file:
        quotes = json.load(json_file)
        for quote in quotes:
            quoteStr = quote.get('Quote')
            if quoteStr is not None and len(quoteStr) <= 150:
                flag = True
                for char in quoteStr:
                    check = is_ascii(char)
                    if check is False:
                        flag = check
                if flag is True:
                    filtered_quotes.append(quote)

    with open('quotes.json', 'w') as outfile:
        json.dump(filtered_quotes, outfile)


if __name__ == "__main__":
    main()
