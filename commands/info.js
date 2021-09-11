const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about someone in this server.')
        .addMentionableOption(option =>
            option.setName('who')
                .setDescription('Show information about someone in this server.')
                .setRequired(false))
        .addStringOption(option => option.setName('assistant')
            .setDescription('Show information about ì v í assistant.')
            .setRequired(false)),
    members: {
        730442930317295667: [// nduc
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit1.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit2.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit3.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit4.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit5.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit6.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit7.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit8.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit9.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit10.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit11.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/nshit12.mp3',
        ],
        603506144069156885: [// hydro
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa1.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa2.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa3.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa4.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa5.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa6.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa7.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa8.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa9.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/papa10.mp3',
        ],
        605260827909554177: [// sieben
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama1.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama2.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama3.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama4.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama5.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama6.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama7.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama8.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama9.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/mama10.mp3',
        ],
        875546521460957255: [// self
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo1.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo2.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo3.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo4.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo5.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/selfinfo6.mp3',
        ],
        846042793730375740 : [// ì v í assistant
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/%C3%AC%20v%20%C3%AD%201.mp3',
            'https://host-chan.s3.ir-thr-at1.arvanstorage.com/%C3%AC%20v%20%C3%AD%202.mp3',
        ],
    },
    async execute(interaction) {
        const iviAssistant = interaction.options.getString('assistant')

        const mention = interaction.options.getMentionable('who')

        if (iviAssistant == null && mention == null) {
            await interaction.reply('info help placeholder')
        }

        else if (iviAssistant != null) {
            await interaction.reply({ files: [choice(this.members[846042793730375740])] })
        }

        else if (mention != null) {
            var mentionId = parseInt(mention.id)
            if (mentionId === 702063196420177981 || mentionId === 832626547357122562) {
                // changing nduc clone id to nduc main id.
                mentionId = 730442930317295667
            }
            if (!Object.keys(this.members).includes(mentionId.toString())) {
                await interaction.reply('Sorry, I don\'t know anything about this person 😥')
                return
            }
            const userFiles = this.members[mentionId]
            await interaction.reply({ files: [choice(userFiles)] })
        }
    }
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// nduc id: 730442930317295667
// hydro id: 603506144069156885
// sieben id: 605260827909554177
// flop id: 870569165310816326
// self id = process.env.CLIENT_ID
// nduc nick 2: 702063196420177981
// nick clone: 832626547357122562
// ì v í (role): 846042793730375740

// nduc: 'https://storage.googleapis.com/host-chan/nduc/nshitbonk.mp3' // easter egg coming soon on next release