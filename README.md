## Node.js и PostgreSQL

Для простоты мы будем использовать SQL в следующем примере. Мой выбор — PostgreSQL.

Чтобы запустить PostgreSQL, вам необходимо установить его на свой компьютер. Если вы используете Mac, вы можете использовать Homebrew для установки PostgreSQL. В противном случае, если вы работаете в Linux, вы можете установить его с помощью своего диспетчера пакетов.

![](NodeHeroEbook-TheComplete-010.png)

Для получения дополнительной информации ознакомьтесь с этим отличным [руководством](http://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/) по началу работы с вашей первой базой данных.

Если вы планируете использовать инструмент для просмотра базы данных, я бы рекомендовал утилиту для командной строки — `psql`. Она поставляется вместе с сервером PostgreSQL. Вот небольшая [инструкция](http://www.postgresonline.com/downloads/special_feature/postgresql83_psql_cheatsheet.pdf), которая пригодится, если вы начнёте использовать `psql`.

Если вам не нравится интерфейс командной строки, вы можете использовать [pgAdmin](https://www.pgadmin.org/), который является инструментом с открытым исходным кодом и предназначен для администрирования PostgreSQL.

Обратите внимание, что SQL — это сам по себе язык программирования. Мы не будем рассматривать все его возможности, а только наиболее простые. Если вам потребуется глубже изучить SQL, то в интернете есть много отличных онлайн-курсов, охватывающих все основы [PostgreSQL](https://www.pluralsight.com/courses/postgresql-getting-started).

## Взаимодействие Node.js с базой данных

Во-первых, мы должны создать базу данных, которую мы будем использовать. Для этого введите следующую команду в терминал: `createdb node_hero`.

Затем мы должны создать таблицу для наших пользователей.

```sql
CREATE TABLE users(
  name VARCHAR(20),
  age SMALLINT
);
```

Наконец, мы можем вернуться к программированию. Вот как вы можете взаимодействовать с вашей базой данных через вашу программу на Node.js:

```javascript
'use strict'

const pg = require('pg')
const conString = 'postgres://username:password@ localhost/node_hero' // Убедитесь, что вы указали данные от вашей базы данных

pg.connect(conString, function (err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }
  client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
    done()

    if (err) {
      return console.error('error happened during query', err)
    }
    console.log(result.rows[0])
    process.exit(0)://www.pgadmin.org://www.pgadmin.org://www.pgadmin.org
  })
})
```

Это был простой пример — "hello world" в PostgreSQL. Обратите внимание, что первым параметром является строка, которая является нашей SQL-командой, второй параметр представляет собой массив значений, которыми мы хотели бы параметризовать наш запрос.

Большой ошибкой с точки зрения безопасности был бы ввод данных, пришедших от пользователя, в том виде, в котором они были переданы. Приведённая выше функция `client.query` защищает вас от SQL-инъекций, являющихся распространённым видом атаки, когда злоумышленник пытается внедрить в запрос произвольный SQL-код. Всегда учитывайте это при создании любого приложения, в котором возможен ввод данных со стороны пользователя. Чтобы узнать больше, ознакомьтесь с нашим [контрольным списком безопасности Node.js-приложений](https://blog.risingstack.com/node-js-security-checklist/).

*Примечание переводчика: обычно никто не пишет SQL-запросы руками, вместо этого используют так называемые конструкторы запросов (query builder), например [sequelize](http://docs.sequelizejs.com/) и [knex](http://knexjs.org/).*

Давайте продолжим наш предыдущий пример.

```javascript
app.post('/users', function (req, res, next) {
  const user = req.body

  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function (err, result) {
      done() // Этот коллбек сигнализирует драйверу pg, что соединение может быть закрыто или возвращено в пул соединений
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.send(200)
    })
  })
})
```

Достижение разблокировано: пользователь сохранён в базе данных! :) Теперь давайте попробуем прочитать эти данные. Затем добавим в наше приложение новый роут для поиска пользователей.

```javascript
app.get('/users', function (req, res, next {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.json(result.rows)
    })
  })
})
```

## Это было не так сложно, не так ли?

Теперь вы можете запустить любой сложный SQL-запрос, который вы только сможете вообразить, в вашем Node.js-приложении.

>  *С помощью этой техники вы можете постоянно хранить данные в своём приложении, а благодаря трудолюбивой команде разработчиков модуля node-postgres это проще простого.*

Мы рассмотрели все основы, которые вы должны знать об использовании баз данных в Node.js. Теперь попробуйте создать что-то самостоятельно.
