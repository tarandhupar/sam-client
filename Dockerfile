FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

# Build dist folder
RUN npm run build:prod

EXPOSE 8080
CMD [ "npm", "run", "server:prod" ]
