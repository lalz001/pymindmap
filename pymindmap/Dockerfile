FROM python:2.7-alpine

# Get latest root certificates
RUN apk add --no-cache ca-certificates && update-ca-certificates
ENV PYTHONUNBUFFERED=1 PYTHONHASHSEED=random PYTHONDONTWRITEBYTECODE=1
EXPOSE 5555
WORKDIR /home/code
COPY  requirements.txt .
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
