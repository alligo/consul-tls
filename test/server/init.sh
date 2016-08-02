#! /bin/bash

echo "Starting consul servers"

docker run -d -p 8500:8500/tcp --name=dev-consul consul agent -ui -dev -client 0.0.0.0
docker run -d --name=dev-consul2 consul agent -dev -join=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' dev-consul) -ui -dev -client 0.0.0.0
docker run -d --name=dev-consul3 consul agent -dev -join=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' dev-consul) -ui -dev -client 0.0.0.0

# Check consul Members
docker exec -t dev-consul consul members

echo "Waiting for Consul start"
sleep 5

# Check Consul Health
curl http://localhost:8500/v1/health/service/consul?pretty

echo "\n"

curl -X PUT -d 'test' http://localhost:8500/v1/kv/web/key1
echo "\n"
curl -X PUT -d 'test' http://localhost:8500/v1/kv/web/key2?flags=42
echo "\n"
curl -X PUT -d 'test'  http://localhost:8500/v1/kv/web/sub/key3
echo "\n"
curl http://localhost:8500/v1/kv/?recurse
