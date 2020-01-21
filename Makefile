all:
	yarn build-dev
	docker build -t ginkgoch/map-server:latest .