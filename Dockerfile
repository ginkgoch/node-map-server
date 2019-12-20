FROM wemyss/node-canvas

WORKDIR /root/map-server/
COPY ./dist ./dist
COPY ./db ./db
COPY ./src ./src/data
COPY ./package.json ./package.json
RUN npm install
EXPOSE 3000

ENTRYPOINT [ "node", "./dist/index.js" ]