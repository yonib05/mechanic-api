FROM nginx

RUN mkdir /etc/nginx/stream.d/
COPY ./stream.d/ /etc/nginx/stream.d/
COPY ./conf.d/ /etc/nginx/conf.d/
COPY *.conf /etc/nginx/

EXPOSE 80