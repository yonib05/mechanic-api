FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD node start.js
EXPOSE 8080