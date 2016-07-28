# Consul TLS manager v1.2.0-alpha
Simple NodeJS script to store TLS certificates and keys to a Consul KV and
restore to disk if modified since last check


```bash
$ ./index.js --help

  Usage: index [options]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -g, --get           Get Value (default)
    -s, --set           Set value
    -S, --sync          Syncronize files
    -u, --url [value]   Consul URL (should include protocol, host and port)
    -f, --fqdn [value]  FQDN of key certificate, without last dot e.g. mydomain.com
    -c, --cert [value]  Path to certificate (e.g. ./folder/mydomain.crt)
    -k, --key [value]   Path to certificate Key (e.g. ./folder/mydomain.key)
    -v, --debug         Enable verbose / debug
```

## Examples

Note: the Consul URL must be valid and working

### Save (test files)

`./index.js --debug --set --url http://localhost:8500 --fqdn=localhost --cert ./test/localhost.crt --key ./test/localhost.key`

### Restore (test files)

`./index.js --debug --get --url http://localhost:8500 --fqdn=localhost --cert ./test/result-localhost.crt --key ./test/result-localhost.key`


### Sync (test files, needs more testing)

`./index.js --debug --sync --url http://localhost:8500 --fqdn=localhost --cert ./test/localhost.crt --key ./test/localhost.key`
