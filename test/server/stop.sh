#! /bin/bash

echo "Stoping consul Servers and removing images"

docker stop dev-consul dev-consul2 dev-consul3
docker rm dev-consul dev-consul2 dev-consul3
