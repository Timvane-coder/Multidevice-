/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/
import { mediafiredl } from '@bochilteam/scraper-downloader';
import baileys from "@xyzendev/baileys";
import config from "./core/config/index.js"
import mess from "./core/config/mess.js"
import { appenTextMessage } from "./core/systems/serialize.js";
import * as Func from "./core/systems/functions.js"
import os from "os"
import util from "util"
import chalk from "chalk"
import { read, readFileSync, unwatchFile, watchFile, writeFileSync } from "fs";
import axios from 'axios';
import { fileURLToPath } from "url";
import { exec } from "child_process";
import speed from "performance-now"
import ytdl from 'youtubedl-core';
import { performance } from "perf_hooks";
import { writeExif } from "./core/systems/sticker.js"
import dScrape from "d-scrape";
import { GPT, igdl, Khodam, npmstalk, quote, downloadTrack, searchSpoti, tiktokdl, ttslide, processing, ytmp3, ytmp4, search } from "./core/scapers/index.js"
import { toAudio, toImage } from "./core/systems/converts.js";

const premium = JSON.parse(readFileSync('./core/storage/json/premium.json'));
const antilink = JSON.parse(readFileSync('./core/storage/json/antilink.json'));
const USERS = JSON.parse(readFileSync('./core/storage/json/users.json'));

export default async function message(client, store, m, chatUpdate) {
    try {
        (m.type === 'conversation') ? m.message.conversation : (m.type == 'imageMessage') ? m.message.imageMessage.caption : (m.type == 'videoMessage') ? m.message.videoMessage.caption : (m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.type == 'interactiveResponseMessage') ? appenTextMessage(JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id, chatUpdate, m, client) : (m.type == 'templateButtonReplyMessage') ? appenTextMessage(m.msg.selectedId, chatUpdate, m, client) : (m.type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        let quoted = m.isQuoted ? m.quoted : m
        let Downloaded = async (fileName) => await client.downloadMediaMessage(quoted, fileName)
        let isOwner = JSON.stringify(config.number.owner).includes(m.sender.replace(/\D+/g, "")) || false
        let isPremium = JSON.parse(readFileSync("./core/storage/json/premium.json")).map(v => v.replace(/[^0-9]/g, "")).includes(m.sender.replace(/\D+/g, "")) || isOwner
        let isUsers = USERS.includes(m.sender)
        let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false
        let isAntiLink = antilink.includes(m.from) && m.isGroup

        if (isAntiLink) {
            if (m.body.includes("whatsapp.com") || m.body.includes("wa.me") || m.body.includes("chat.whatsapp")) {
                if (m.isAdmin) return;
                if (m.isCreator) return;
                await client.sendMessage(m.from, { delete: quoted.key })
            }
        }

        if (m.isBot) return;

        if (m.message && !m.isBot) {
            if (!isUsers) {
                USERS.push(m.sender)
                writeFileSync('./core/storage/json/users.json', JSON.stringify(USERS, null, 2))
            }

            console.log(
                `--------------------------------------------------\n` +
                `${chalk.blue("FROM")}: ${chalk.yellow(m.pushName + " => " + m.sender)}\n` +
                `${chalk.blue("IN")}: ${chalk.magenta(m.isGroup ? "👥 Group" : "👤 Private")}\n` +
                `${chalk.blue("MESSAGE")}: ${chalk.green(m.body || m.type)}\n` +
                `${chalk.blue("TYPE")}: ${chalk.cyan(m.type)}\n` +
                `${chalk.blue("TIME")}: ${chalk.red(new Date().toLocaleTimeString())}\n` +
                `--------------------------------------------------\n`
            );
        }

        switch (isCommand ? m.command.toLowerCase() : false) {
            case "owner":
            case "creator":
            case "author": {
                await client.sendContact(m.from, config.number.owner, m)
            }
                break
            case "menu":
            case "allmenu":
            case "help": {
                const menu = await (await import("./core/config/menu.js")).default
                let txt = `Hello ${m.pushName} 👋🏻\n`;
                Object.keys(menu).forEach((category) => {
                    txt += `\n*${category.toUpperCase()}*\n`;
                    menu[category].forEach((item) => {
                        txt += `- ${m.prefix}${item}\n`;
                    });
                });

                await client.sendMessage(m.from, {
                    // document: readFileSync("./LICENSE"),
                    // fileName: 'Zayden AI',
                    // fileLength: await new Date(),
                    // pageCount: await new Date().getFullYear(),
                    caption: txt,
                    mimetype: 'image/jpg',
                    // jpegThumbnail: await client.resize('https://telegra.ph/file/d240be21a98f41a3bbc8c.jpg', 400, 400),
                    contextInfo: {
                        externalAdReply: {
                            title: 'Zayden AI',
                            body: 'Powered By Zayden',
                            thumbnail: readFileSync('./core/storage/image/mine.jpg'),
                            sourceUrl: null,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                        forwardingScore: 10,
                        isForwarded: true,
                        mentionedJid: [m.sender],
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363296201298751@newsletter',
                            serverMessageId: 101,
                            newsletterName: 'Powered By Zayden',
                        }
                    }
                }, {
                    quoted: {
                        key: {
                            participant: '0@s.whatsapp.net',
                            remoteJid: "0@s.whatsapp.net"
                        }, message: {
                            conversation: 'Zayden AI Telah Terverifikasi Oleh WhatsApp'
                        }
                    }
                });
            }
                break

            case 'tqto':
            case 'thanksto':
            case 'thankto':
            case 'terimakasihkepada': {
                const api = ["Muhammad Adriansyah", "Zayden"]
                let txt = "*Terima Kasih Kepada:*\n\n";
                api.map(v => txt += `- ${v}\n`);
                client.reply(m.from, txt, m);
            }
                break

            case 'LICENSE':
            case 'license':
            case 'licensi': {
                client.sendMessage(m.from, {
                    text: `Permission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.`,
                    contextInfo: {
                        externalAdReply: {
                            title: "MIT License",
                            body: 'Copyright (c) 2024 Prince Sumani',
                            thumbnail: readFileSync('./core/storage/image/mine.jpg'),
                            showAdAttribution: true,
                            renderLargerThumbnail: true,
                            mediaType: 1
                        }
                    }
                }, { quoted: m });
            }

                break
            case 'ping':
            case 'botstatus':
            case 'statusbot': {
                const used = process.memoryUsage()
                const cpus = os.cpus().map(cpu => {
                    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
                    return cpu
                })
                const cpu = cpus.reduce((last, cpu, _, { length }) => {
                    last.total += cpu.total
                    last.speed += cpu.speed / length
                    last.times.user += cpu.times.user
                    last.times.nice += cpu.times.nice
                    last.times.sys += cpu.times.sys
                    last.times.idle += cpu.times.idle
                    last.times.irq += cpu.times.irq
                    return last
                }, {
                    speed: 0,
                    total: 0,
                    times: {
                        user: 0,
                        nice: 0,
                        sys: 0,
                        idle: 0,
                        irq: 0
                    }
                })
                let timestamp = speed()
                let latensi = speed() - timestamp
                let neww = performance.now()
                let oldd = performance.now()
                let respon = `
Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${Func.runtime(process.uptime())}

💻 Info Server
RAM: ${Func.formatp(os.totalmem() - os.freemem())} / ${Func.formatp(os.totalmem())}

_NodeJS Memory Usaage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${Func.formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim()
                client.sendMessage(m.from, {
                    text: respon,
                    contextInfo: {
                        externalAdReply: {
                            title: "Information Server",
                            body: 'Powered By Zayden',
                            thumbnail: readFileSync('./core/storage/image/server.jpg'),
                            showAdAttribution: true,
                            renderLargerThumbnail: true,
                            mediaType: 1
                        }
                    }
                }, { quoted: m });
            }
                break

            case 'short':
            case 'shorturl': {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                const res = await (await Func.fetchJson(`https://aemt.me/tinyurl?link=${m.text}`));
                if (res.status === false) return client.reply(m.from, mess.error, m)
                client.reply(m.from, res.result, m)
            }
                break

            case 'get':
            case 'fetch': {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                const res = await axios.request(m.text, {
                    method: 'GET',
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
                    }
                })
                if (!/text|json/.test(res.headers['content-type'])) {
                    if (res.headers['content-length'] > 300 * 1024 * 1024) return m.reply('File terlalu besar')
                    return m.reply(util.format(res.data))
                } else {
                    return m.reply(util.format(res.data))
                }
            }
                break


            case 'ai':
            case 'openai': {
                if (!m.text) return client.reply(m.from, mess.media.prompt, m);
                await GPT(m.text).then((res) => {
                    client.reply(m.from, res, m);
                }).catch((err) => {
                    console.error(err)
                    client.reply(m.from, mess.error, m)
                })
            }
                break
            case "remini":
            case "hdr":
            case "hd":
            case "upscale": {
                client.enhancer = client.enhancer ? client.enhancer : {};
                if (Number(quoted.msg.fileLength.low) > 500000) return m.reply("The file is too large.")
                if (m.sender in client.enhancer) return m.reply("Please wait, there is still something in process")
                if (/image|webp/.test(quoted.msg.mimetype)) {
                    client.enhancer[m.sender] = true
                    try {
                        let media = await Downloaded();
                        let upload = await Func.upload.telegra(media);
                        let res = await Func.getBuffer(upload);
                        let imageData = Buffer.from(res, 'binary');
                        let pros = await processing(imageData, 'enhance');
                        var error;
                        client.sendMessage(m.from, { image: pros, caption: mess.success }, { quoted: m });
                    } catch (err) {
                        console.error(err)
                        client.reply(m.from, mess.error, m)
                        error = true
                        delete client.enhancer[m.sender]
                    } finally {
                        if (error) return m.reply("Error processing the image.");
                        delete client.enhancer[m.sender]
                    }
                } else {
                    client.reply(m.from, mess.media.image, m)
                }
            }
                break
            case 'whatmusic': {
                if (!quoted.isMedia) return client.reply(m.from, mess.media.audio, m);
                const media = await Downloaded();
                const post = await Func.upload.pomf(media);
                const { result } = await Func.fetchJson(`https://aemt.me/whatmusic?url=${post}`);
                if (!result) return client.reply(m.from, mess.error, m);
                if (result.includes('undefined')) return client.reply(m.from, mess.notfound, m);
                client.reply(m.from, result, m)
            }
                break


            // Pinterest Command
            case 'pin':
            case 'pinterest': {
                if (!m.text) return client.reply(m.from, mess.media.query, m);
                const [query, countStr] = m.text.split("|");
                const rules = JSON.parse(readFileSync('./core/storage/json/pinterest.json'));
                if (rules.some(rule => m.text.includes(rule))) return client.reply(m.from, mess.notAllow, m);
                let count = countStr ? parseInt(countStr) : 1;
                if (!query) return client.reply(m.from, mess.media.query, m);
                if (count > 10) return client.reply(m.from, 'Max 5', m);

                try {
                    const res = await dScrape.search.pinterest(query);
                    if (!res || res.length === 0) return client.reply(m.from, mess.notfound, m);
                    const jmlh = []
                    for (let i = 0; i < count; i++) {
                        const pick = Func.pickRandom(res)
                        jmlh.push(pick)
                    }
                    if (jmlh.length === 1) {
                        await client.sendImage(m.from, jmlh[0], query, m)
                    } else {
                        await client.sendCard(m.from, `Pinterest: ${query.toUpperCase()}`, jmlh)
                    }
                } catch (error) {
                    console.error(error);
                    return client.reply(m.from, mess.error, m);
                }
            }
                break;

            case 'addrulespin':
            case 'addpinrule': {
                if (!m.text) return client.reply(m.from, 'Enter Rules', m)
                const rules = JSON.parse(readFileSync('./core/storage/json/pinterest.json'))
                if (rules.includes(m.text)) return client.reply(m.from, 'Rules already exist', m);
                rules.push(m.text)
                writeFileSync('./core/storage/json/pinterest.json', JSON.stringify(rules))
                client.reply(m.from, 'Rules Added', m)
            }
                break

            case 'delrulespin':
            case 'delpinrule': {
                if (!m.text) return client.reply(m.from, 'Enter Rules', m)
                const rules = JSON.parse(readFileSync('./core/storage/json/pinterest.json'))
                if (!rules.includes(m.text)) return client.reply(m.from, 'There are no rules', m);
                rules.splice(rules.indexOf(m.text), 1)
                writeFileSync('./core/storage/json/pinterest.json', JSON.stringify(rules))
                client.reply(m.from, 'Rules Removed', m)
            }
                break

            // Instagram Command
            case 'igdl':
            case 'instagram':
            case 'ig': {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                if (!/instagram.com/.test(m.text)) return client.reply(m.from, 'Invalid URL', m)
                await igdl(m.text).then(async (res) => {
                    if (res.length === 0) return client.reply(m.from, 'Instagram Tidak Ditemukan', m)
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].includes("https://scontent.cdninstagram.com")) {
                            await client.sendImage(m.from, res[i], '', m)
                        } else {
                            await client.sendVideo(m.from, res[i], '', m)
                        }
                    }
                }).catch(() => client.reply(m.from, 'Instagram Tidak Ditemukan', m))
            }
                break
            case 'igstory':
            case 'igstalker': {
                if (!m.text) return client.reply(m.from, 'Send Nickname Instagram', m)
                await dScrape.downloader.igStory('https://www.instagram.com/stories/' + m.text).then(async (res) => {
                    if (res.length === 0) return client.reply(m.from, 'Story Tidak Ditemukan Atau Username Tidak Valid', m)
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].url.includes("https://scontent.cdninstagram.com")) {
                            await client.sendImage(m.from, res[i].url, '', m)
                        } else {
                            await client.sendVideo(m.from, res[i].url, '', m)
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                    client.reply(m.from, mess.error, m)
                });
            }
                break
            case 'play':
            case 'mf': {
                if (!m.text) return client.reply(m.from, mess.media.url, m);
                if (!/mediafire.com/i.test(m.text)) return client.reply(m.from, 'Invalid URL', m);
                const res = await mediafiredl(m.text);
                const size = 0
                if (size > 150) return client.reply(m.from, 'File too large', m)
                await client.sendMessage(m.from, {
                    video: {
                        url: res.url,
                        mimetype: "video/mp4",
                        caption: `*Size:* ${res.size}\n*Download:* ${res.url}`
                    }
                })
            }
                break

            // Tiktok Commands
            case "tiktok": {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                await client.sendList(m.from, '*Tiktok Downloader*', 'Powered By Adrian', { title: 'Click Me :)', sections: [{ title: "Pilih Salah Satunya", highlight_label: 'Rekomendasi', rows: [{ title: "Video Tiktok", decoreion: "Download Video Tiktok", id: '.tiktokdl ' + m.text }, { title: "Audio Tiktok", decoreion: "Download Audio Tiktok", id: '.tiktokaudiodl ' + m.text }] }] })
            }
                break

            case 'tiktokdl':
            case 'ttdl':
            case 'tt': {
                if (!m.text) return client.reply(m.from, mess.media.url, m);
                if (!m.text.includes('tiktok.com')) return client.reply(m.from, 'Invalid Tiktok URL', m)
                await tiktokdl(m.text).then(async (res) => {
                    if (res.status === false) return client.reply(m.from, 'Video Not Found', m);
                    await client.sendMessage(m.from, { video: { url: res.server1.url }, caption: res.caption }, { quoted: m });
                }).catch(() => client.reply(m.from, 'Video Not Found', m));
            }
                break;

            case 'tiktokaudiodl':
            case 'tiktokmusic': {
                if (!m.text) return client.reply(m.from, mess.media.url, m);
                if (!m.text.includes('tiktok.com')) return client.reply(m.from, 'Invalid Tiktok URL', m)
                const { audio } = await dScrape.downloader.tiktok(m.text)
                if (!audio) return client.reply(m.from, 'Music Not Found', m);
                await client.sendMessage(m.from, { audio: { url: audio }, mimeType: 'audio/mp4' }, { quoted: m });
            }
                break

            // Spotify Command
            case "spotify": {
                if (!m.text) return client.reply(m.from, mess.media.query, m)
                let res = await searchSpoti(m.text)
                if (res.length === 0) return client.reply(m.from, 'Not Found', m)
                await client.sendList(m.from, 'Spotify Search', 'Powered By Adrian', {
                    title: 'Click Me :)',
                    sections: [
                        {
                            title: 'Result',
                            highlight_label: "Best Result",
                            rows: res.map(a => ({
                                title: a.name.toUpperCase(),
                                decoreion: a.artist.toUpperCase(),
                                id: '.spotifydl ' + a.url
                            }))
                        }]
                })
            }
                break

            case "spotifydl": {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                const res = await downloadTrack(m.text);
                await client.sendMessage(m.from, { audio: res, mimetype: 'audio/mp4' }, { quoted: m });
            }
                break

            // Youtube Command
            case "play":
            case "ytplay": {
                if (!m.text) return client.reply(m.from, mess.media.prompt, m)
                let res = await search(m.text)
                if (res.length === 0) return client.reply(m.from, mess.notfound, m)
                client.sendList(m.from, "Result", "Powered By Adrian", {
                    title: 'Click Me :)',
                    sections: [{
                        title: "Hasil Pencarian",
                        highlight_label: "Best Result",
                        rows: res.map(a => ({
                            title: a.title.toUpperCase(),
                            description: a.description.toUpperCase(),
                            id: `.ytdl ${a.url}`
                        }))
                    }]
                })
            }
                break

            case "ytdl":
            case "yt":
            case "youtube": {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                let img = (await ytdl.getInfo(m.text)).videoDetails.thumbnails[4].url
                const { title, description } = (await ytdl.getBasicInfo(m.text)).videoDetails
                const text = `*${title.toUpperCase()}*\n\n${description}`
                client.sendListWithImage(m.from, text, "Powered By Adrian", { title: 'Click Me :)', sections: [{ title: "Pilih Format", rows: [{ title: "MP3", decoreion: "Download lagu dalam format MP3", id: `.ytmp3 ${m.text}` }, { title: "MP4", decoreion: "Download video dalam format MP4", id: `.ytmp4 ${m.text}` }] }] }, img, { contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363182916458068@newsletter", newsletterName: 'Powered By Adrian', serverMessageId: -1 }, } })
            }
                break

            case "ytmp3": {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                let res = await ytmp3(client, m, m.text)
                client.reply(m.from, config.mess.wait, m)
                if (res instanceof Error) return m.reply("Error: " + res.message)
            }
                break

            case "ytmp4": {
                if (!m.text) return client.reply(m.from, mess.media.url, m)
                let res = await ytmp4(client, m, m.text)
                client.reply(m.from, config.mess.wait, m)
                if (res instanceof Error) return m.reply("Error: " + res.message)
            }
                break


            // Anti-Link
            case "antilink": {
                if (!m.isGroup) return client.reply(m.from, mess.group, m);
                if (!m.isAdmin) return client.reply(m.from, mess.admin, m);
                if (!m.isBotAdmin) return client.reply(m.from, mess.botAdmin, m);
                if (!m.text) return client.reply(m.from, "Please enter the command.", m);
                if (!m.text.startsWith("on") && !m.text.startsWith("off")) return client.reply(m.from, "Please enter on or off.", m);
                if (m.text === "on") {
                    if (antilink.includes(m.from)) return client.reply(m.from, "Anti-link has been activated in this group.", m);
                    antilink.push(m.from);
                    writeFileSync("./core/storage/json/antilink.json", JSON.stringify(antilink));
                    client.reply(m.from, "Successfully activated anti-link in this group.", m);
                } else if (m.text === "off") {
                    if (!antilink.includes(m.from)) return m.reply("Anti-link has been disabled in this group.");
                    antilink.splice(antilink.indexOf(m.from), 1);
                    writeFileSync("./core/storage/json/antilink.json", JSON.stringify(antilink));
                    client.reply(m.from, "Successfully deactivated anti-link in this group.", m);
                }
            }
                break
            case "hidetag": {
                if (!m.isGroup) return client.reply(m.from, mess.group, m);
                if (!m.isAdmin && !m.isCreator) return client.reply(m.from, mess.admin, m);
                if (!m.isBotAdmin) return client.reply(m.from, mess.botAdmin, m);
                if (!m.text) return client.reply(m.from, "Please enter the message.", m);
                if (quoted.isMedia) {
                    await m.reply({ forward: quoted, force: true, mentions: m.metadata.participants.map(a => a.id) })
                } else {
                    await client.sendMessage(m.from, { text: m.text ? m.text : "", mentions: m.metadata.participants.map(a => a.id) }, { quoted: m })
                }
            }
                break
            case 'kick':
            case 'remove': {
                if (!m.isGroup) return client.reply(m.from, mess.group, m);
                if (!m.isAdmin) return client.reply(m.from, mess.admin, m);
                if (!m.isBotAdmin) return client.reply(m.from, mess.botAdmin, m);
                const users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                if (m.sender === users) return client.reply(m.from, 'You can\'t kick yourself', m)
                if (!users) return client.reply(m.from, 'Please tag the person you want to kick', m)
                await client.groupParticipantsUpdate(m.from, [users], 'remove').then(() => {
                    client.reply(m.from, 'Success kick member', m)
                }).catch(() => {
                    client.reply(m.from, 'Failed to kick member', m)
                })
            }
                break
            case 'add':
            case 'invite': {
                if (!m.isGroup) return client.reply(m.from, mess.group, m);
                if (!m.isAdmin) return client.reply(m.from, mess.admin, m);
                if (!m.isBotAdmin) return client.reply(m.from, mess.botAdmin, m);
                const users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                if (!users) return client.reply(m.from, 'Please tag the person you want to add', m)
                await client.groupParticipantsUpdate(m.from, [users], 'add').then(() => {
                    client.reply(m.from, 'Success add member', m)
                }).catch(() => {
                    client.reply(m.from, 'Failed to add member', m)
                })
            }
                break


            case "rvo":
            case 'readviewonce': {
                if (!quoted.msg.viewOnce) return client.reply(m.from, 'Reply to a message with .rvo', m)
                quoted.msg.viewOnce = false
                await m.reply({ forward: quoted, force: true })
            }
                break
            case "delete":
            case "del": {
                if (quoted.fromMe) {
                    await client.sendMessage(m.from, { delete: quoted.key })
                } else {
                    if (!m.isBotAdmin) return client.reply(m.from, mess.botAdmin, m)
                    if (!m.isAdmin) return client.reply(m.from, mess.admin, m)
                    await client.sendMessage(m.from, { delete: quoted.key })
                }
            }
                break
            case "tourl": {
                if (!quoted.isMedia) return client.reply(m.from, mess.media.default, m)
                if (Number(quoted.msg.fileLength) > 10000000) return m.reply("The file is too large.")
                let media = await Downloaded();
                let url = (/video|image|webp/.test(quoted.msg.mimetype)) ? await Func.upload.telegra(media) : await Func.upload.pomf(media);
                await m.reply(url)
            }
                break
            case "qoute":
            case "quotely":
            case "qc":
            case "fakechat": {
                const avatar = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg');
                if (!m.text) return client.reply(m.from, 'Please enter the message.', m)
                const res = await quote(m.text, avatar, m.pushName)
                let sticker = await writeExif({ mimetype: 'image/png', data: await Buffer.from(res.result.image, 'base64') }, { packName: config.settings.packName, packPublish: config.settings.packPublish });
                await m.reply({ sticker })
            }
                break;
            case 'ttp':
            case 'attp': {
                if (!m.text) return client.reply(m.from, 'Please enter the text.', m)
                const buffer = await Func.fetchBuffer(`https://aemt.me/${m.command}?text=${encodeURIComponent(m.text)}`)
                let sticker = await writeExif(buffer, { packName: config.settings.packName, packPublish: config.settings.packPublish })
                await m.reply({ sticker });
            }
                break
            case 's':
            case 'sticker':
            case 'swm':
            case 'imgtosticker': {
                if (!quoted.isMedia) return client.reply(m.from, mess.media.image, m)
                let media = await Downloaded();
                let exif;
                if (m.text) {
                    let [packname, author] = m.text.split(/[,|\-+&]/);
                    exif = { packName: packname ? packname : '', packPublish: author ? author : '' };
                } else {
                    exif = { packName: config.settings.packName, packPublish: config.settings.packPublish };
                }
                let sticker = await writeExif({ mimetype: quoted.msg.mimetype, data: media }, exif);
                await m.reply({ sticker });
            }
                break
            case 'tomp3':
            case 'toaudio': {
                if (!quoted.isMedia) return client.reply(m.from, mess.media.default, m);
                let media = await Downloaded();
                await client.reply(m.from, config.mess.wait, m)
                await toAudio(media).then(async (res) => {
                    await client.sendMessage(m.from, { audio: res.data, mimetype: 'audio/mp4' }, { quoted: m });
                }).catch((err) => {
                    console.error(err)
                    client.reply(m.from, mess.error, m)
                })
            }
                break
            case 'toimg':
            case 'toimage': {
                if (!quoted.isMedia) return client.reply(m.from, mess.media.default, m)
                let media = await Downloaded();
                await toImage(media).then(async (res) => {
                    await client.sendMessage(m.from, { image: res.data, mimetype: 'image/jpeg' }, { quoted: m });
                }).catch((err) => {
                    console.error(err)
                    client.reply(m.from, mess.error, m)
                })
            }
                break
            case 'listonline':
            case 'here': {
                if (!m.isGroup) return client.reply(m.from, mess.group, m)
                if (!m.isAdmin) return client.reply(m.from, mess.admin, m)
                let id = m.args && /\d+\-\d+@g.us/.test(m.args[0]) ? m.args[0] : m.from
                let online = [...Object.keys(store.presences[id]), m.botNumber]
                let liston = 1
                let txt = `*List Online Members*\n\n`
                for (let user of online) {
                    txt += `${liston++}. ${user.replace(/@.+/, '')}\n`
                }
                await client.reply(m.from, txt, m)
            }
                break
            case 'khodam':
            case 'cekkhodam': {
                if (!m.text) return client.reply(m.from, 'Please enter the name.', m)
                const res = await Khodam(m.text);
                let txt = `*Nama:* ${res.nama}\n`
                txt += `*Nama Khodam:* ${res.khodam}`
                await client.reply(m.from, txt, m)
            }
                break
            case 'setppbot':
            case 'setpp': {
                if (!isOwner) return client.reply(m.from, mess.owner, m);
                if (!quoted.isMedia) return client.reply(m.from, mess.media.image, m)
                let a = await Downloaded();
                let media = await writeFileSync(`./temp/${new Date().getTime()}.png`, a)
                if (m.args[0] === 'full') {
                    var { img } = await Func.generateProfilePicture(media)
                    await client.query({
                        ttag: 'iq',
                        attrs: {
                            to: m.botNumber,
                            type: 'set',
                            xmlns: 'w:profile:picture'
                        },
                        content: [
                            {
                                tag: 'picture',
                                attrs: { type: 'image' },
                                content: img
                            }
                        ]
                    })
                    client.reply(m.from, 'Success change profile picture', m)
                } else {
                    await client.updateProfilePicture(m.botNumber, { url: media })
                    client.reply(m.from, 'Success change profile picture', m)
                }
            }
                break
            case 'addprem':
            case 'addpremium': {
                if (!isOwner) return client.reply(m.from, mess.owner, m);
                if (!m.text) return client.reply(m.from, 'Please enter the number.', m)
                if (premium.includes(m.args[0])) return client.reply(m.from, 'User already premium', m)
                await premium.push(m.args[0]);
                await writeFileSync('./core/storage/json/premium.json', JSON.stringify(premium))
                client.reply(m.from, 'Success add premium', m)
            }
                break
            case 'delprem':
            case 'delpremium':
            case 'removeprem': {
                if (!isOwner) return client.reply(m.from, mess.owner, m);
                if (!m.text) return client.reply(m.from, 'Please enter the number.', m)
                if (!premium.includes(m.args[0])) return client.reply(m.from, 'User not premium', m)
                await premium.splice(premium.indexOf(m.args[0]), 1);
                await writeFileSync('./core/storage/json/premium.json', JSON.stringify(premium))
                client.reply(m.from, 'Success delete premium', m)
            }
                break
            case 'listprem':
            case 'listpremium': {
                if (!isOwner) return client.reply(m.from, mess.owner, m);
                let list = 1
                let txt = `*List Premium Members*\n\n`
                for (let user of premium) {
                    txt += `${list++}. ${user.replace(/@.+/, '')}\n`
                }
                await client.reply(m.from, txt, m)
            }
                break
            case 'zayden': {
                if (!quoted) return client.reply(m.from, 'Reply to the message.', m);
                await client.reply(m.from, JSON.stringify(store.messages[m.from].array.find(v => v.key.id === quoted.key.id), null, 2), m)
            }
                break
            default:
                if (['>', 'eval', '=>'].some(a => m.command.toLowerCase().startsWith(a)) && isOwner) {
                    let evalCmd = '';
                    try {
                        evalCmd = /await/i.test(m.text) ? eval('(async() => { ' + m.text + ' })()') : eval(m.text);
                    } catch (e) {
                        evalCmd = e;
                    }
                    new Promise((resolve, reject) => {
                        try {
                            resolve(evalCmd);
                        } catch (err) {
                            reject(err);
                        }
                    })
                        ?.then(res => m.reply(util.format(res)))
                        ?.catch(err => m.reply(util.format(err)));
                }
                if (['$', 'exec'].some(a => m.command.toLowerCase().startsWith(a)) && isOwner) {
                    try {
                        exec(m.text, async (err, stdout) => {
                            if (err) return m.reply(util.format(err));
                            if (stdout) return m.reply(util.format(stdout));
                        });
                    } catch (e) {
                        await m.reply(util.format(e));
                    }
                }
        }
    } catch (e) {
        console.log(e);
    }
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})
