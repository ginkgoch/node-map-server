FROM node:13.5

WORKDIR /root/map-server/
COPY ./dist ./dist
COPY ./db ./db
COPY ./src/data ./src/data
COPY ./package.json ./package.json
RUN npm install --production
EXPOSE 3000

ENTRYPOINT [ "node", "./dist/index.js" ]