// ===== Нахожу основные элементы на странице
const backToUserBtn = document.getElementById('backToUserBtn');
const postInfoBlock = document.getElementById('postInfo');
const loadCommentsBtn = document.getElementById('loadCommentsBtn');
const commentsSection = document.getElementById('comments');

//получаю параметры из URL через URLSearchParams
//в данном случае достаю параметр postId
const params = new URLSearchParams(window.location.search);

//достаю id поста
const currentPostId = params.get('postId');

// ===== проверка: если id поста нет, то
if (!currentPostId) {
    postInfoBlock.innerText = 'Post is not selected';
    //делаю кнопку загрузки комментариев не активной, пока не выбран пост
    loadCommentsBtn.disabled = true;
}
else {              //если все ок
    // ===== Загружаю пост по его id
    fetch('https://jsonplaceholder.typicode.com/posts/' + currentPostId)
        .then(function (response) {
            //преобразую ответ сервера в JSON
            return response.json();
        })
        .then(function (post) {
            //если данные успешно получены, то вывожу пост на страницу
            renderPost(post);

            //настраиваю кнопку возврата к пользователю с сохранением userId
            backToUserBtn.href = 'user-details.html?userId=' + post.userId;
        })

        .catch(function () {                //если произошла ошибка при загрузке поста
            postInfoBlock.innerText = 'Failed to load post';
            loadCommentsBtn.disabled = true;
        });


// ===== Функция делает первую букву строки заглавной
    function capitalizeFirstLetter(text) {
        //если строка пустая, null или undefined — возвращаем пустую строку,
        // чтобы избежать ошибок при работе с текстом
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


// ===== Функция вывода информации о посте (отрисовка в HTML)
    function renderPost(post) {

        //очищаю контейнер, чтобы не было дублирования
        postInfoBlock.innerHTML = '';

        //вывожу поле user ID
        const userId = document.createElement('p');
        userId.innerText = 'User ID: ' + post.userId;

        //вывожу id поста
        const postId = document.createElement('p');
        postId.innerText = 'Post ID: ' + post.id;

        //вывожу заголовок поста
        const title = document.createElement('h2');
        title.innerText = 'Title: ' + capitalizeFirstLetter(post.title);

        //создаю текст поста
        const body = document.createElement('p');

        //делаю текст поста с большой буквы
        body.innerText = capitalizeFirstLetter(post.body);

        //добавляю элементы в DOM
        postInfoBlock.append(userId, postId, title, body);
    }

// ===== Загрузка комментариев по кнопке =====

//обработчик клика на кнопку
    loadCommentsBtn.addEventListener('click', function () {

        //очищаю секцию комментариев перед новой загрузкой,
        // чтобы не дублировать при повторном клике
        commentsSection.innerHTML = '';

        //дополнительная проверка: если id поста отсутствует
        if (!currentPostId) {
            commentsSection.innerText = 'Post is not selected';
            return;
        }

        //запрашиваю комментарии текущего поста по id
        fetch('https://jsonplaceholder.typicode.com/posts/' + currentPostId + '/comments')
            .then(function (response) {
                //преобразую ответ сервера в JSON -> получаю массив комментариев
                return response.json();
            })
            .then(function (comments) {
                //отрисовываю комментарии на странице
                renderComments(comments);
            })
            .catch(function () {
                //если при загрузке комментариев произошла ошибка
                commentsSection.innerText = 'Failed to load comments';
            });
    });

//функция вывода комментариев на страницу (DOM):
//renderComments(comments) получает массив комментариев (из fetch)
//создаёт карточки и добавляет их на страницу
    function renderComments(comments) {

        //проверка на пустой массив (если у поста нет комментариев), или не массив
        if (!Array.isArray(comments) || comments.length === 0) {
            commentsSection.innerText = 'No comments for this post';
            return;
        }

        //перебираю массив комментариев циклом for
        for (let i = 0; i < comments.length; i++) {

            //беру текущий комментарий
            const comment = comments[i];

            //создаю карточку комментария
            const commentCard = document.createElement('div');
            commentCard.classList.add('comment-card');

            //заголовок комментария (номер + name)
            const commentTitle = document.createElement('h3');
            commentTitle.innerText = (i + 1) + '. ' + capitalizeFirstLetter(comment.name);

            //email автора комментария
            const commentEmail = document.createElement('p');
            commentEmail.classList.add('comment-email');
            commentEmail.innerText = comment.email;

            //текст комментария
            const commentBody = document.createElement('p');
            commentBody.innerText = capitalizeFirstLetter(comment.body);

            //добавляю элементы в карточку комментария
            commentCard.append(commentTitle, commentEmail, commentBody);

            //добавляю карточку в секцию комментариев
            commentsSection.appendChild(commentCard);
        }
    }
}