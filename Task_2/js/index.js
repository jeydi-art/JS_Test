// ===== Нахожу основной элемент на странице
const usersDiv = document.getElementById('users');

//отправляю запрос на сервер за списком пользователей
fetch('https://jsonplaceholder.typicode.com/users')
    .then(function (response) {
        //преобразую ответ в JSON
        return response.json();
    })
    .then(function (users) {    //users - массив объектов user, полученных с сервера

        //проверяю, что пришёл массив
        if (!Array.isArray(users)) {
            throw new Error('Users is not an array');
        }

        // проверяю, что массив не пустой
        if (users.length === 0) {
            usersDiv.innerText = 'Users list is empty';
            return;
        }

        // ==== Перебираю массив пользователей
        for (const user of users) {

            //создаю карточку пользователя
            const card = document.createElement('div');
            card.classList.add('users-card');

            //создаю заголовок с id
            const userId = document.createElement('h4');
            userId.innerText = `ID: ${user.id}`;

            //и именем пользователя
            const userName = document.createElement('h4');
            userName.innerText = `Name: ${user.name}`;

            //создаю кнопку для перехода на страницу с деталями пользователя
            const button = document.createElement('button');
            button.innerText = 'Details';

            //обработчик клика по кнопке
            button.onclick = function () {
                //передаю id пользователя через URL
                location.href = 'user-details.html?userId=' + user.id;
            };

            //добавляю элементы внутрь карточки
            card.append(userId,
                userName,
                button);

            //добавляю карточку пользователя в общий контейнер
            usersDiv.appendChild(card);
        }
    });