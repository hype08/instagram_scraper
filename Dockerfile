# install linux 
FROM alpine:edge

# installs Chromium 80 and other neccessary deps.
RUN apk add --no-cache --update \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  npm

# make puppeteer use chromium from /usr/bin instead of node_modules
ENV CHROME_BIN="/usr/bin/chromium-browser" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# create Directory for the Container
WORKDIR /usr/src/app

# copy all other source code to work directory
ADD . /usr/src/app

# install all Packages
RUN npm install 

# compile TypeSecript to JavaScript
RUN npm run build

# "npm install -g will install "instamancer" commmand locally.
RUN npm install -g

CMD [ "npm", "run", "start" ]
