from flask import Flask, render_template, request

app = Flask(__name__)

MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ',': '--..--', '.': '.-.-.-', '?': '..--..',
    '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-', ' ': '/'
}
MORSE_TO_TEXT_DICT = {v: k for k, v in MORSE_CODE_DICT.items()}

def text_to_morse(text):
    text = text.upper()
    return ' '.join(MORSE_CODE_DICT.get(char, '') for char in text if char in MORSE_CODE_DICT)

def morse_to_text(morse_code):
    words = morse_code.split(' / ') 
    decoded_words = []
    
    for word in words:
        decoded_chars = [MORSE_TO_TEXT_DICT.get(code, '') for code in word.split()]
        decoded_words.append(''.join(decoded_chars))
    
    return ' '.join(decoded_words)

@app.route('/', methods=['GET', 'POST'])
def index():
    result = ""
    text=""
    conversion_type = "text_to_morse"

    if request.method == 'POST':
        text = request.form.get('text', "").strip()
        conversion_type = request.form.get('conversion', "text_to_morse")

        if conversion_type == 'text_to_morse':
            result = text_to_morse(text)

        elif conversion_type == 'morse_to_text':
            result = morse_to_text(text)

    return render_template('index.html', result=result, morse_dict=MORSE_CODE_DICT,conversion_type=conversion_type)

if __name__ == '__main__':
    app.run(debug=True)
