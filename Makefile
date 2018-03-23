APP_NAME = cordova
APP_FOLDER = cordova/www

# before build uncomment line with cordova.js in public/index.html

app:
	npm i && npm run build && \
	rm -rf $(APP_FOLDER) && \
	mv build $(APP_FOLDER) && \
	sudo rm -rf cordova/platforms cordova/plugins && \
	cd $(APP_NAME) && cordova prepare
