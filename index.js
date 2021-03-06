#!/usr/bin/env node
var localFile=require('./package.json');
var request = require('request');
var program = require('commander')
program
    .version(localFile.version)
    .allowUnknownOption()
    .description('docker-push')
    .option('-u, --username <username>', 'your username')
    .option('-p, --password <password>', 'your password')
    .option('-ad, --serveraddress <serveraddress>', 'your serveraddress')
    .option('-n, --name <name>', 'your name')
    .option('-url, --url <url>', 'your url')
program.parse(process.argv)
var _auth=JSON.stringify({"username":program.username,"password":program.password,"serverAddress":program.serveraddress});
_auth=new Buffer(_auth);
_auth=_auth.toString('base64');
push();
function push(){
    let star=program.name.indexOf(':');
    let len=program.name.indexOf(':',star+1);
    let name=program.name.substring(0,len);
    var tag=program.name.substring(len+1,program.name.length);
    request({
        url: program.url+'/images/'+name+'/push?tag='+tag,
        method: "POST",
        json: true,
        headers: {
            "X-Registry-Auth": _auth,
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('push success');
            process.exit(0);
        }else{
            console.log('push error');
            process.exit(1);
        }
    }); 
}

