APP_NAME = cordova
APP_FOLDER = cordova/www

app:
	npm i && npm run build && \
	rm -rf $(APP_FOLDER) && \
	mv build $(APP_FOLDER) && \
	cordova prepare
