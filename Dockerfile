FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

EXPOSE 8080

CMD git clone -b develop https://csp-github.sam.gov/GSA-IAE/sam-ui-elements.git src/sam-ui-elements
CMD npm run prod
