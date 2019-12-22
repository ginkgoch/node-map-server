# Project Template
This is a typescript project template with jest test and debug included.

## Install
Follow few steps below to set your project.

```
git clone https://github.com/ginkgoch/node-ts-template.git [project name]
cd [project name]
yarn

# at this step, the project is setup.
# if you installed vscode, launch it with:
code .
```

Then your project template is ready :)

## Run with Docker

### Launch server
```bash
docker run --name map-server -p 3000:3000 -d ginkgoch/map-server
```

### Launch server with customized mounted data path
```bash
docker run --name map-server -p 3000:3000 -v "/Users/ginkgoch/Downloads/Africa_SHP/:/root/map-server/data/" -d ginkgoch/map-server
```