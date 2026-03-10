// 1. ОГОЛОШЕННЯ ЗМІННИХ ТА ЗБЕРЕЖЕННЯ ОСТАННЬОГО МІСЦЯ
const urlParams = new URLSearchParams(window.location.search);
let fullRef = decodeURIComponent(urlParams.get('ref') || "").replace(/\+/g, ' ');
// Змінюємо 'rus' на 'ru' для відповідності першому скрипту
let currentLang = urlParams.get('lang') || 'ru'; 
let bibleData = null;

if (fullRef) {
    localStorage.setItem('lastBibleRef', fullRef);
    localStorage.setItem('lastBibleLang', currentLang);
}

const bookMap = {
    "Бытие": "Rodzaju", "Исход": "Wyjścia", "Левит": "Kapłańska", "Числа": "Liczb", 
    "Второзаконие": "Powtórzonego Prawa", "Иисус Навин": "Jozuego", "Судьи": "Sędziów", 
    "Руфь": "Rut", "1 Царств": "1 Samuela", "2 Царств": "2 Samuela", 
    "3 Царств": "1 Królewska", "4 Царств": "2 Królewska", "1 Паралипоменон": "1 Kronik", 
    "2 Паралипоменон": "2 Kronik", "Ездра": "Ezdrasza", "Неемия": "Nehemiasza", 
    "Есфирь": "Estery", "Иов": "Hioba", "Псалтирь": "Psalmów", "Притчи": "Przysłów", 
    "Екклезиаст": "Koheleta", "Песнь Песней": "Pieśń nad Pieśniami", "Исаия": "Izajasza", 
    "Иеремия": "Jeremiasza", "Плач Иеремии": "Lamentacje", "Иезекииль": "Ezechiela", 
    "Даниил": "Daniela", "Осия": "Ozeasza", "Иоиль": "Joela", "Амос": "Amosa", 
    "Авдий": "Abdiariasza", "Иона": "Jonasza", "Михей": "Micheasza", "Наум": "Nahuma", 
    "Аввакум": "Habakuka", "Софония": "Sofoniasza", "Аггей": "Aggeusza", 
    "Захария": "Zachariasza", "Малахия": "Malachiasza",
    "Матфея": "Mateusza", "Марка": "Marka", "Луки": "Łukasza", 
    "Иоанна": "Jana", "Деяния": "Dzieje Apostolskie", "Римлянам": "Rzymian", 
    "1 Коринфянам": "1 Koryntian", "2 Коринфянам": "2 Koryntian", 
    "Галатам": "Galatów", "Ефесянам": "Efezjan", "Филиппийцам": "Filipian", 
    "Колоссянам": "Kolosan", "1 Фессалоникийцам": "1 Tesaloniczan", 
    "2 Фессалоникийцам": "2 Tesaloniczan", "1 Тимофею": "1 Tymoteusza", 
    "2 Тимофею": "2 Tymoteusza", "Титу": "Tytusa", "Филимону": "Filemona", 
    "Евреям": "Hebrajczyków", "Иакова": "Jakuba", "1 Петра": "1 Piotra", 
    "2 Петра": "2 Piotra", "1 Иоанна": "1 Jana", "2 Иоанна": "2 Jana", 
    "3 Иоанна": "3 Jana", "Иуды": "Judy", "Откровение": "Apokalipsa"
};

// ВИПРАВЛЕНО: Логіка пошуку назви
function getTranslatedBookName(name, toLang) {
    if (toLang === 'pl') {
        return bookMap[name] || name;
    } else {
        // Шукаємо російську назву за польським значенням
        return Object.keys(bookMap).find(key => bookMap[key] === name) || name;
    }
}

// ... (Ваш код розбору посилання та shareVerse без змін) ...

// ВИПРАВЛЕНО: Шляхи до файлів та назви мов
function loadBible() {
    const fileName = currentLang === 'pl' ? 'bibleTextPL.json' : 'bibleTextRU.json';
    const btn = document.getElementById('langBtn');
    if(btn) btn.innerText = currentLang === 'pl' ? 'PL' : 'RU';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
        })
        .catch(err => {
            console.error("Ошибка:", err);
            const layout = document.getElementById('reader-layout');
            if(layout) layout.innerHTML = "Ошибка загрузки текста.";
        });
}

// ... (Ваша функція renderContent без змін) ...

// ВИПРАВЛЕНО: Параметр мови ('ru' замість 'rus')
document.getElementById('langBtn').onclick = () => {
    const nextLang = currentLang === 'ru' ? 'pl' : 'ru';
    const translatedBook = getTranslatedBookName(bookName, nextLang);
    
    let versePart = "";
    if (vStart) {
        versePart = `:${vStart}${vEnd !== vStart ? '-' + vEnd : ''}`;
    }
    
    const newRef = `${translatedBook} ${chapterNum}${versePart}`;
    window.location.href = `reader.html?ref=${encodeURIComponent(newRef)}&lang=${nextLang}`;
};

// ... (Решта вашого коду: navigate, обробка кнопок, клавіатури та свайпів без змін) ...
