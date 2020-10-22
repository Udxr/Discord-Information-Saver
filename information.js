const request = require("request");
const r = require("readline-sync");
const setTitle = require("console-title");
const chalk = require("chalk");
const fs = require("fs");
const path = require('path');

const tokens = [...new Set(fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/g, '').split('\n'))];

setTitle(`\u276F Udxrs Information Saver | ${tokens.length} Tokens Loaded! \u276E`)
let timeout = r.question(chalk.redBright("[>] ") + "Timeout: ")
console.clear();

let saved_i = 0;
let token_i = 0;
wipeDir()

let checkInterval = setInterval(function(){
    let token = tokens[token_i++]
    if(token_i >= tokens.length){
        clearInterval(checkInterval)
        console.log(chalk.redBright("[-]") + " Finished saving info " + chalk.redBright("[-]"))
        r.question()
    }
    check(token)
}, timeout)

async function check(token){
    request.get({
        url: 'https://discord.com/api/v6/users/@me',
        json: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        }
    }, (err, body, res) => {
        if(err)return console.log(err)

        if(body.statusCode == 429){
            console.log(chalk.redBright("[-]") + " RATE LIMIT " + chalk.redBright("[-]"))
        }
        else if(body.statusCode == 200){
            let user_id = res.id 
            let username_tag = res.username + "#" + res.discriminator
            let email = res.email
            let verified = res.verified
            let locale = res.locale
            let nsfw = res.nsfw_allowed
            let mfa = res.mfa_enabled
            let phone = res.phone
            let avatarURL = `https://cdn.discordapp.com/avatars/${user_id}/${res.avatar}.webp?size=128`

            saved_i++
            console.log(chalk.greenBright("[-]") + ` Saved information for ${username_tag} ` + chalk.greenBright("[-]"))
            fs.writeFileSync(`./results/${username_tag}.txt`, `ID: ${user_id}\nUsername & tag: ${username_tag}\nEmail: ${email}\nVerified: ${verified}\nLocale: ${locale}\nNSFW: ${nsfw}\nMFA: ${mfa}\nPhone: ${phone}\nAvatar: ${avatarURL}\nToken: ${token}`, function(err){
                if(err)return
            })
        }else{
            console.log(chalk.redBright("[-]") + ` UNKNOWN ` + chalk.redBright("[-]"))
        }
        setTitle(`\u276F Udxrs Information Saver | ${saved_i}/${tokens.length} Saved \u276E`)
    })
}

async function wipeDir(){
    fs.readdir("./results", (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join("./results", file), err => {
                if (err) throw err;
            });
        }
    });
}