var path = require("path");
var pkg = require(path.join(__dirname, "./package.json"));
module.exports ={
    "server": {
        "workers": [
            {
                "command": "tap monitor",
                "monitor": "启动monitor成功"
            },
            {
                "command": "wh-cli link mui/crossimage@4.0.0"
            },
            {
                "command": "wh-cli link",
                "options": {
                    "cwd": "./demo"
                }
            },
            {
                "command": "wh-cli server app -v test.tmall.com"
            },
            {
                "command": "tap link"
            },
            {
                "command": "tap assets -p 8000"
            },
            {
                "command": "tap watch"
            }
        ]
    },
    "monitor": {
        "port": 80,
        "proxy_pass": [
            {
                "server_name": "localhost test.tmall.com test.daily.tmall.net",
                "rewrite": [
                    {
                        "rule": /^(.+)$/,
                        "target": "http://127.0.0.1:3000/$1"
                    }
                ]
            },
            {
                "server_name": "g.tbcdn.cn g.assets.daily.taobao.net g.alicdn.com",
                "rewrite": [
                    {
                        "rule": /^(.+)$/,
                        "target": "http://127.0.0.1:8000/$1"
                    }
                ]
            }
        ]
    }
}