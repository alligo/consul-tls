# Consul TLS manager v0.2.0

Simple NodeJS script to store TLS certificates and keys to a Consul KV and
restore to disk if modified since last check

[![Build Status](https://travis-ci.org/alligo/consul-tls.svg?branch=master)](https://travis-ci.org/alligo/consul-tls)

```bash
$ node index.js operation consulUrl FQDN crtPath keyPath
```

## Examples

Note: the Consul URL must be valid and working

### Save (test files)

`node index.js 'set' 'http://localhost:8500' 'homolog.zimp.me' './test/cert/localhost.crt' './test/cert/localhost.key'`

### Restore (test files)

`node index.js 'get' 'http://localhost:8500' 'homolog.zimp.me' './test/cert/localhost.crt' './test/cert/localhost.key'`

# License

See [MIT](https://alligo.mit-license.org/).
