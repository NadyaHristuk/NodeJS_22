 # Начало работы с Node, Express и Postgres с помощью Sequelize. 

 https://www.postgresql.org/download/
 https://www.guru99.com/download-install-postgresql.html
 https://www.pgadmin.org/download/

 elephantsql.com - если вы не хотите погружаться в установку Postgres, вы можете выбрать версию PostgreSQL, размещенную в Интернете. Я рекомендую ElephantSQL. Бесплатная версия даст вам только 20 МБ. Учитывая довольно маленький размер создаваемого приложения, этого должно быть более чем достаточно.
 Во вкладке browse - добавить следующие значения 
 CREATE TABLE students(
s_id integer PRIMARY KEY,
name text,
start_year integer
);
INSERT INTO students(s_id, name, start_year)
VALUES (1451, 'Анна', 2014),
(1432, 'Виктор', 2014),
(1556, 'Нина', 2015);
и нажать Execute
Это создаст таблицу students и сразу добавит в нее студентов
переходим к премеру 01

Настройка проекта
Создадим папку для проекта и создадим заготовку для проекта 
$ npm init -y

   Установите Express и несколько необходимых зависимостей.

   $ npm i express morgan

   Создайте файл в корневой папке и назовите его app.js.

$ touch app.js

В этом файле давайте создадим наше приложение Express.

const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./server/routes')(app);
app.get('*', (req, res) =>
	res.status(200).send({
	                      message: 'Welcome to the beginning of nothingness.',
	})
);


const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);


app.listen(port, () => {
  console.log(`The server is running at localhost:${port}`);
});


После этого нам понадобится способ перезапускать сервер каждый раз, когда мы что-то изменяем в нашем коде. Для этого мы будем использовать nodemon пакет npm.

$ npm i -D nodemon

Затем откройте ваш package.jsonфайл и создайте команду для запуска сервера. Эта команда будет создана в scriptsразделе. Редактировать свои package.jsonв scriptsразделе следующим образом

"scripts": {
  "dev": "nodemon app.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},

Теперь приложение будет запускаться через

$ npm run dev

И если мы перейдем на  http://localhost:8000. то увидим сообщение {"message":"Welcome to the beginning of nothingness."}

   Итак, мы будем использовать PostgreSQL и Sequelize в качестве ORM, для написания приложения Todo.



 ###  Настройка Sequelize
Для этой части нам потребуется рабочая установка PostgreSQL. 
В Интернете много ресурсов о том, как установить и настроить Postgres, поэтому я не буду на этом концентрироваться.



Далее нам потребуется Sequelize . Это ORM, который будет взаимодействовать с базой данных Postgres для нас. Мы собираемся использовать пакет Sequelize CLI для начальной загрузки проекта для нас. Это также поможет нам генерировать миграции баз данных .

Начнем с установки пакета Sequelize CLI.

$ npm i -g sequelize-cli


npm i sequelize-cli

Вы можете установить sequelize-cliпакет в своем проекте локально, используя -D вместо флага -g. Недостатком этого будет то, что вам нужно будет ставить перед каждым вызовом sequelizeкоманды префикс node_modules/.bin/sequelize

Далее нам нужно настроить Sequelize для нашего проекта. Для этого мы создадим .sequelizer файл в корневой папке нашего проекта. 
В этом файле мы будем указывать пути к файлам, требуемым для Sequelize. Поместите следующее содержимое в этот файл:

const path = require('path');

module.exports = {
  "config": path.resolve('./server/config', 'config.json'),
  "models-path": path.resolve('./server/models'),
  "seeders-path": path.resolve('./server/seeders'),
  "migrations-path": path.resolve('./server/migrations')
};

config.json Файл содержит наши настройки конфигурации приложения, такие как настройка аутентификации базы данных. migrations папка будет содержать миграции нашего приложения, а models папка будет содержать модели приложений. Исходные данные - это исходные данные, предоставляемые системой для тестирования, обучения или создания шаблонов. seeders Папка обычно содержит данные, но мы не будем использовать , что в этом учебнике.

На этом этапе нам нужно установить сам пакет Sequelize вместе с его зависимостями.

$ npm i sequelize pg pg-hstore

pg будет отвечать за создание соединения с базой данных, пока pg-hstore является модулем для сериализации и десериализации данных JSON в формате Postgres hstore.

Теперь,  нам нужно будет выполнить init команду, чтобы создать указанные папки и сгенерировать шаблонный код.

$ sequelize init

Если вы проверите свой каталог прямо сейчас, вы поймете, что приведенная выше команда просто создала каталоги и сгенерировала шаблонный код. Ваша структура каталогов теперь должна выглядеть следующим образом.

postgres-express-react-node-tutorial
├── app.js
├── package.json
└── server
    ├── config
    │   └── config.json
    ├── migrations
    ├── models
    │   └── index.js
    └── seeders

Давайте рассмотрим, например, server/models/index.jsфайл, который был сгенерирован автоматически.

'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


В этом файле подключаются модули, которые мы собираемся использовать. Затем мы читаем конфигурацию, текущей среды Node. Если у нас не определена среда Node, мы по умолчанию development. Затем мы устанавливаем соединение с нашей базой данных, после чего мы читаем нашу папку моделей, обнаруживаем и импортируем все ее модели, добавляем их в объект db и применяем отношения между моделями, если такие отношения существуют.

Рефакторинг server/models/index.js

Поскольку сгенерированный server/models/index.jsфайл имеет синтаксис ES5, мы собираемся изменить его на синтаксис ES6. 

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


Для подключения Postgres, размещенную в Интернете, нам потребуется URL-адрес базы данных, предоставленный нам выбранным хостом базы данных. Предполагая, что мы используем ElephantSQL, нам нужно перейти на панель управления ElephantSQL и щелкнуть, details чтобы просмотреть подробную информацию о нашем бесплатном экземпляре базы данных. Затем мы копируем URL. Нам понадобится этот URL в конфигурации ниже.

Нам нужно заменить development параметр конфигурации базы данных среды на URL нашей базы данных. Поскольку мы заботимся только об development окружающей среде, потому что это все, что мы собираемся использовать. Мы собираемся экспортировать URL, который мы скопировали ранее, в нашу development среду как DATABASE_URL. Наш конфиг теперь будет выглядеть так:

{
  "development": {
    "use_env_variable": "DATABASE_URL"
  },
  "test": {
    "username": "nadin",
    "password": null,
    "database": "todos-test",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  }
}

Это сообщает Sequelize заглянуть в нашу среду и извлечь ключ с именем DATABASE_URL и использовать его для подключения к нашей БД. Код, который делает это в server/models/index.js, как показано в этом фрагменте:

...
let sequelize;
if (config.use_env_variable) {
  // From the environment, extract the key with the name provided in the config as use_env_variable
  // and use that to establish a connection to our database.
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

Наконец, нам нужно экспортировать URL нашей базы данных в нашу среду. В нашем терминале давайте выполним следующую команду:

$ export DATABASE_URL=our-database-url

где our-database-url URL, который мы скопировали из ElephantSQL. 
Каждый раз, когда нам нужно запустить это приложение, нам нужно будет экспортировать DATABASE_URL. 
К счастью, существует dotenv , пакет npm, который делает автоматический экспорт значений в нашу среду приложений быстрым. 

Генерация моделей
С нашей конфигурацией мы готовы к созданию моделей. У нас будет две модели, Todo и TodoItem. Отношение между a Todoи оно TodoItems будет одно-к - многим, так что у a Todo может быть много, TodoItems, a TodoItem может принадлежать только одному Todo.

Запустите следующую команду.

$ sequelize model:create --name Todo --attributes title:string

Это создаст todo.js файл в server/models папке, а также <date>-create-todo.jsфайл миграции в server/migrationsпапке. <date> будет дата создания модели.

Это создаст todo.js файл в server/models папке, а также <date>-create-todo.js файл миграции в server/migrations папке. <date> будет дата создания модели.

Сгенерированный код модели Todo:

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define('Todo', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Todo;
};

В этом файле мы определяем нашу Todo модель. У него будет один атрибут title- строка.

Далее мы хотим привести код в соответствии с ES6 и определить отношения между нашими моделями.
После рефакторинга, редактирования полей модели и определения отношений между нашими моделями мы получаем:

server/models/todo.js

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems',
    });
  };

  return Todo;
};

Обратите внимание, что мы отредактировали title поле и добавили ограничение not-null. Это означает, что база данных не позволит нам писать в нее, если мы не предоставим значение для title поля. Мы также определили отношения между a Todo и it TodoItems в Todo.associate методе класса. Это as: 'todoItems' означает, что каждый раз, когда мы запрашиваем задачу и включаем ее элементы, они будут включаться под ключ todoItems (Sequelize по умолчанию использует множественное имя модели). 

server/models/todoitem.js

module.exports = (sequelize, DataTypes) => {
  const TodoItem = sequelize.define('TodoItem', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  TodoItem.associate = (models) => {
    TodoItem.belongsTo(models.Todo, {
      foreignKey: 'todoId',
      onDelete: 'CASCADE',
    });
  };

  return TodoItem;
};

Обратите внимание, что мы отредактировали как contentи complete поле. Мы добавили в content поле ненулевое ограничение и default значение для complete поля. В общем, наличие значения по умолчанию означает, что если мы не предоставим значение для этого поля при его создании, база данных будет использовать предоставленное значение по умолчанию для этого поля. В дополнение к этому, мы также определили взаимосвязь между TodoItems и с Todo объектами. onDelete: CASCADE говорит Postgres , что если удалить TODO, это связанные элементы списка задач должны быть удалены

Для согласованности мы также рефакторим наши файлы миграции на ES6 и в конечном итоге:

server/migrations/<date>-create-todo.js

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Todos'),
};

server/migrations/<date>-create-todo-item.js

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('TodoItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      todoId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Todos',
          key: 'id',
          as: 'todoId',
        },
      },
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable('TodoItems'),
};

Когда мы запустим эти миграции, up функция будет выполнена. Он позаботится о создании таблицы и связанных с ней столбцов для нас. Если по какой-либо причине нам понадобится откатить (отменить) миграцию, down функция будет выполнена, и она отменит все, что функция up сделала, таким образом, вернув нашу базу данных в то же состояние, в котором она находилась до выполнения миграции.

Эти миграции являются отражением того, как мы хотим, чтобы наши модели выглядели в базе данных. Обратите внимание, что мы также определяем отношения между нашими моделями в create-todo-item.js файле миграции. todoId Поле не генерируется автоматически , и мы должны были вручную определить его. Sequelize автоматически генерирует id, createdAt и updatedAt поля для вас. Кроме того, при каждом сохранении модели updatedAt поле автоматически обновляется, чтобы отразить новое время обновления.

Теперь, когда модели и миграции уже готовы, мы готовы сохранить модели в базе данных, выполнив миграцию. Для этого мы запускаем следующую команду:

$ sequelize db:migrate
node_modules/.bin/sequelize db:migrate

npx sequelize-cli db:migrate --url 'mysql://root:password@mysql_host.com/database_name'

В консоли увидим приблизительно следующее
== 20180908120703-create-todo: migrating =======
== 20180908120703-create-todo: migrated (0.025s)
== 20180908121020-create-todo-item: migrating =======
== 20180908121020-create-todo-item: migrated (0.013s)

Создание контроллеров и маршрутизация
С нашими моделями, давайте перейдем к созданию контроллеров. У нас будет два контроллера, todosController и todoItemsController. todosController будет отвечать за создание, перечисление, обновление и удаление задач, в то время как todoItemsControllerон будет отвечать за создание, обновление и удаление элементов задач.

Создание каждого
Создайте todo.js файл внутри server/controllers/. Внутри этого файла давайте добавим функциональность для создания задач.

server/controllers/todos.js

const Todo = require('../models').Todo;

module.exports = {
  create(req, res) {
    return Todo
      .create({
        title: req.body.title,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
};

Приведенный выше фрагмент кода создает новое задание и, в случае успеха, возвращает его. Если он обнаруживает ошибку, он возвращает эту ошибку. ( Конечно, это не лучший способ справиться с этими ошибками, но мы пока воспользуемся им, для простоты .;))

Затем мы создаем index.jsфайл внутри server/controllers, откуда мы собираемся экспортировать наши контроллеры. Я нахожу это полезным, поскольку оно помогает мне консолидировать мой импорт из одного файла.

server/controllers/index.js

const todos = require('./todos');

module.exports = {
  todos,
};

Далее нам нужно добавить маршрут API, который сопоставляется с этой функциональностью. Создайте routes папку внутри server папки. Внутри новой routes папки создайте index.js файл. Мы собираемся разместить все наши маршруты в этом index.js файле. Однако в реальном приложении вы можете разделить маршруты и поместить их в разные папки.

Внутри server/routes/index.js добавьте следующий код:

const todosController = require('../controllers').todos;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.post('/api/todos', todosController.create);
};

Это добавит два новых маршрута: приветственный маршрут в /api и маршрут для создания задач в /api/todos. Когда мы обращемся к  /api, наше приложение отправляет обратно объект JSON, приветствуя пользователя в нашем Todos API. Если мы публикуем некоторые данные /api/todos, мы говорим нашему приложению запустить todosController.create функцию, которая будет принимать объект запроса, извлекать опубликованные данные и создавать из них задачу. В этом случае мы говорим, что todosController.create функция является обработчиком маршрута POST для /api/todos.

Далее нам нужно сообщить приложению, что мы только что добавили маршруты. Открой свой app.js. Мы собираемся добавить require оператор прямо перед созданным ранее маршрутом, чтобы наш app.js файл теперь выглядел следующим образом:

app.js

// Require our routes into the application.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));


Обратите внимание, что мы должны требовать наших маршрутов перед тем, как app.get('*', ...)мы добавили ранее. Это связано с тем, что универсальный маршрут будет соответствовать любому маршруту и ​​будет служить приветственным сообщением, поэтому, если после него нам потребуются другие наши маршруты, эти другие маршруты никогда не будут задействованы.

Затем мы открываем Postman и выдаем запрос POST для создания нового элемента todo


---
