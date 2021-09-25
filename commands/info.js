const { SlashCommandBuilder } = require('@discordjs/builders')
const choice = require('../features/choice')
const members_info = require('../info/ivi_members')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about someone in this server.')
        .addMentionableOption(option =>
            option.setName('who')
                .setDescription('Show information about someone in this server.')
                .setRequired(true)),
    members: members_info
    //{
    //     730442930317295667: [// nduc
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit1.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit2.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit3.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit4.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit5.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit6.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit7.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit8.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit9.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit10.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/891251310014398484/nshit11.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit12.mp3',
    //     ],
    //     603506144069156885: [// hydro
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa1.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa2.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa3.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa4.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa5.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa6.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa7.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa8.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa9.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa10.mp3',
    //     ],
    //     605260827909554177: [// sieben
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama1.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama2.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama3.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama4.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama5.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama6.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama7.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama8.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama9.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama10.mp3',
    //     ],
    //     875546521460957255: [// self
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo1.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo2.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo3.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo4.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo5.mp3',
    //         'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo6.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876772965994496/meow.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/890234446224179200/i_v_i_1.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/890234436615012362/i_v_i_2.mp3',
    //     ],
    //     885036466504368128: [// Golden Ramsay
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876472234377226/chef_1.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876473111007293/chef_2.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876475682099260/chef_3.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876473735946280/chef_4.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876485874286592/chef_5.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876486100750386/chef_6.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876486813786212/chef_7.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876489129054258/chef_8.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876490039218216/chef_9.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876522624745532/chef_10.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876724358209576/chef_11.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876517260259348/chef_12.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876527624368158/chef_13.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876532162621480/chef_14.mp3',
    //         'https://cdn.discordapp.com/attachments/889538894905884734/889876466035224626/chef_15.mp3'
    //     ]
    // },
    ,
    async execute(interaction) {
        const mention = interaction.options.getMentionable('who')

        var mentionId = mention.id
        if (mentionId == "702063196420177981" || mentionId == "832626547357122562") {
            // changing nduc clone id to nduc main id.
            mentionId = "730442930317295667"
        }
        if (!Object.keys(this.members).includes(mentionId)) {
            await interaction.reply('Sorry, I don\'t know anything about this person 😥')
            return
        }
        const userFiles = this.members[mentionId]
        await interaction.reply({ files: [choice(userFiles)] })
    }
}

// nduc id: 730442930317295667
// hydro id: 603506144069156885
// sieben id: 605260827909554177
// flop id: 870569165310816326
// self id = process.env.CLIENT_ID
// nduc nick 2: 702063196420177981
// nick clone: 832626547357122562
// ì v í (role): 846042793730375740