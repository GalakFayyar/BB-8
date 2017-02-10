FROM node:7.2

RUN mkdir -p /app
WORKDIR /app

# install dependencies
COPY package.json /app/
RUN npm install

# refresh dependencies, build app and generate archive
CMD sh -cx "npm install && npm run build && tar czf bb8-$(date +%Y%m%d-%H%M%S).tgz -C dist ." 
