# Dockerfile para desplegar tu app Flask en Easy Panel

# Usa una imagen ligera de Python
FROM python:3.9-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de la aplicación
COPY . .

# Abre el puerto que usa Flask (o el que hayas configurado en Easy Panel)
EXPOSE 5000

# Variables de entorno de Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Comando de arranque: usa gunicorn para producción
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
