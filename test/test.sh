
# https://help.ubuntu.com/12.04/serverguide/certificates-and-security.html
openssl genrsa -des3 -out localhost.key 2048 # pass: test

openssl rsa -in localhost.key -out localhost.key.insecure # pass: test

mv localhost.key localhost.key.secure
mv localhost.key.insecure localhost.key

openssl req -new -key localhost.key -out localhost.csr # next next next ...

openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt