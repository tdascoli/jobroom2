FROM openresty/openresty:alpine-fat
RUN  apk update && apk add openssh-client
# cp ~/.ssh/id_rsa .
COPY id_rsa /.ssh/id_rsa
RUN  chown -R nobody:nobody /.ssh && chmod 777 /.ssh && chmod 600 /.ssh/id_rsa
