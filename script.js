// ПЕРШИЙ РЯДОК ФАЙЛУ script.js
const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has('fromSearch')) {
    const lastRef = localStorage.getItem('lastBibleRef');
    const lastLang = localStorage.getItem('lastBibleLang');
    if (lastRef) {
        // За замовчуванням тепер ставимо 'ru', якщо мову не знайдено
        window.location.href = `reader.html?ref=${encodeURIComponent(lastRef)}&lang=${lastLang || 'ru'}`;
    }
}

// --- 1. ОГОЛОШЕННЯ ЗМІННИХ ---
(function() {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const countDisplay = document.getElementById('resultCount');
    const langToggle = document.getElementById('langToggle');
    const exactMatch = document.getElementById('exactMatch');
    const copyRefsBtn = document.getElementById('copyRefsBtn');
    const fontSizeRange = document.getElementById('fontSizeRange');

    // Тепер початкова мова 'ru'
    window.currentLang = localStorage.getItem('selectedLang') || 'ru';
    window.currentLangData = {};

const maps = {
    ru: {
        "быт": "Бытие", "бытие": "Бытие", 
        "исх": "Исход", "исход": "Исход",
        "лев": "Левит", "левит": "Левит",
        "чис": "Числа", "числа": "Числа",
        "втор": "Второзаконие", "второзаконие": "Второзаконие",
        "нав": "Иисус Навин", "иисн": "Иисус Навин",
        "суд": "Судьи",
        "руф": "Руфь",
        "1цар": "1 Царств", "2цар": "2 Царств", "3цар": "3 Царств", "4цар": "4 Царств",
        "1пар": "1 Паралипоменон", "2пар": "2 Паралипоменон",
        "езд": "Ездра", "неем": "Неемия", "есф": "Есфирь", "иов": "Иов",
        "пс": "Псалтирь", "псал": "Псалтирь", "псалом": "Псалтирь",
        "прит": "Притчи", "еккл": "Екклезиаст", "песн": "Песнь Песней",
        "ис": "Исаия", "иер": "Иеремия", "плач": "Плач Иеремии",
        "иез": "Иезекииль", "дан": "Даниил",
        "ос": "Осия", "иоил": "Иоиль", "ам": "Амос", "авд": "Авдий", "ион": "Иона", "мих": "Михей",
        "наум": "Наум", "авв": "Аввакум", "соф": "Софония", "агг": "Аггей", "зах": "Захария", "мал": "Малахия",
        "мф": "Матфея", "мк": "Марка", "лк": "Луки", "ин": "Иоанна",
        "деян": "Деяния", "иак": "Иакова", "1пет": "1 Петра", "2пет": "2 Петра",
        "1иоан": "1 Иоанна", "2иоан": "2 Иоанна", "3иоан": "3 Иоанна", "иуд": "Иуды",
        "рим": "Римлянам", "1кор": "1 Коринфянам", "2кор": "2 Коринфянам",
        "гал": "Галатам", "еф": "Ефесянам", "фил": "Филиппийцам", "кол": "Колоссянам",
        "1фес": "1 Фессалоникийцам", "2фес": "2 Фессалоникийцам",
        "1тим": "1 Тимофею", "2тим": "2 Тимофею", "тит": "Титу", "флм": "Филимону",
        "евр": "Евреям", "откр": "Откровение"
    },
    pl: {
        "rdz": "Rodzaju", "wyj": "Wyjścia", "kpł": "Kapłańska", "lb": "Liczb", "pwt": "Powtórzonego Prawa",
        "joz": "Jozuego", "sędź": "Sędziów", "rt": "Rut", "1sm": "1 Samuela", "2sm": "2 Samuela",
        "1król": "1 Królewska", "2król": "2 Królewska", "1krl": "1 Królewska", "2krl": "2 Królewska",
        "1kr": "1 Kronik", "2kr": "2 Kronik", "ezd": "Ezdrasza", "ne": "Nehemiasza", "est": "Estery",
        "hi": "Hioba", "ps": "Psalmów", "prz": "Przysłów", "koh": "Koheleta", "pnp": "Pieśń nad Pieśniami",
        "iz": "Izajasza", "jr": "Jeremiasza", "lm": "Lamentacje", "ez": "Ezechiela", "dn": "Daniela",
        "oz": "Ozeasza", "jo": "Joela", "am": "Amosa", "abd": "Abdiariasza", "jon": "Jonasza",
        "mi": "Micheasza", "na": "Nahuma", "ha": "Habakuka", "so": "Sofoniasza", "ag": "Aggeusza",
        "za": "Zachariasza", "ml": "Malachiasza",
        "mt": "Mateusza", "mk": "Marka", "łk": "Łukasza", "j": "Jana",
        "dz": "Dzieje Apostolskie", "rzm": "Rzymian", "1kor": "1 Koryntian", "2kor": "2 Koryntian",
        "ga": "Galatów", "ef": "Efezjan", "flp": "Filipian", "kol": "Kolosan",
        "1tes": "1 Tesaloniczan", "2tes": "2 Tesaloniczan", "1tym": "1 Tymoteusza", "2tym": "2 Tymoteusza",
        "tt": "Tytusa", "flm": "Filemona", "hbr": "Hebrajczyków", "jk": "Jakuba",
        "1pt": "1 Piotra", "2pt": "2 Piotra", "1j": "1 Jana", "2j": "2 Jana", "3j": "3 Jana",
        "jud": "Judy", "ap": "Apokalipsa"
    }
};

        // Допоміжна функція для обробки кліку та збереження стану
        function handleRefClick(el, ref) {
            // 1. Зберігаємо в пам'ять сесії, що це посилання натиснуте
            let clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            if (!clickedRefs.includes(ref)) {
                clickedRefs.push(ref);
                sessionStorage.setItem('clickedRefs', JSON.stringify(clickedRefs));
            }
            // 2. Додаємо клас візуально
            el.classList.add('clicked');
            // ВАЖЛИВО: Оновлюємо збережений HTML перед переходом
            saveState();
            // 3. Переходимо
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        }
        
        function renderDirectResult(ref, text) {
            if (!resultsDiv) return;
            const div = document.createElement('div');
            div.className = 'verse';
            // Перевіряємо, чи було натиснуто раніше
            const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            const isClicked = clickedRefs.includes(ref) ? 'clicked' : '';
            
            div.innerHTML = `<span class="ref ${isClicked}">${ref}</span> ${text}`;
            div.querySelector('.ref').onclick = function() {
                handleRefClick(this, ref);
            };
            resultsDiv.appendChild(div);
        }
        
        function addVerseToFragment(fragment, ref, htmlContent) {
            const div = document.createElement('div');
            div.className = 'verse'; 
            const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            const isClicked = clickedRefs.includes(ref) ? 'clicked' : '';
        
            div.innerHTML = `<span class="ref ${isClicked}">${ref}</span> ${htmlContent}`;
            div.querySelector('.ref').onclick = function() {
                handleRefClick(this, ref);
            };
            fragment.appendChild(div);
        }

    window.performSearch = function() {
        const query = searchInput.value.trim();
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '';
        if (query.length < 2) { 
            document.body.classList.remove('has-results'); // Повертаємо прозорий фон
            if (countDisplay) window.updateCounterUI(0); 
            return; 
        }
        document.body.classList.add('has-results'); // Робимо фон більш щільним
        
        // Підтримка кирилиці та польської латиниці
        const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐҐąćęłńóśźżĄĆĘŁŃÓŚŹŻыЫэЭёЁ][a-zA-Zа-яіїєґ'ąćęłńóśźżыэё\s]{0,20})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
        const match = query.match(refRegex);

        if (match) {
            const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
            const chapter = match[2];
            const vStart = parseInt(match[3] || "1");
            const vEnd = match[4] ? parseInt(match[4]) : vStart;
            const currentMap = maps[window.currentLang];
            const fullBookName = currentMap ? currentMap[bookInput] : null;

            if (fullBookName) {
                let combinedText = "";
                let foundAny = false;
                for (let v = vStart; v <= vEnd; v++) {
                    const ref = `${fullBookName} ${chapter}:${v}`;
                    const refPadded = `${fullBookName} ${chapter}:${String(v).padStart(2, '0')}`;
                    const text = window.currentLangData[ref] || window.currentLangData[refPadded];
                    if (text) {
                        combinedText += `<b style="color: #888; font-size: 0.8em; margin-left: 5px;">${v}</b> ${text} `;
                        foundAny = true;
                    }
                }
                if (foundAny) {
                    let displayRef = `${fullBookName} ${chapter}:${vStart}`;
                    if (match[4]) displayRef += `-${vEnd}`;
                    renderDirectResult(displayRef, combinedText);
                    if (countDisplay) window.updateCounterUI(1);
                    saveState();
                    return; 
                }
            }
        }

        let count = 0;
        const isExact = exactMatch ? exactMatch.checked : false;
        const fragment = document.createDocumentFragment();

        if (isExact) {
            let regex;
            try {
                regex = new RegExp(`(?<![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ])${query}(?![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ])`, 'gi');
            } catch (e) { return; }
            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                if (text.match(regex)) {
                    count++;
                    addVerseToFragment(fragment, ref, text.replace(regex, '<mark>$&</mark>'));
                    if (count >= 500) break;
                }
            }
        } else {
            const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
            if (searchWords.length === 0) return;
            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                const textLower = text.toLowerCase();
                if (searchWords.every(word => textLower.includes(word))) {
                    count++;
                    let highlightedText = text;
                    searchWords.forEach(word => {
                        const cleanWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        highlightedText = highlightedText.replace(new RegExp(`(${cleanWord})`, 'gi'), '<mark>$1</mark>');
                    });
                    addVerseToFragment(fragment, ref, highlightedText);
                    if (count >= 500) break;
                }
            }
        }
        resultsDiv.appendChild(fragment);
        if (countDisplay) window.updateCounterUI(count);
        saveState();
    };

    function saveState() {
        sessionStorage.setItem('lastSearchResults', resultsDiv.innerHTML);
        sessionStorage.setItem('lastSearchQuery', searchInput.value);
        sessionStorage.setItem('lastResultCount', countDisplay ? countDisplay.innerText : '0');
    }

// --- Функція завантаження (виправлені назви файлів) ---
window.loadLanguage = function(langCode) {
    const fileName = langCode === 'ru' ? 'bibleTextRU.json' : 'bibleTextPL.json';
    fetch(fileName)
        .then(res => res.json())
        .then(data => {
            window.currentLangData = data;
            // Відновлення стану залишається без змін...
            const savedHTML = sessionStorage.getItem('lastSearchResults');
            if (savedHTML && resultsDiv.innerHTML === "") {
                resultsDiv.innerHTML = savedHTML;
                document.body.classList.add('has-results');
                searchInput.value = sessionStorage.getItem('lastSearchQuery') || '';
                if (countDisplay) countDisplay.innerText = sessionStorage.getItem('lastResultCount') || '0';
                window.updateCounterUI(parseInt(countDisplay.innerText));
                // Логіка очищення при кліку на квадрат-лічильник
    if (countDisplay) {
        countDisplay.onclick = () => {
            if (parseInt(countDisplay.innerText) > 0) {
                searchInput.value = ""; 
                resultsDiv.innerHTML = "";
                window.updateCounterUI(0);
                document.body.classList.remove('has-results');
                sessionStorage.removeItem('lastSearchResults');
                sessionStorage.removeItem('lastSearchQuery');
                sessionStorage.removeItem('lastResultCount');
                searchInput.focus();
            }
        };
    }

    // Допоміжна функція для керування станом квадрата
    window.updateCounterUI = (count) => {
        if (countDisplay) {
            countDisplay.innerText = count;
            if (count > 0) {
                countDisplay.classList.add('active');
            } else {
                countDisplay.classList.remove('active');
            }
        }
    };
                
                resultsDiv.querySelectorAll('.ref').forEach(el => {
                    const ref = el.innerText.replace('● ', '').trim();
                    const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
                    if (clickedRefs.includes(ref)) el.classList.add('clicked');
                    el.onclick = function(e) {
                        e.preventDefault();
                        handleRefClick(this, ref);
                    };
                });
            } else if (searchInput.value.length >= 2) {
                window.performSearch();
            }
        })
        .catch(err => console.error("Ошибка загрузки JSON:", err));
};

// --- Перемикач мов (RU / PL) ---
if (langToggle) {
    langToggle.onclick = () => {
        window.currentLang = (window.currentLang === 'ru') ? 'pl' : 'ru';
        langToggle.innerText = window.currentLang === 'ru' ? 'RU' : 'PL';
        localStorage.setItem('selectedLang', window.currentLang);
        window.loadLanguage(window.currentLang);
    };
    langToggle.innerText = window.currentLang === 'ru' ? 'RU' : 'PL';
}

    if (searchInput) {
        searchInput.oninput = window.performSearch;
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                const match = query.match(/^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐҐąćęłńóśźżĄĆĘŁŃÓŚŹŻыЫэЭёЁ][a-zA-Zа-яіїєґ'ąćęłńóśźżыэё\s]{0,20})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/);
                if (match) {
                    const book = maps[window.currentLang][match[1].trim().toLowerCase().replace(/\.$/, "")];
                    if (book) {
                        let r = `${book} ${match[2]}:${match[3] || "1"}`;
                        if (match[4]) r += `-${match[4]}`;
                        window.location.href = `reader.html?ref=${encodeURIComponent(r)}&lang=${window.currentLang}`;
                        return;
                    }
                }
                window.performSearch();
            }
        };
    }

    if (exactMatch) exactMatch.onchange = window.performSearch;
    if (fontSizeRange) {
        const savedSize = localStorage.getItem('searchFontSize') || '19';
        fontSizeRange.value = savedSize;
        resultsDiv.style.fontSize = savedSize + 'px';
        fontSizeRange.oninput = () => {
            resultsDiv.style.fontSize = fontSizeRange.value + 'px';
            localStorage.setItem('searchFontSize', fontSizeRange.value);
        };
    }

    if (copyRefsBtn) {
        copyRefsBtn.onclick = () => {
            const refs = Array.from(resultsDiv.querySelectorAll('.ref')).map(el => el.innerText.replace('● ', '').trim()).join(', ');
            if (!refs) return;
            navigator.clipboard.writeText(refs).then(() => {
                const old = copyRefsBtn.innerText;    
                copyRefsBtn.innerText = '✔';
                setTimeout(() => copyRefsBtn.innerText = old, 2000);
            });
        };
    }

    window.loadLanguage(window.currentLang);
})();
