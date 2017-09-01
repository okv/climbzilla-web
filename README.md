
# climbzilla-web

Величайший (после мобильных приложений разумеется) клиент для проекта
[climbzilla](https://vk.com/climbzilla).

Это старый добрый динамический сайт на [Node.js](https://nodejs.org) со
следующим функционалом:

* просмотр списка скалодромов
* просмотр списка трасс на скалодроме
* просмотр конкретной трассы

Онлайн демо версия доступна [здесь](http://climbzillaweb-ncidemo.rhcloud.com), production версия [web.climbzilla.tk](http://web.climbzilla.tk).

[![Build Status](https://travis-ci.org/okv/climbzilla-web.svg?branch=master)](https://travis-ci.org/okv/climbzilla-web)


## Требования

* Node.js >= 6


## Установка и запуск

Устанавливаем пакет, например локально в каталог /var/tmp/climbzilla-web-deploy:

```sh
mkdir /var/tmp/climbzilla-web-deploy &&
cd /var/tmp/climbzilla-web-deploy &&
npm install climbzilla-web
```

Создаем конфиг, например /var/tmp/climbzilla-web-deploy/config.json:

```json
{
	"listen": {
		"host": "127.0.0.1",
		"port": 8080
	},
	"services": {
		"climbzillaApi": {
			"host": "api.climbzilla.tk",
			"port": 80,
			"baseUrl": "http://api.climbzilla.tk"
		}
	}
}
```

Запускаем приложение с кофнигом:

```sh
NODE_CONFIG=/var/tmp/climbzilla-web-deploy/config.json /var/tmp/climbzilla-web-deploy/node_modules/climbzilla-web/bin/www
```

После этого приложение доступно на ```http://127.0.0.1:8080```.

Для запуска приложения в фоне можно использовать любой supervisor для Node.js
приложений, например [forever](https://github.com/foreverjs/forever):

```
npm install forever &&
NODE_CONFIG=/var/tmp/climbzilla-web-deploy/config.json /var/tmp/climbzilla-web-deploy/node_modules/forever/bin/forever start /var/tmp/climbzilla-web-deploy/node_modules/climbzilla-web/bin/www
```

## Лицензия

MIT
