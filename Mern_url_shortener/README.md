   # Аутентификация на основе веб-токенов. 

   Пример по сокращению ссылок с помощью библиотеки shortid. С регистрацией и логинизацией юзеров. Текущий юзер может создавать ссыллки, которые будут добавляться в список его ссылок. Можно посмотреть все сокращенные ссылки текущего юзера или информацию по одной ссылке. Так же для перехода по ссылке на ее изначальный адрес используется функция из модуля express -  res.redirect, которая перенаправляет пользователя на исходный адрес страницы.

- открытые ендпоинты /api/auth регистрация и логинизация
- закрытые ендпониты, без токена не даст посетить, /api/link


---