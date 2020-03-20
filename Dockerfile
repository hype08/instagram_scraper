FROM alpine:edge

# Installs latest Chromium (80) package.
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

# set env
ENV CHROME_BIN="/usr/bin/chromium-browser" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# Create Directory for the Container
WORKDIR /usr/src/app

# Copy all other source code to work directory
ADD . /usr/src/app

# Install all Packages
RUN npm install 

# Compile TS
RUN npm run build

RUN npm install -g


