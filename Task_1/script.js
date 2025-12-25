let pairs = [];
//добавляю ключ, под которым сохраняю массив в localStorage
const STORAGE_KEY = 'pairs';

// регулярное выражение для проверки формата строки <name> = <value>:
//Names and Values can contain only alpha-numeric characters.
const regex = /^\s*([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9]+)\s*$/;


//
//==============Поиск элементов в DOM====================
//

// поле ввода пары "Name=Value"
const pairInput = document.getElementById('pairInput');

//текст ошибки
const errorMessage = document.getElementById('errorMessage');

//окно с парами
const pairList = document.getElementById('pairList');

// кнопка "Add"
const addBtn = document.getElementById('addBtn');
// кнопки сортировки и удаления
const sortNameBtn = document.getElementById('sortNameBtn');
const sortValueBtn = document.getElementById('sortValueBtn');
const deleteBtn = document.getElementById('deleteBtn');


//
//==============Работа с localStorage=================
//

// функция, которая сохраняет текущий массив pairs в localStorage
function saveToLocalStorage() {
    // JSON.stringify превращает массив в строку и кладу под ключ STORAGE_KEY.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
}

// если запись в localStorage есть, то
function loadFromLocalStorage() {
    //читаю данные из localStorage по ключу STORAGE_KEY
    const savedData = localStorage.getItem(STORAGE_KEY);

    //проверяю есть ли что-то сохраненное,
    if (!savedData) {
        //если данных нет → первый запуск приложения -> возвращаю false (пользователь впервые открыл страницу)
        //при загрузке формы загрузится 2 стартовые пары по умолчанию
        return false;
    }

    //превращаю строку обратно в массив через JSON.parse (в localStorage всегда лежит строка)
    const loadedPairs = JSON.parse(savedData);

    // перезаписываю массив pairs данными из localStorage
    pairs = loadedPairs;

    //данные из localStorage загружаю в массив pairs
    return true;
    }


//
//==========Формирование списка (<select> в HTML) из массива pairs ============
//

//функция показывающая текущие пары пользователю (наполнение <select> в HTML)
function renderList() {
    //очищаем список <select>, чтобы он стал пустым и не было дублей
    pairList.innerHTML = '';

    pairs.forEach((pair, index) => {
        // создаю строку списка <option> в HTML
        const option = document.createElement('option');

        //задаю индекс пары в массиве. Это понадобится, чтобы знать, какой элемент удалить при нажатии Delete
        //value у <option> всегда стринга, а index — число,
        //поэтому превращаем число в стрингу и вместо = index; пишем = `${index}`;
        option.value = `${index}`;
        option.textContent = `${pair.name}=${pair.value}`;
        pairList.append(option);      // добавляю строку в HTML
    });

    saveToLocalStorage();    // сохраняю текущее состояние в localStorage
}


//
//================Сообщения пользователю===================
//

//функция показывает ошибку (текст) пользователю строкой под полем ввода Name=Value (вывод сообщений)
function showMessage(text) {
    //вывожу либо текст ошибки для пользователя, либо если значение falsy и
    // (текста нет, пользователь исправил ошибку) то, очищаю поле ошибки через showMessage(''),
    //чтобы ошибка больше не висела в поле, после ее исправления пользователем
    errorMessage.textContent = text || '';
}


//
//=========Добавление новой пары и проверка на ошибки==========
//

// обработчик клика по кнопке Add
addBtn.addEventListener('click', function () {
    // берём строку из input
    const inputValue = pairInput.value;

// убираю пробелы по краям (слева и справа)
    const trimmed = inputValue.trim();

// Проверка 1: есть ли вообще знак "="
// Если нет — сразу ошибка, потому что формат должен быть Name=Value
    if (!trimmed.includes('=')) {
        showMessage("Missing '='. Use format Name=Value");
        return; // останавливаю выполнение функции, ничего не добавляю
    }

    // разбиваю строку на две части по первому "="
    // split возвращает массив строк
    const parts = trimmed.split('=');

    // проверяю, что частей ровно 2
    // если пользователь написал "a=b=c", получится 3 части — это неверный формат
    if (parts.length !== 2) {
        showMessage("Invalid format. Use exactly one '=': Name=Value");
        return;
    }

    // берём левую часть как name и правую часть как value
    // trim() убирает пробелы вокруг имени и значения
    const name = parts[0].trim();
    const value = parts[1].trim();

    // проверка 2: имя не должно быть пустым
    if (name === '') {
        showMessage('Name cannot be empty');
        return;
    }

    // проверка 3: значение не должно быть пустым
    if (value === '') {
        showMessage('Value cannot be empty');
        return;
    }

    // проверка 4: строка должна подходить под регулярное выражение
    // т.е: только буквы/цифры в name и value, пробелы вокруг "=" допускаются
    if (!regex.test(trimmed)) {
        showMessage('Use only alphanumeric characters (A-Z, 0-9)');
        return;
    }

    //теперь все ок -> добавляю в массив объект с полями name и value
    pairs.push({ name: name, value: value });

    //очищаю поле ввода, чтобы было удобно вводить следующую пару
    pairInput.value = '';

    //вызываю showMessage(''), чтобы очистить старое сообщение об ошибке,
    // тк пользователь исправил ошибку, если ее допустил
    showMessage('');

    //перерисовываю список в <select>, чтобы новая пара появилась на экране
    renderList();
});


//
// ===================== Сортировка =====================
//

//при клике на Sort by Name сортируем массив по полю name
sortNameBtn.addEventListener('click', function () {
    //sort меняет массив, не создавая новый
    pairs.sort(function (a, b) {
        //localeCompare сравнивает строки по алфавиту
        return a.name.localeCompare(b.name);
    });

    //после сортировки нужно обновить список на экране
    renderList();
});

//при клике на Sort by Value сортируем массив по полю value
sortValueBtn.addEventListener('click', function () {
    pairs.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });

    renderList();
});


//
// ===================== Удаление выбранных строк =====================
//

//связываю кнопку Delete с функцией deletePairs,
// обработчик события 'click': когда пользователь кликнет по кнопке -> выполнится указанная функция
deleteBtn.addEventListener('click', deletePairs);

//создаю функцию, которую будем вызывать при клике на кнопку Delete.
function deletePairs() {

    //selectedOptions — это все строки (<option>), которые пользователь выделил в <select>
    //pairList.selectedOptions - это псевдомасив, а значит нужно
    //через Array.from(...) превратить этот псевдомасив в обычный массив
    //чтобы дальше можно было использовать map, sort и forEach (с псевдомасивом эти методы использовать нельзя)
    const selectedOptions = Array.from(pairList.selectedOptions);

    //дальше надо превратить выбранные <option> в индексы и удалить их

    //selectedPairIndexes - выбранные пользователем пары <option>, которые нужно удалить
    //value у option хранит индекс элемента, поэтому превращаем его в число
    //map создает новый массив и возвращает индекс числом
    const selectedPairIndexes = selectedOptions.map(function (option) {
        //Number(option.value) - превращает стрингу в число
        return Number(option.value);
    });

    //сортирую индексы выбранных пар по убыванию
    //чтобы при удалении индексы элементов не сместились
    selectedPairIndexes.sort(function (a, b) {
        return b - a;
    });

    //index — номер элемента в массиве pairs, который нужно удалить
    //forEach берет каждый индекс и
    selectedPairIndexes.forEach(function (index) {
        //для каждого индекса вызывается splice(index, 1)
        //и удаляется элемент массива с этим номером
        pairs.splice(index, 1);
    });

    // после изменения массива обновляю список на странице
    // чтобы пользователь увидел актуальные данные и сохраняю в localStorage
    renderList();
}


//
// ===================== Старт приложения =====================
//

//стартовая функция приложения (выполняется один раз при загрузке страницы)
function init() {
    //пытаемся загрузить данные из localStorage
    const isLoaded = loadFromLocalStorage();

    //если данных не было —> это первый запуск -> добавляем стартовые пары
    if (!isLoaded) {
        //добавляю две стартовые пары
        pairs.push({ name: 'Hello', value: 'World' });
        pairs.push({ name: 'Happy', value: 'Coding' });
    }

    //показываем список на экране
    //внутри renderList() произойдёт saveToLocalStorage()
    renderList();
}

//запускаем функцию init после полной загрузки страницы (window),
//когда загрузились все элементы HTML
window.addEventListener('load', init);

