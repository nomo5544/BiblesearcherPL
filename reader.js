// 1. ОГОЛОШЕННЯ ЗМІННИХ ТА ЗБЕРЕЖЕННЯ ОСТАННЬОГО МІСЦЯ
const urlParams = new URLSearchParams(window.location.search);
let fullRef = decodeURIComponent(urlParams.get('ref') || "").replace(/\+/g, ' ');
let currentLang = urlParams.get('lang') || 'ukr';
let bibleData = null;

// Запам'ятовуємо розділ, як тільки відкрили сторінку
if (fullRef) {
    localStorage.setItem('lastBibleRef', fullRef);
    localStorage.setItem('lastBibleLang', currentLang);
}
const bookMap = {
    "Буття": "Бытие", "Вихід": "Исход", "Левит": "Левит", "Числа": "Числа", 
    "Повторення Закону": "Второзаконие", "Ісус Навин": "Иисус Навин", "Судді": "Судьи", 
    "Рут": "Руфь", "1 Самуїлова": "1 Царств", "2 Самуїлова": "2 Царств", 
    "1 Царів": "3 Царств", "2 Царів": "4 Царств", "1 Хронік": "1 Паралипоменон", 
    "2 Хронік": "2 Паралипоменон", "Ездра": "Ездра", "Неемія": "Неемия", 
    "Естер": "Есфирь", "Йов": "Иов", "Псалми": "Псалтирь", "Приповісті": "Притчи", 
    "Екклезіаст": "Екклезиаст", "Пісня Пісень": "Песнь Песней", "Ісая": "Исаия", 
    "Єремія": "Иеремия", "Плач Єремії": "Плач Иеремии", "Єзекіїль": "Иезекииль", 
    "Даниїл": "Даниил", "Осія": "Осия", "Йоіл": "Иоиль", "Амос": "Амос", 
    "Овдій": "Авдий", "Йона": "Иона", "Михей": "Михей", "Наум": "Наум", 
    "Авакум": "Аввакум", "Софонія": "Софония", "Огій": "Аггей", 
    "Захарія": "Захария", "Малахія": "Малахия",
    "Від Матвія": "Матфея", "Від Марка": "Марка", "Від Луки": "Луки", 
    "Від Івана": "Иоанна", "Дії Апостолів": "Деяния", "До Римлян": "Римлянам", 
    "1 до Коринтян": "1 Коринфянам", "2 до Коринтян": "2 Коринфянам", 
    "До Галатів": "Галатам", "До Ефесян": "Ефесянам", "До Филип'ян": "Филиппийцам", 
    "До Колосян": "Колоссянам", "1 до Солунян": "1 Фессалоникийцам", 
    "2 до Солунян": "2 Фессалоникийцам", "1 до Тимофія": "1 Тимофею", 
    "2 до Тимофія": "2 Тимофею", "До Тита": "Титу", "До Филимона": "Филимону", 
    "До Євреїв": "Евреям", "Якова": "Иакова", "1 Петра": "1 Петра", 
    "2 Петра": "2 Петра", "1 Івана": "1 Иоанна", "2 Івана": "2 Иоанна", 
    "3 Івана": "3 Иоанна", "Юди": "Иуды", "Об'явлення": "Откровение"
};


function getTranslatedBookName(name, toLang) {
    if (toLang === 'rus') {
        return bookMap[name] || name;
    } else {
        return Object.keys(bookMap).find(key => bookMap[key] === name) || name;
    }
}

// Розбір посилання
let bookName = "", chapterNum = "1", vStart = null, vEnd = null;

// Регулярний вираз для підтримки діапазонів (напр. Мат 3:1-11)
const match = fullRef.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

if (match) {
    bookName = match[1];
    chapterNum = match[2];
    vStart = match[3] ? parseInt(match[3]) : null;
    vEnd = match[4] ? parseInt(match[4]) : vStart; // Якщо діапазону немає, vEnd = vStart
}

async function shareVerse(text, ref) {
    // Формуємо чистий текст без посилання 
    const shareText = `«${text}» (${ref})\n\n`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Біблія',
                text: shareText
            });
        } catch (err) {
            console.log("Скасовано");
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareText);
            alert("Текст скопійовано!");
        } catch (err) {
            console.error("Помилка копіювання");
        }
    }
}

function loadBible() {
    const fileName = currentLang === 'ukr' ? 'bibleTextUA.json' : 'bibleTextRU.json';
    const btn = document.getElementById('langBtn');
    if(btn) btn.innerText = currentLang === 'ukr' ? 'UA' : 'RU';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
        })
        .catch(err => {
            console.error("Помилка:", err);
            const layout = document.getElementById('reader-layout');
            if(layout) layout.innerHTML = "Помилка завантаження тексту.";
        });
}

function renderContent() {
    const layout = document.getElementById('reader-layout');
    const refHeader = document.getElementById('refHeader');
    if (!layout || !bibleData) return;
    
    layout.style.transform = "none";
    layout.style.opacity = "1";
    layout.classList.remove('no-transition');
    
    layout.innerHTML = "";
    if (refHeader) refHeader.innerText = `${bookName} ${chapterNum}`;

    const prefix = `${bookName} ${chapterNum}:`;
    const keys = Object.keys(bibleData).filter(k => k.startsWith(prefix));
    
    keys.sort((a, b) => parseInt(a.split(':')[1]) - parseInt(b.split(':')[1]));

    if (keys.length === 0) {
        layout.innerHTML = `<div style="text-align:center; padding:40px; opacity:0.5;">Розділ не знайдено (${bookName} ${chapterNum}).</div>`;
        return;
    }

    keys.forEach(key => {
        const vNum = parseInt(key.split(':')[1]);
        
        // ПЕРЕВІРКА ДІАПАЗОНУ
        let isHighlighted = false;
        if (vStart !== null) {
            isHighlighted = (vNum >= vStart && vNum <= vEnd);
        }
        
        const div = document.createElement('div');
        div.className = `verse-item ${isHighlighted ? 'highlight' : ''}`;
        
        // Ставимо ID для скролу тільки на перший вірш виділення
        if (vStart !== null && vNum === vStart) {
            div.id = "target";
        }
        
        const spanNum = document.createElement('span');
        spanNum.className = 'verse-num';
        spanNum.innerText = vNum;

        const textNode = document.createTextNode(" " + bibleData[key]); 

        div.appendChild(spanNum);
        div.appendChild(textNode);
        
    let pressTimer;

    const startPress = (e) => {
        // Додаємо візуальний клас "натискання"
        div.classList.add('pressing');

        pressTimer = setTimeout(() => {
            // Ефект успіху: вібрація + спалах
            if (navigator.vibrate) navigator.vibrate(40); // Короткий "тік"
            div.classList.replace('pressing', 'shared-flash');
            
            const text = bibleData[key];
            const ref = `${bookName} ${chapterNum}:${vNum}`;
            shareVerse(text, ref);

            // Прибираємо підсвітку через секунду
            setTimeout(() => div.classList.remove('shared-flash'), 1000);
        }, 800); // Час утримання
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
        div.classList.remove('pressing');
        if (!div.classList.contains('shared-flash')) {
            div.classList.remove('pressing');
        }
    };

    // Слухачі подій
    div.addEventListener('touchstart', startPress, { passive: true });
    div.addEventListener('touchend', cancelPress, { passive: true });
    div.addEventListener('touchmove', cancelPress, { passive: true });
    
    // Для мишки (ПК)
    div.addEventListener('mousedown', startPress);
    div.addEventListener('mouseup', cancelPress);
    div.addEventListener('mouseleave', cancelPress);

    layout.appendChild(div);
});

// СКРОЛ ДО ПОЧАТКУ ВИДІЛЕННЯ
    if (vStart !== null) {
        setTimeout(() => {
            const el = document.getElementById('target');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    }
}

document.getElementById('langBtn').onclick = () => {
    const nextLang = currentLang === 'ukr' ? 'rus' : 'ukr';
    const translatedBook = getTranslatedBookName(bookName, nextLang);
    
    // Формуємо частину з віршами (діапазон або один вірш)
    let versePart = "";
    if (vStart) {
        versePart = `:${vStart}${vEnd !== vStart ? '-' + vEnd : ''}`;
    }
    
    const newRef = `${translatedBook} ${chapterNum}${versePart}`;
    window.location.href = `reader.html?ref=${encodeURIComponent(newRef)}&lang=${nextLang}`;
};

function navigate(step) {
    const nextChap = parseInt(chapterNum) + step;
    if (nextChap < 1) return;
    window.location.href = `reader.html?ref=${encodeURIComponent(bookName + ' ' + nextChap)}&lang=${currentLang}`;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);

loadBible();
// --- ОБРОБКА КЛАВІАТУРИ ---
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") {
        navigate(-1); // Попередній розділ
    } else if (e.key === "ArrowRight") {
        navigate(1);  // Наступний розділ
    }
});
// --- ОБРОБКА СВАЙПІВ (Мобільні) ---
let xDown = null;

document.addEventListener('touchstart', (e) => {
    xDown = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!xDown) return;
    let xUp = e.changedTouches[0].clientX;
    let xDiff = xDown - xUp;

    // Тільки якщо палець пройшов більше 100 пікселів
    if (Math.abs(xDiff) > 100) {
        if (xDiff > 0) navigate(1);  // Наступний
        else navigate(-1);           // Попередній
    }
    xDown = null;
}, { passive: true });

loadBible();
