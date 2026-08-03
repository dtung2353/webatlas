# Stage 1: Build ứng dụng React Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copy file định nghĩa package và cài đặt thư viện
COPY package*.json ./
RUN npm ci

# Copy toàn bộ mã nguồn và build dự án
COPY . .
RUN npm run build

# Stage 2: Serve bằng Nginx web server nhẹ
FROM nginx:alpine

# Copy kết quả build vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx tối ưu cho server & reverse proxy MapServer
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
