APP_NAME = cordova
APP_FOLDER = cordova/www

app:
	npm i && npm run build && \
	rm -rf $(APP_FOLDER)
