// ===== Нахожу основные элементы на странице
const userInfoBlock = document.getElementById('userInfo');
const loadPostsBtn = document.getElementById('loadPostsBtn');
const postsSection = document.getElementById('posts');

//получаю параметры из URL через URLSearchParams
//в данном случае достаю параметр userId
const params = new URLSearchParams(window.location.search);

//достаю id пользователя
const currentUserId = params.get('userId');

//проверка: если id нет, то показываю ошибку
if (!currentUserId) {
    userInfoBlock.innerText = 'User is not selected';
    //делаю кнопку загрузки постов не активной на старте, пока не загрузились данные пользователя
    loadPostsBtn.disabled = true;
} else {
    //запрашиваем одного пользователя по его id
    fetch('https://jsonplaceholder.typicode.com/users/' + currentUserId)
        .then(function (response) {
            return response.json();
        })
        //получаю данные пользователя
        .then(function (user) {
            //если все ок, то вызываю функцию renderUser (отрисовка) и загружаю пользователя по id
            renderUser(user);
            //и разблокирую кнопку загрузки постов
            loadPostsBtn.disabled = false;
        })
        //если при загрузке данных юзера произошла ошибка, то вывожу ошибку
        .catch(function () {
            userInfoBlock.innerText = 'Failed to load user';
            //и блокирую кнопку загрузки постов
            loadPostsBtn.disabled = true;
        });
}

// ===== Функция вывода информации о пользователе
function renderUser(user) {

    //очищаю контейнер, чтобы не было дублирования и страница показывала всегда
    //только текущего пользователя
    userInfoBlock.innerHTML = '';


    //===== Главный список ul, с выводом всех полей =====

    //создаю ul для основной информации
    const mainUl = document.createElement('ul');

    //добавляю класс, чтобы потом стилизовать через CSS
    mainUl.classList.add('user-info-list');

    //объявляю функцию addListByKeys, которая берет список ключей и по ним вытаскивает
    //значения из объекта и добавляет их в DOM список ul
    //dataObject объект с данными (напр. user, user.address, user.company),
    //keyNames - массив строк ('name', 'email' и тд)
    function addListByKeys(ul, dataObject, keyNames) {

        // защита: если объекта нет, то ничего не выводим
        if (!dataObject) {
            return;
        }

        //перебираю массив keyNames циклом for
        for (let i = 0; i < keyNames.length; i++) {

            //беру текущий ключ (напр. 'name')
            const key = keyNames[i];

            //беру значение из объекта dataObject по ключу
            const value = dataObject[key];

            //создаю li
            const li = document.createElement('li');

            //формирую строку key: value (ключи с большой буквы через функцию)
            li.innerText = capitalizeFirstLetter(key) + ': ' + value;

            // добавляю li в список ul
            ul.appendChild(li);
        }
    }

    // ОСНОВНОЙ СПИСОК

    //создаю массив mainInfo, с названиями ключей объекта user (для вывода на страницу)
    const mainInfo = ['id', 'name', 'username', 'email'];
    //вызываем функцию addListByKeys, она пройдет по массиву mainInfo, по каждому ключу возьмет
    //занчение из объекта user и добавит в список mainUl
    addListByKeys(mainUl, user, mainInfo);

    // ====== ADDRESS ======

    //создаю лишку для блока address
    const addressLi = document.createElement('li');

    //создаю заголовок
    const addressTitle = document.createElement('span');
    addressTitle.classList.add('section-title');
    addressTitle.innerText = 'Address:';
    //добавляю заголовок в addressLi
    addressLi.appendChild(addressTitle);

    //создаю вложенный список для address
    const addressUl = document.createElement('ul');
    //массив ключей для адреса
    const addressKeyNames = ['street', 'suite', 'city', 'zipcode'];
    addListByKeys(addressUl, user.address, addressKeyNames);


    // ----- вложенный список GEO внутри ADDRESS --------
    const geoLi = document.createElement('li');

    //создаю заголовок geo
    const geoTitle = document.createElement('span');
    geoTitle.classList.add('section-title');
    geoTitle.innerText = 'Geo:';
    //добавляю заголовок в geoLi
    geoLi.appendChild(geoTitle);

    const geoUl = document.createElement('ul');
    const geoKeyNames = ['lat', 'lng'];
    //вызываю функцию addListByKeys, чтобы во вложенный список geo положить данные из
    //geoKeyNames ['lat', 'lng'], взятые из объекта user.address.geo
    //защита: вывожу geo, только если address существует
    addListByKeys(geoUl, user.address && user.address.geo, geoKeyNames);

    //добавляю список geo внутрь контейнера geo
    geoLi.appendChild(geoUl);
    //добавляю блок geo в список address
    addressUl.appendChild(geoLi);

    //добавляю список address в контейнер address
    addressLi.appendChild(addressUl);
    //добавляю блок address в основной список пользователя
    mainUl.appendChild(addressLi);


    // -------- phone, website ----------

    const contactsInfo = ['phone', 'website'];
    addListByKeys(mainUl, user, contactsInfo);


    // ============ COMPANY c вложенным списком ============

    //создаю лишку для блока company
    const companyLi = document.createElement('li');

    //создаю заголовок блока company
    const companyTitle = document.createElement('span');
    companyTitle.classList.add('section-title');
    companyTitle.innerText = 'Company:';
    //добавляю заголовок в контейнер company
    companyLi.appendChild(companyTitle);

    //создаю вложенный список для данных компании
    const companyUl = document.createElement('ul');
    //массив ключей компании
    const companyKeyNames = ['name', 'catchPhrase', 'bs'];
    //вывожу данные компании во вложенный список
    addListByKeys(companyUl, user.company, companyKeyNames);

    //добавляю список company в контейнер company
    companyLi.appendChild(companyUl);
    //добавляю блок company в основной список юзера
    mainUl.appendChild(companyLi);


    //добавляю итоговый список на страницу
    userInfoBlock.appendChild(mainUl);
}

//делаем заголовок поста и текст поста с большой буквы через функцию
function capitalizeFirstLetter(text) {
    //если строка пустая, null или undefined, то  возвращаем пустую строку
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// ===== Функция вывода постов пользователя на страницу (DOM)
function renderPosts(posts) {

    //очищаю секцию постов перед новой загрузкой,
    //чтобы не дублировать контент при повторном клике или перезагрузке страницы
    postsSection.innerHTML = '';

    //проверка, что posts — массив
    if (!Array.isArray(posts)) {
        postsSection.innerText = 'Unable to load posts';
        return;
    }

    //перебираю массив постов (for)
    for (let i = 0; i < posts.length; i++) {

        //беру текущий пост из массива
        const post = posts[i];

        //создаю карточку поста
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');

        //заголовок поста
        const postTitle = document.createElement('h3');

        //выводим номер поста для пользователя (i + 1), индекс начинается с 0
        postTitle.innerText = (i + 1) + '. ' + capitalizeFirstLetter(post.title);

        //добавляю заголовок в карточку
        postCard.appendChild(postTitle);

        //кнопка для перехода на страницу деталей поста
        const postBtn = document.createElement('button');
        postBtn.classList.add('post-details-btn');
        postBtn.innerText = 'View details';

        //при клике передаю id поста через URL,
        //чтобы на странице post-details.html загрузить нужный пост
        postBtn.addEventListener('click', function () {
            //перехожу на страницу с деталями поста post-details.html
            window.location.href = 'post-details.html?postId=' + post.id;
        });

        //добавляем кнопку в карточку
        postCard.appendChild(postBtn);

        //добавляю карточку сразу в postsSection
        postsSection.appendChild(postCard);
    }
}

// ===== Загрузка постов по кнопке =====

//обработчик клика на кнопку
loadPostsBtn.addEventListener('click', function () {

    //если вдруг по какой-то причине id отсутствует, показываем ошибку
    if (!currentUserId) {
        postsSection.innerText = 'User is not selected';
        return;
    }

    //использую currentUserId, чтобы сервер вернул только нужные посты текущего пользователя
    fetch('https://jsonplaceholder.typicode.com/users/' + currentUserId + '/posts')
        .then(function (response) {
            //преобразуем ответ в JSON -> получаем массив постов
            return response.json();
        })
        .then(function (posts) {

            //проверка на пустой массив или если у пользователя нет постов
            if (!Array.isArray(posts) || posts.length === 0) {
                postsSection.innerText = 'No posts for this user';
                return;
            }

            //вывожу посты на страницу
            renderPosts(posts);
        })

        //обработка ошибки, если при загрузке постов произошла ошибка
        .catch(function () {
                postsSection.innerText = 'Failed to load posts';
        });
});