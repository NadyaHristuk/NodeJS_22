   # Аутентификация на основе веб-токенов, JSON Web Tokens (JWT), и bcrypt. Token-Based Authentication. Про аутентификацию, индификацию и авторизацию. 

- Что такое авторизация/аутентификация
- Где хранить токены
- Как ставить куки ?
- Процесс логина
- Процесс рефреш токенов
- Кража токенов/Механизм контроля токенов
- Зачем все это ? JWT vs Cookie sessions

Довольно важной задачей при разработке веб-сайтов и веб-приложений есть ограничение доступа к некоторым разделам сайта, например к панели администратора. В теории это достаточно сложный процесс, с трема составляющими - аутентификация, идентификация и авторизация (англ. authentication, identification, authorization).

Когда вы разрабатываете API, в большинстве случаев вам потребуется на его часть или на все ендпоинты проверять идентификацию пользователя в приложении. Как это сделать с помощью Node.js? 
для ограничения доступа
Аутентификация и авторизация необходимы на страницах, доступных лишь некоторым пользователям.
Здесь фактически нам доступны три вида аутентификации: стандартная через куки, через внешние сервисы и аутентификация с помощью токена.

## Давайте разберемся с ключевыми терминами:
__Идентификация__ — процесс распознавания пользователя по его идентификатору.
__Аутентификация(authentication, от греч. αὐθεντικός [authentikos] – реальный, подлинный; от αὐθέντης [authentes] – автор)__ - в переводе означает «установление подлинности». Аутентификация — проверка, является ли некто тем, за кого себя выдаёт. Обычно она подразумевает ввод логина и пароля, но также могут быть использованы и другие средства, такие как использование смарт-карты, отпечатков пальцев и др. Это процесс проверки учётных данных пользователя (логин/пароль). Проверка подлинности пользователя путём сравнения введённого им логина/пароля с данными сохранёнными в базе данных.

__Авторизация(authorization — разрешение, уполномочивание)__ - это проверка прав пользователя на доступ к определенным ресурсам.
Авторизация — проверка, может ли аутентифицированный пользователь выполнять определённые действия (их часто обозначают как ресурсы). Чаще всего это определяется проверкой, назначена ли пользователю определённая роль, имеющая доступ к ресурсам.

Например, после аутентификации юзер _**sasha**_ получает право обращаться и получать от ресурса __"super.com/vip"__ некие данные. Во время обращения юзера _**sasha**_ к ресурсу __vip__ система авторизации проверит имеет ли право юзер обращаться к этому ресурсу (проще говоря переходить по неким разрешенным ссылкам)

1. Юзер c емайлом _**sasha_gmail.com**_ успешно прошел аутентификацию
2. Сервер посмотрел в БД какая роль у юзера
3. Сервер сгенерил юзеру токен с указанной ролью
4. Юзер заходит на некий ресурс используя полученный токен
5. Сервер смотрит на права(роль) юзера в токене и соответственно пропускает или отсекает запрос

Собственно п.5 и есть процесс __авторизации__.

#### Авторизация на основе токенов
Весь процес аутентификации выглядит следующим образом (получение токена доступа в Oath2):
 - пользователь вводит данные авторизации (логин, пароль) и нажимает на кнопку отправки
 - Клиент (веб-браузер) отправляет данные серверу авторизации
 - Сервер авторизации аутентифицирует пользователя и возвращает токен доступа
 - Для доступа к ресурсу веб-сервиса клиент добавляет в запрос ранее полученный токен доступа

#### Что такое JWT
JWT (JSON Web Token) — это открытый промышленный стандартный метод RFC 7519 для надежного представления запросов между двумя сторонами. 
__JSON Web Token (JWT)__ — содержит три блока, разделенных точками: заголовок(__header__), набор полей (__payload__) и __сигнатуру__. Первые два блока представлены в JSON-формате и дополнительно закодированы в формат base64. Набор полей содержит произвольные пары имя/значения, притом стандарт JWT определяет несколько зарезервированных имен (iss, aud, exp и другие). Сигнатура может генерироваться при помощи и симметричных алгоритмов шифрования, и асимметричных. Кроме того, существует отдельный стандарт, отписывающий формат зашифрованного JWT-токена.

Пример подписанного JWT токена (после декодирования 1 и 2 блоков):
```
{ alg: "HS256", typ: "JWT" }.{ iss: "auth.myservice.com", aud: "myservice.com", exp: 1435937883, userName: "John Smith", userRole: "Admin" }.S9Zs/8/uEGGTVVtLggFTizCsMtwOJnRhjaQ2BMUQhcY
```

__Токены__ предоставляют собой средство __авторизации__ для каждого запроса от клиента к серверу. Токены(и соответственно сигнатура токена) генерируются на сервере основываясь на секретном ключе(который хранится на сервере) и __payload'e__. Токен в итоге хранится на клиенте и используется при необходимости __авторизации__ какого-либо запроса. Такое решение отлично подходит при разработке SPA.

При попытке хакером подменить данные в __header'ре__ или __payload'е__, токен станет не валидным, поскольку сигнатура не будет соответствовать изначальным значениям. А возможность сгенерировать новую сигнатуру у хакера отсутствует, поскольку секретный ключ для зашифровки лежит на сервере.

__access token__ - используется для __авторизации запросов__ и хранения дополнительной информации о пользователе (аля __user_id__, __user_role__ или еще что либо, эту информацию также называет __payload__). __Сам токен храним не в localStorage как это обычно делают, а в памяти клиентского приложения.__

__refresh token__ - выдается сервером по результам успешной аутентификации и используется для получения новой пары __access/refresh__ токенов. __Храним исключительно в httpOnly куке__.

Каждый токен имеет свой срок жизни, например __access__: 30 мин, __refresh__: 60 дней

__Поскольку токены(а данном случае access) это не зашифрованная информация крайне не рекомендуется хранить в них какую либо `sensitive data` (passwords, payment credentials, etc...)__

__Роль рефреш токенов и зачем их хранить в БД.__ Рефреш на сервере хранится для учета доступа и инвалидации краденых токенов. Таким образом сервер наверняка знает о клиентах которым стоит доверять(кому позволено авторизоваться). Если не хранить рефреш токен в БД то велика вероятность того что токены будут бесконтрольно гулять по рукам злоумышленников. Для отслеживания которых нам придется заводить черный список и периодически чистить его от просроченных. В место этого мы храним лимитированный список белых токенов для каждого юзера отдельно и в случае кражи у нас уже есть механизм противодействия(описано ниже).

## Как ставить куки ?
Для того что бы `refreshToken` кука была успешно уставленна и отправлена браузером, адреса эндпоинтов аутентификации(`/api/auth/login`, `/api/auth/refresh-tokens`, `/api/auth/logout`) должны располагася в доменном пространстве сайта. Тоесть для домена `super.com` на сервере ставим куку с такими опциями:
```
{
    domain: '.super.com',
    path: '/api/auth'
}
```

Таким образом кука установится в браузер и прийдет на все эндпоинты по адресу `super.com/api/auth/<any-path>`

Если у нас монолит и за аутентификацию отвечает один и тот-же API, тут проблем не должно быть. Но если за аутентификацию отвечает отдельный микросервис, прячем его средствами `nginx` по выше указанному пути (`super.com/api/auth`).
```
# пример настройки nginx конфига(только основые настройки)
server {
    listen 80;
    server_name super.com;
    # SPA/Front-end
    location / {
        try_files $uri /index.html;
        root /var/www/frontend/dist;
        index index.html;
    }
    # Main API
    location /api {
        proxy_pass http://111.111.111.111:7000;
    }
    # Auth API
    location /api/auth {
        proxy_redirect http://222.222.222.222:7000   /auth/;
        proxy_pass http://222.222.222.222:7000;
    }
}
```

## Логин, создание сессии/токенов (api/auth/login):
1. Пользователь логинится в приложении, передавая логин/пароль и __fingerprint__ браузера (ну или некий иной уникальный идентификатор устройства если это не браузер)
2. Сервер проверят подлинность логина/пароля 
3. В случае удачи создает и записывает сессию в БД `{ userId: uuid, refreshToken: uuid, expiresIn: int, fingerprint: string, ... }` (схема таблицы ниже)
4. Создает __access token__
5. Отправляет клиенту __access и refresh token uuid__ (взятый из выше созданной сессии)
6. __access__ возвращает в теле запроса, __refresh__ устанавливает в качестве __httpOnly__ куки
7. Клиент сохраняет токены(__access__ в памяти приложения, __refresh__  сетится как кука автоматом)

На что нужно обратить внимание при установке __refresh__ куки:
- `maxAge` куки ставим равную `expiresIn` из выше созданной сессии
- В `path` ставим корневой роут `auth` контроллера  (`/api/auth`) это важно, таким образом токен получат только те хендлеры которым он нужен(`/api/auth/logout` и `/api/auth/rerfesh-tokens`), остальные обойдутся(нечего зря почём отправлять __sensitive data__).

__Стоит заметить, что процесс добавления сессии в таблицу должен имеет свои меры безопасности.__ При добавлении стоит проверять сколько рефреш-сессий всего есть у юзера и, если их слишком много или юзер конектится одновременно из нескольких подсетей, стоит предпринять меры. Имплементируя данную проверку,  что бы юзер имел максимум до 5 одновременных рефреш-сессий максимум, и при попытке установить следующую удаляю предыдущие. Все остальные проверки на ваше усмотрение в зависимости от задачи.

Таким образом если юзер залогинился на пяти устройствах, рефреш токены будут постоянно обновляться и все счастливы. Но если с аккаунтом юзера начнут производить подозрительные действия(попытаются залогинится более чем на 5'ти устройствах) система сбросит все сессии(рефреш токены) кроме последней.

Перед каждым запросом клиент предварительно проверяет время жизни __access token'а__ (да берем `expiresIn` прямо из JWT в клиентском приложении) и если оно истекло  шлет запрос на обновление токенов. Для большей уверенности можем обновлять токены на несколько секунд раньше. То есть кейс когда API получит истекший __access__ токен практически исключен.

Что такое __fingerprint__ ? Это инструмент отслеживания браузера вне зависимости от желания пользователя быть идентифицированным. Это хеш сгенерированный js'ом на базе неких уникальных параметров/компонентов браузера. Преимущество __fingerprint'a__ в том что он нигде персистентно не хранится и генерируется только в момент логина и рефреша.
- Библиотека для хеширования:  https://github.com/Valve/fingerprintjs2
- Более подробно:  https://player.vimeo.com/video/151208427
- Пример ф-ции получения такого хеша: https://gist.github.com/zmts/b26ba9a61aa0b93126fc6979e7338ca3

В случае если клиент не браузер, а мобильное приложение, в качестве __fingerprint__ используем любую уникальную строку(тот же `uuid`) персистентно хранящуюся на устройстве.

## Рефреш токенов (api/auth/refresh-tokens):
Для использования возможности аутентификации на более чем одном девайсе необходимо хранить все рефреш токены по каждому юзеру. Список в PostgreSQL или Redis таблице. В процессе каждого логина создается запись с IP/Fingerprint и другой мета информацией, так званая __рефреш-сессия__.
```
CREATE TABLE refreshSessions (
    "id" SERIAL PRIMARY KEY,
    "userId" uuid REFERENCES users(id) ON DELETE CASCADE,
    "refreshToken" uuid NOT NULL,
    "ua" character varying(200) NOT NULL, /* user-agent */
    "fingerprint" character varying(200) NOT NULL,
    "ip" character varying(15) NOT NULL,
    "expiresIn" bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now()
);
```

1. Клиент(фронтенд) проверяет перед запросом не истекло ли время жизни __access token'на__
2. Если истекло клиент делает запрос на `POST auth/refresh-tokens` `{ fingerprint: string }` в `body` и соответственно `refreshToken` куку.
3. Сервер получает запись рефреш-сессии по UUID'у рефреш токена
4. Сохраняет текущую рефреш-сессию в переменную и удаляет ее из таблицы
5. Проверяет текущую рефреш-сессию:
    1. Не истекло ли время жизни
    2. На соответствие старого  __fingerprint'a__ полученного из текущей рефреш-сессии с новым полученным из тела запроса
6. В случае негативного результата бросает ошибку `TOKEN_EXPIRED`/`INVALID_REFRESH_SESSION`
7. В случае успеха создает новую рефреш-сессию и записывает ее в БД
8. Создает __access token__
8. Отправляет клиенту __access и refresh token uuid__ (взятый из выше созданной рефреш-сессии)
9. __access__ возвращает в теле запроса, __refresh__ устанавливает в качестве __httpOnly__ куки

_Tip:_ Для отправки запроса с куками для `axios` есть опция `{ withCredentials: true }`

## Ключевой момент:
В момент рефреша то есть обновления __access token'a__ обновляются __ОБА__ токена. Но как же __refresh token__ может сам себя обновить, он ведь создается только после успешной аунтефикации ? __refresh token__ в момент рефреша сравнивает себя с тем __refresh token'ом__ который лежит в БД и вслучае успеха, а также если у него не истек срок, система рефрешит токены. 

Вопрос зачем __refresh token'y__ срок жизни, если он обновляется каждый раз при обновлении __access token'a__ ? Это сделано на случай, если юзер будет в офлайне более 60 дней, тогда придется заново вбить логин/пароль.


## В случае кражи access токена и refresh куки:
1. Хакер воспользовался __access token'ом__
2. Закончилось время жизни __access token'на__
3. __Клиент хакера__ отправляет __refresh token__ и __fingerprint__
4. Сервер смотрит __fingerprint__ хакера
5. Сервер не находит __fingerprint__ хакера в рефреш-сессии и удаляет ее из БД
6. Сервер логирует попытку несанкционированного обновления токенов
7. Сервер перенаправляет хакера на станицу логина. Хакер идет лесом
8. Юзер пробует зайти на сервер >> обнаруживается что __refresh token__ отсутствует
9. Сервер перенаправляет юзера на форму аутентификации
10. Юзер вводит логин/пароль

## В случае кражи access токена, refresh куки и fingerprint'а:
Стащить все авторизационные данные это не из легких задач, но все же допустим этот кейс как крайний.

1. Хакер воспользовался __access token'ом__
2. Закончилось время жизни __access token'на__
3. __Хакер__ отправляет __refresh__ куку и __fingerprint__
4. На сервере создается новый __refresh__ токен ("от хакера")
5. Хакер получает новую пару токенов
6. Юзер пробует отправить запрос на сервер >> обнаруживается что __refresh__ токен не валиден
7. Сервер перенаправляет юзера на форму аутентификации
8. Юзер вводит логин/пароль
9. Создается новый __refresh__ токен >> __refresh__ токен "от хакера" становится не валиден

## Зачем все это ? JWT vs Cookie sessions
Зачем этот весь геморой ? Почему не юзать старые добрые cookie sessions ? Чем не угодили куки ?
- Куки подвержены CSRF: https://habr.com/ru/company/oleg-bunin/blog/412855 https://www.youtube.com/watch?v=x5AuK_IbJlg
- Нативыным приложениям для сматфонов удобнее работать с токенами. Да есть хаки для работы с куки, но это не нативная поддержка
- Куки в микросерисной архитектуре использовать не вариант. Напомню зачастую микросервисы раскиданы на разных доменах, а куки не поддерживают кросc-доменные запросы
- В микросерисной архитектуре JWT позволяет каждому сервису независимо от сервера авторизации верифицировать `access` токен (через публичный ключ)
- При использовании cookie sessions программист зачастую надеется на то, что предоставил фреймворк и оставляет как есть
- При использовании jwt мы видим проблему с безопасностью и стараемся предусмотреть механизмы контроля в случае каржи авторизационных данных. При использовании cookie сессий программист зачастую даже не задумывается что сессия может быть скомпрометирована
- __На каждом запросе__ использование JWT избавляет бекенд от одного запроса в БД(или кеш) за данными пользователя(`userId`, `email`, etc.)

#### Хранение паролей в базе данных
Безопасное хранение паролей в базе данных требует определённой аккуратности. Атакующий, получивший доступ к базе или резервным копиям, может восстановить пароли, используя достаточно распространённые приёмы, если от них не защититься.

bcrypt -  npm пакет позволяет хэшировать и шифровать конфиденциальные данные, такие как пароли пользователей, перед их сохранением в базу данных.

Из Википедии: «bcrypt - это функция хэширования паролей, разработанная Niels Provos и David Mazières, основанная на шифре Blowfish и представленная в USENIX в 1999 году». 

#### Факторы аутентификации

Метод стандартной аутентификации не может обеспечить абсолютную безопасность при входе пользователя в систему. Для создания более надежной защиты используются дополнительные категории учетных данных (факторов).

__Однофакторная аутентификация (SFA)__ – базовый, традиционный метод проверки подлинности с использованием только одной категории. Наиболее распространенным примером SFA являются учетные данные, связанные с введением имени пользователя и обычного пароля. 
Доступ к ресурсам через ввод логина и пароля, является однофакторной аутентификацией, поскольку для входа используется только один тип аутентификационных данных — известный пользователю пароль.

__Однофакторная двухэтапная аутентификация__
Благодаря тому, что смартфоны стали неотъемлемой частью нашей жизни, именно они стали одним из способов подтверждения личности пользователя. Они являются токенами для доступа к различным ресурсам. В этом случае одноразовый пароль генерируется или с помощью специального приложения, или приходит по SMS – это максимально простой для пользователя метод.

Аутентификация происходит следующим образом:
Пользователь вводит логин и пароль, указанные при регистрации. Если данная пара корректна (логин есть в базе и соответствует паролю) система высылает одноразовый пароль, имеющий ограниченное время действия.
Пользователь вводит одноразовый пароль и, если он совпадает с тем, что отправила система, то пользователь получает доступ к своей учетной записи, денежным средствам или подтверждает денежный перевод.
Даже если злоумышленник получит логин и пароль для учетной записи (с помощью вредоносной программы, кражи записной книжки с паролями или методами социальной инженерии и фишинга), то после ввода этих данных система отправит на привязанный мобильный телефон пользователя одноразовый код с ограниченным временем действия. Без одноразового кода мошенник не сможет похитить денежные средства.

__Двухфакторная аутентификация (2FA)__ – двухступенчатый процесс проверки, который учитывает два разных типа пользовательских данных. Помимо логина и пароля, для обеспечения дополнительного уровня защиты, система может запросить особый код, присланный в SMS сообщении или в письме электронной почты.
Среди видов многофакторной аутентификации наиболее распространена двухфакторная аутентификация (2FA — 2-factor authentication) – метод, при котором пользователю для получения доступа необходимо предоставить два разных типа аутентификационных данных, например, что-то известное только пользователю (пароль) и что-то присущее только пользователю (отпечаток пальца).

__Многофакторная аутентификация (MFA)__ – самый современный метод проверки подлинности, который использует два, три (или больше) уровня безопасности. Категории всех уровней должны быть независимыми друг от друга, чтобы устранить любую уязвимость в системе. Финансовые организации, банки, правоохранительные органы пользуются многофакторной аутентификацией для защиты своих данных от потенциальных угроз.
Многофакторная аутентификация представляет собой метод, при котором пользователю для доступа к учетной записи или подтверждения операции с денежными средствами необходимо двумя различными факторами доказать, что именно он владелец учетной записи или что именно он осуществляет вход.
Примером MFA является использование банковских карт. Наличие карты – первый фактор защиты, введение пин-кода – второй.


## В итоге:
- __access__ токены храним исключительно в памяти клиентского приложения. Не в глобально доступной переменной аля `window.accessToken` а в __замыкании__
- __refresh__ токен храним исключительно в __httpOnly__ куке
- Механизмы контроля при угоне __sensitive data__ в наличии
- Взяли лучшее из обеих технологий, максимально обезопасились от CSRF/XSS
- Добавьте в компанию ко всему CSP заголовки и SameSite=Strict флаг для кук и ждите прихода злодеев

___


### Info:
- https://www.youtube.com/playlist?list=PLvTBThJr861y60LQrUGpJNPu3Nt2EeQsP
- https://habrahabr.ru/company/Voximplant/blog/323160/
- https://tools.ietf.org/html/rfc6749
- https://www.digitalocean.com/community/tutorials/oauth-2-ru
- https://jwt.io/introduction/
- https://auth0.com/blog/using-json-web-tokens-as-api-keys/
- https://auth0.com/blog/cookies-vs-tokens-definitive-guide/
- https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/
- https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
- https://habr.com/company/dataart/blog/262817/
- https://habr.com/post/340146/
- https://habr.com/company/mailru/blog/115163/
- https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
- https://egghead.io/courses/json-web-token-jwt-authentication-with-node-js
- https://www.digitalocean.com/community/tutorials/oauth-2-ru
- https://github.com/shieldfy/API-Security-Checklist/blob/master/README-ru.md
- https://www.youtube.com/watch?v=Ngh3KZcGNaU
- https://www.youtube.com/watch?v=R0-eoLp871s
- https://www.youtube.com/watch?v=u9hn3s2kUrg
- https://ain.ua/2020/02/29/adtech-bez-cookies/
- https://habr.com/ru/post/492830 (cookies SameSite)

### And why JWT is bad
- http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
- http://cryto.net/~joepie91/blog/2016/06/19/stop-using-jwt-for-sessions-part-2-why-your-solution-doesnt-work/
- https://medium.com/@cjainn/anatomy-of-a-jwt-token-part-1-8f7616113c14
- https://medium.com/@cjainn/anatomy-of-a-jwt-token-part-2-c12888abc1a2
- https://scotch.io/bar-talk/why-jwts-suck-as-session-tokens
- https://t.me/why_jwt_is_bad

---

### Список использованной литературы:
- https://loftbooks.ru/token-based-authentication-in-nodejs
- https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc
- https://metanit.com/sharp/aspnet_webapi/5.1.php
- https://safe-surf.ru/users-of/article/643444/
- https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/