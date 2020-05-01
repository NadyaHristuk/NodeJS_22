# Работа с базами данных

Возможно, вы уже слышали, что существуют два основных типа баз данных: SQL и NoSQL.

## SQL

Начнём с SQL. Это язык запросов, предназначенный для работы с реляционными базами данных. SQL немного отличается в зависимости от продукта, который вы используете, но базовые вещи в них тождественны.

Сами данные хранятся в таблицах. Каждая добавленная часть будет представлена в виде строки в таблице, как в Google Sheets или Microsoft Excel.

В базе данных SQL вы можете определить схемы. Они предоставят скелет для данных, которые вы собираетесь разместить. Также, перед тем, как сохранить данные, будет необходимо задать типы различных значений. Например, вам нужно будет определить таблицу для ваших пользовательских данных и сообщить базе данных, что у неё есть имя пользователя, являющееся строкой, и возраст - целый тип.

## NoSQL

С другой стороны, в последнее десятилетие стали весьма популярны NoSQL базы данных. С NoSQL вам не нужно определять схему и вы можете хранить любой произвольный JSON. Это хорошо сочетается с JavaScript, потому что мы можем легко превратить любой объект в JSON. Будьте осторожны, потому что вы никогда не можете гарантировать, что данные консистентны, и вы никогда не сможете узнать, какая структура находится в базе данных.

## Node.js и MongoDB

Существует распространённое заблуждение о Node.js, которое можно услышать довольно часто:

*«Node.js можно использовать только с MongoDB (самая популярная NoSQL база данных)».*

По моему опыту, это не так. У большинства баз данных имеются драйверы для Node.js и библиотеки в NPM. По моему мнению, они такие же простые и лёгкие в использовании, как MongoDB.


#### CAP-теорема
**Теорема Брюера**

  эвристическое утверждение о том, что в любой реализации распределённых вычислений возможно обеспечить не более двух из трёх следующих свойств:
  
   согласованность данных (англ. consistency) — во всех вычислительных узлах в один момент времени данные не противоречат друг другу;
   
   доступность (англ. availability) — любой запрос к распределённой системе завершается корректным откликом;
   
   устойчивость к разделению (англ. partition tolerance) — расщепление распределённой системы на несколько изолированных секций не приводит к некорректности отклика от каждой из секций.
   
###MongoDB

   humongous – огромный
   
   документо-ориентированное хранение данных (JSON-подобная схема)
   не требует описания схем данных
   
   JavaScript в качестве языка запросов к базе данных

##### Любой процесс на любой машине сам отвечает за генерацию ID'шников и не вступает в конфликты с другими
```javascript
ObjectId("56cc30e2e52c943bf62fff72")
56cc30e2 – time
e52c94 – mid
3bf6 – pid
2fff72 – inc

```
56cc30e2 e52c94 3bf6 2fff72
56cc3503 e52c94 3bf6 2fff73</span>


### Репликация и шардирование

###### Range Based vs Hash Based

    Range Based проще настроить, но возможно неравномерное распределение данных
    Hash Based «соседние данные скорее всего будут в разных шардах», зато распределение максимально равномерно

### JOIN
#### Нормализация и денормализация

Нормализация — это процесс организации данных в базе данных, включающий создание таблиц и установление отношений между ними в соответствии с правилами, которые обеспечивают защиту данных и делают базу данных более гибкой, устраняя избыточность и несогласованные зависимости.

Избыточность данных приводит к непродуктивному расходованию свободного места на диске и затрудняет обслуживание баз данных. Например, если данные, хранящиеся в нескольких местах, потребуется изменить, в них придется внести одни и те же изменения во всех этих местах. Изменение адреса клиента гораздо легче реализовать, если в базе данных эти сведения хранятся только в таблице Customers и нигде больше. 

#####     Транзакции и конкурентность
   Транзакции в MongoDB https://habrahabr.ru/post/153321/

Добавление в MongoDB транзакции. Но на самом деле это не панацея и у них есть ограничения, некоторые перечислены ниже, а некоторые в комментариях

    все работает хорошо (база консистентна, транзакции не теряются) в предположении, что если мы получили подтверждение от хранилища, что запись прошла, она действительно прошла и эти данные не потеряются (монга обеспечивает это при включенном журналировании)
    транзакции оптимистические, проэтому при изменении объекта с высокой частотой из разных потоков их лучше не использовать
    для изменения n объектов в одной транзакции используется 2n+2 запросов
    со временем у нас будут накапливаться tx объекты от упавших транзакций — периодически мы должны удалять старые
   
#### Для чего нужно и не нужно использовать?
       Сильные стороны MongoDB
            - Большие объемы данных
            - Гибкая модель данных (schemeless)
            - Простота
          
        Слабые стороны MongoDB
            Нормализация
            
		Так для чего нужно?
            	- Быстрые прототипы
                - Блоги
                - Эксперименты
                - проект на хакатоне

## “Работа с нереляционными БД” (на примере MongoDB)

### Для добавления в коллекцию могут использоваться три ее метода:
- ```insertOne()```: добавляет один документ
- ```insertMany()```: добавляет несколько документов
- ```insert()```: может добавлять как один, так и несколько документов

Некоторые ограничения при использовании имен ключей:
1. Символ ```$``` не может быть первым символом в имени ключа
2. Имя ключа не может содержать символ точки .
3. Имя ```_id``` не рекомендуется использовать


```js
db.cats.insertOne({name: 'barsik', age: 3, characteristics: ['гадит в тапки', 'дает себя гладить', 'рябой']})
```

```js
db.cats.insertMany([{name: 'Lama', age: 2, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Liza', age: 4, characteristics: ['гадит в лоток', 'дает себя гладить', 'белый']}])

db.cats.insert([{name: 'Boris', age: 12, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Murzik', age: 1, characteristics: ['гадит в лоток', 'дает себя гладить', 'черный']}])
```
### Для вывода документов в более удобном наглядном представлении мы можем добавить вызов метода ```pretty()```:
```js
db.cats.find().pretty()

db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}).pretty()
```
### Проекция:
```js
db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 0}).pretty()

db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 1, age: 1}).pretty()
```
### Запрос к вложенным объектам
```js
db.cats.insert({name: 'Dariy', age: 10, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый'], owners: {name: 'Nata', age: 23, adress: 'Poltava'}})

db.cats.find({'owners.name': 'Nata'})
```
### Настройка запросов и сортировка:
```js
db.cats.find().limit(3) - первые три
db.cats.find().skip(3) - пропустить первые три
db.cats.find().sort({name: 1}) 

db.cats.findOne({age: {$lte: 3}})
```
### Курсоры
Результат выборки, получаемой с помощью функции ```find```, называется курсором
Курсоры инкапсулируют в себе наборы получаемых из бд объектов. Используя синтаксис языка javascript и методы курсоров, мы можем вывести полученные документы на экран и как-то их обработать. 
```js
var cursor = db.cats.find();
while(cursor.hasNext()){
	obj = cursor.next();
	print(obj["name"]);
}
```
### С помощью функции count() можно получить число элементов в коллекции:
```js
db.cats.count()
db.cats.find({age: {$lte: 3}}).count()
```

## Селекторы запросов
Селектор запросов MongoDB (это JSON-объект) аналогичен предложению where SQL-запроса. Как таковой он используется для поиска, подсчёта, обновления и удаления документов из коллекций.

Селектор — это JSON-объект, в простейшем случае это может быть даже {}, что означает выборку всех документов (аналогичным образом работает null). Если нам нужно выбрать всех единорогов (англ. «unicorns») женского рода, можно воспользоваться селектором ```{gender:'f'}```.

```{поле: значение}``` используется для поиска всех документов, у которых есть 'поле' и у него есть 'значение'.

```{поле1: значение1, поле2: значение2}``` работает как логическое И.

### В MongoDB в запросах можно использовать условные конструкции с помощью операторов сравнения:

- ```$eq``` - (равно)
- ```$gt``` - (больше чем)
- ```$lt``` - (меньше чем)
- ```$gte``` - (больше или равно)
- ```$lte``` - (меньше или равно)
```js
db.cats.find ({age: {$lte: 10, $gte:2}})
```
### Поиск по массивам и операторы ```$in, $nin, $all```
Оператор ```$in``` определяет массив возможных выражений и ищет те ключи, значение которых имеется в массиве:
```js
db.cats.find({age: {$in : [2, 10]}})
```
Противоположным образом действует оператор ```$nin``` - он определяет массив возможных выражений и ищет те ключи, значение которых отсутствует в этом массиве
```js
db.cats.find({age: {$nin : [2, 10]}})
```
Оператор ```$all``` похож на ```$in```: он также определяет массив возможных выражений, но требует, чтобы документы имели весь определяемый набор выражений. 
```js
db.cats.find ({"characteristics": {$all : ["гадит в лоток", "дает себя гладить"]}})
```

#### Оператор ```$size```
Оператор ```$size``` используется для нахождения документов, в которых массивы имеют число элементов, равным значению ```$size```. 
```js
db.cats.find({"characteristics": {$size:3}})
```
#### Оператор ```$exists```
Оператор $exists используется для проверки наличия или отсутствия поля. Оператор ```$exists``` позволяет извлечь только те документы, в которых определенный ключ присутствует или отсутствует. 
```js
db.cats.find({owners: {$exists:true}})
```
#### Оператор ```$type```
Оператор ```$type``` извлекает только те документы, в которых определенный ключ имеет значение определенного типа, например, строку или число
```js
db.cats.find({age: {$type:"number"}})
```

#### Оператор ```$regex```
Оператор ```$regex``` задает регулярное выражение, которому должно соответствовать значение поля.
```js 
db.cats.find({name: {$regex:"L"}})
```

#### Оператор ```$or```
Оператор $or используется как ИЛИ
```js
db.cats.find({$or: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
```
#### Оператор ```$and```
```js
db.cats.find({$and: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
```

####Оператор $where
Самый гибкий оператор — $where, позволяющий нам передавать JavaScript для его выполнения на сервере.

### Метод save
В этот документ в качестве поля можно передать параметр ```_id```. Если метод находит документ с таким значением ```_id```, то документ обновляется. Если же с подобным ```_id``` нет документов, то документ вставляется.
```js
db.cats.save({"_id": ObjectId("5a571b186a51cf10a4383303"), name: "Bars", age: 3})
```
### Метод update
Более детальную настройку при обновлении предлагает функция update. Она принимает три параметра:

1. ```query```: принимает запрос на выборку документа, который надо обновить
2. ```objNew```: представляет документ с новой информацией, который заместит старый при обновлении

3. ```options```: определяет дополнительные параметры при обновлении документов. Может принимать два аргумента: ```upsert``` и ```multi```.

Если параметр ```upsert``` имеет значение true, что mongodb будет обновлять документ, если он найден, и создавать новый, если такого документа нет. Если же он имеет значение false, то mongodb не будет создавать новый документ, если запрос на выборку не найдет ни одного документа.

Параметр ```multi``` указывает, должен ли обновляться первый элемент в выборке (используется по умолчанию, если данный параметр не указан) или же должны обновляться все документы в выборке.
```js
db.cats.update({name : "Bars"}, {name: "Tom", age : 5}, {upsert: true})
```
оператор ```$set``` - если документ не содержит обновляемое поле, то оно создается
```js
db.cats.update({name : "Tom"}, {$set: {characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}})
```
Указав значение ```multi:true```, мы можем обновить все документы выборки
```js
{multi:true}
```
Для удаления отдельного ключа используется оператор ```$unset```:
```js
db.cats.update({name : "Tom"}, {$unset: {age: 1}})
```

### Метод updateOne и updateMany
Метод ```updateOne``` похож на метод ```update``` за тем исключением, что он обновляет только один документ.
Если необходимо обновить все документы, соответствующие некоторому критерию, то применяется метод ```updateMany()```:

### Массивы

#### Оператор ```$push```
```js
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: "вонюч"}})
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: {$each: ["храпит", "злой"]}}})
```

#### Оператор ```$addToSet```
Оператор ```$addToSet``` подобно оператору ```$push``` добавляет объекты в массив. Отличие состоит в том, что ```$addToSet``` добавляет данные, если их еще нет в массиве:
```js
db.cats.update({name : "Lama"}, {$addToSet: {characteristics: "безумен"}})
```
#### Оператор ```$pop``` 
Позволяет удалять элемент из массива:
```js
db.cats.update({name : "Tom"}, {$pop: {characteristics: 1}})
```
> 1 конец массива
> -1 начало массива

#### Оператор ```$pull ```
Удаляет по значению
```js
db.cats.update({name : "Tom"}, {$pull: {characteristics: "серый"}})
```
#### Оператор ```$pullAll```
А если мы хотим удалить не одно значение, а сразу несколько, тогда мы можем:
```js
db.cats.update({name : "Tom"}, {$pullAll: {characteristics: ["не дает себя гладить", "вонюч", "храпит"]}})
```

### Удаление

Для удаления документов в MongoDB предусмотрен метод ```remove```:
```js
db.cats.remove({name : "Tom"})
db.cats.remove({name : "Tom"}, true) - once
db.cats.remove({name : "Tom"}, false) - default multi 
```