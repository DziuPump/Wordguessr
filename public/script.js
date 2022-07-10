let theWord = document.querySelector("#zodis");
let wordGetter = document.querySelector("#getWordButton");
let sliderMin = document.querySelector("#minLetter");
let sliderMax = document.querySelector("#maxLetter");
let numberMin = document.querySelector("#numberMin");
let numberMax = document.querySelector("#numberMax");
let lettersButtons = document.querySelectorAll('.letterButton');
let tryNumber = document.querySelector("#numberOfTries");
let wordData, word, zipfWord, element, tries;
let guessedCorrectly;
let abc = 'qwertyuiopasdfghjklzxcvbnm';
let wordFound = false;

const disableAllLetterButtons = (state) => {
    for (let i = 0; i < 26; i++) {
        document.getElementById(abc[i]).disabled = state;
        document.getElementById(abc[i]).style.cursor = "not-allowed";
    }

    if (state === false) {
        for (let i = 0; i < 26; i++) {
            document.getElementById(abc[i]).style.cursor = "pointer";
        }
    }
}

const whiteLetterBorders = () => {
    for (let i = 0; i < 26; i++) {
        document.getElementById(abc[i]).style.border = "solid rgb(255, 255, 255)";
    }
}

const disableSingleButton = (letter) => {
    document.getElementById(letter.toLowerCase()).disabled = true;
    document.getElementById(letter.toLowerCase()).style.cursor = "not-allowed";
}

disableAllLetterButtons(true);

const options = {
    method: 'GET',
    url: 'https://wordsapiv1.p.rapidapi.com/words/',
    headers: {
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        'X-RapidAPI-Key': '86806f5be4msh03378cc0763688cp19c88djsna7ec19c32072'
    },
    params: {
        hasDetails: 'synonyms',
        hasDetails: 'frequency',
        limit: '10',
        frequency: '3'
    }
};

const frequency = {
    method: 'GET',
    url: '',
    headers: {
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        'X-RapidAPI-Key': '86806f5be4msh03378cc0763688cp19c88djsna7ec19c32072'
    },
};


wordGetter.addEventListener('click', async function () {
    // try {
    theWord.innerText = "Fetching your word"
    theWord.style.fontSize = "1.5em";
    theWord.style.fontWeight = "700";
    disableAllLetterButtons(true);
    whiteLetterBorders();
    tries = 0;
    tryNumber.innerText = `number of tries is ${tries}`;
    options.params.page = `${Math.floor(Math.random() * 100)}`;
    options.params.lettersMin = 6;
    options.params.lettersMax = 10;
    wordData = await axios.request(options)
    console.log(wordData)
    zipfWord = await zipfChecker(wordData)
    console.log(`zipfWord returned from zipfChecker is "${zipfWord}"`)
    theWord.innerText = ""
    theWord.style.fontSize = "1em";
    theWord.style.fontWeight = "400";
    wordInsert(zipfWord);
    guessedCorrectly = 0;
    theWord.classList.remove(".lds-ring");
    // } catch (err) {
    //     console.log('error: ', err.message)
    // }
});



const wordInsert = (wordInfo) => {
    wordDelete()
    for (let i = 0; i < wordInfo.length; i++) {
        if (wordInfo[i] === ' ' || wordInfo[i] === '-' || wordInfo[i] === "'") {
            element = document.createElement('b')
            element.innerText = wordInfo[i];
            element.setAttribute("class", `separatedLettersSpace`);
            element.setAttribute("id", `${i}`);
            theWord.appendChild(element);
        } else {
            element = document.createElement('b')
            element.setAttribute("class", `separatedLetters`);
            element.setAttribute("id", `${i}`);
            theWord.appendChild(element);
        }
    }
}

const numberInsert = (slider, number) => {
    number.innerText = slider.value
}

const wordDelete = () => {
    while (theWord.lastElementChild) {
        theWord.removeChild(theWord.lastElementChild)
    }
}

const zipfChecker = async function (wordInfo) {
    try {
        wordFound = false;
        while (wordFound === false) {
            randomNumber = Math.floor(Math.random() * wordInfo.data.results.data.length)
            randomWord = wordInfo.data.results.data[randomNumber]
            console.log(randomWord)
            frequency.url = `https://wordsapiv1.p.rapidapi.com/words/${randomWord}/frequency`
            let zipfData = await axios.request(frequency)
            if (zipfData.data.frequency && parseInt(zipfData.data.frequency.zipf) > 2) {
                wordFound = true;
                disableAllLetterButtons(false);
            }
        }
        return randomWord
    } catch (e) {
        console.log(e);
    }
}

for (let i = 0; i < lettersButtons.length; i++) {
    let letterWasRight;
    lettersButtons[i].addEventListener('click', () => {
        letterWasRight = 0;
        for (let j = 0; j < zipfWord.length; j++) {
            if (lettersButtons[i].innerText == zipfWord[j].toUpperCase()) {
                console.log("yep it matches")
                let correctLetters = document.querySelectorAll(".separatedLetters")
                correctLetters[j].innerText = lettersButtons[i].innerText;
                gameWon(lettersButtons[i].innerText, zipfWord[j].toUpperCase());
                letterWasRight = 1;
            } else {
                console.log("Nop it doesnt match")
                lettersButtons[i].style.border = "solid rgb(255, 0, 43)";
            }
            if (letterWasRight === 1) {
                lettersButtons[i].style.border = "solid rgb(0, 255, 43)";
            }

        }
        disableSingleButton(lettersButtons[i].innerText)
        numberOfTries();
    })
}

const gameWon = (guessLetter, correctWord) => {
    if (guessLetter === correctWord) {
        guessedCorrectly++;
    }
    if (guessedCorrectly === zipfWord.length) {
        disableAllLetterButtons(true);
    }
}

const numberOfTries = () => {
    tries++;
    tryNumber.innerText = `number of tries is ${tries}`;
}


