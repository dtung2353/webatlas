# ==============================================================================
# Dockerfile: WebAtlas Frontend Application Build & Production Nginx Container
# ==============================================================================
# Stage 1: Build ứng dụng React Vite TypeScript sang static dist
FROM node:20-alpine AS build

WORKDIR /app

# Sao chép file khai báo phụ thuộc và tiến hành cài đặt
COPY package*.json ./
RUN npm ci

# Sao chép mã nguồn MVC và thực thi lệnh biên dịch production
COPY . .
RUN npm run build

# Stage 2: Serve ứng dụng web qua Nginx Web Server hiệu năng cao
FROM nginx:alpine

# Chép kết quả đã build từ Stage 1 vào thư mục root Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Chép file cấu hình Reverse Proxy Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cổng lắng nghe mặc định của ứng dụng
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
