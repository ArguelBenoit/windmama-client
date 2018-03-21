APP_NAME = cordova
APP_FOLDER = cordova/www
APP_SRC = src/cordova

app:
	npm i && npm run build && \
	rm -rf $(APP_FOLDER) && \
	mv build $(APP_FOLDER) && \
	rm -f $(APP_FOLDER)/index.html && \
	cp $(APP_SRC)/index.html $(APP_FOLDER)/index.html
