FROM ginkgoch/node-canvas:latest
WORKDIR /root/map-server/
COPY ./dist ./dist
RUN mkdir -p ./db
COPY ./src/data ./src/data
COPY ./package.json ./package.json
RUN npm install --production
EXPOSE 3000

ENTRYPOINT [ "node", "./dist/index.js" ]