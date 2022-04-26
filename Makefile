build:
	docker build -t express-ts:latest .

deploy: build
	docker tag qwikpdf-be:latest sayanmohsin/express-ts:latest
	docker push sayanmohsin/express-ts:latest

test: build
	docker run -d -p 3030:3030 express-ts