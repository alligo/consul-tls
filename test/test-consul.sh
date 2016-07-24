
# https://www.consul.io/intro/getting-started/kv.html

curl -X PUT -d 'test' http://localhost:8500/v1/kv/web/key1
#true
curl -X PUT -d 'test' http://localhost:8500/v1/kv/web/key2?flags=42
#true
curl -X PUT -d 'test'  http://localhost:8500/v1/kv/web/sub/key3
#true
curl http://localhost:8500/v1/kv/?recurse
#[{"CreateIndex":97,"ModifyIndex":97,"Key":"web/key1","Flags":0,"Value":"dGVzdA=="},
# {"CreateIndex":98,"ModifyIndex":98,"Key":"web/key2","Flags":42,"Value":"dGVzdA=="},
# {"CreateIndex":99,"ModifyIndex":99,"Key":"web/sub/key3","Flags":0,"Value":"dGVzdA=="}]