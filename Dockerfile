FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY admin.html ./
COPY index.html public/index.html
COPY privacidade.html public/privacidade.html
COPY app.jsx public/app.jsx
COPY tweaks-panel.jsx public/tweaks-panel.jsx
COPY assets/ public/assets/

EXPOSE 80

CMD ["node", "server.js"]
