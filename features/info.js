const members = {
    '875546521460957255': [// self
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo1.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo2.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo3.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo4.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo5.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo6.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876772965994496/meow.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/890234446224179200/i_v_i_1.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/890234436615012362/i_v_i_2.mp3',
    ],
    '885036466504368128': [// Golden Ramsay
        'https://cdn.discordapp.com/attachments/889538894905884734/889876472234377226/chef_1.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876473111007293/chef_2.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876475682099260/chef_3.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876473735946280/chef_4.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876485874286592/chef_5.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876486100750386/chef_6.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876486813786212/chef_7.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876489129054258/chef_8.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876490039218216/chef_9.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876522624745532/chef_10.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876724358209576/chef_11.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876517260259348/chef_12.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876527624368158/chef_13.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876532162621480/chef_14.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/889876466035224626/chef_15.mp3'
    ]
}

function getInfo(who) {
    var userId = null
    if (who === undefined) {
        return undefined
    }
    if (who.startsWith('<@!') && who.endsWith('>')) {
        userId = who.substring(3, who.length - 1)
    }
    else if (who.startsWith('<@') && who.endsWith('>')) {
        userId = who.substring(2, who.length - 1)
    }
    return members[userId] || null
}

module.exports = getInfo;