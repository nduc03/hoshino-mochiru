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
            'https://storage.googleapis.com/host-chan/nduc/nshit1.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit12.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit11.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit2.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit3.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit4.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit5.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit6.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit7.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit8.mp3',
            'https://storage.googleapis.com/host-chan/nduc/nshit9.mp3',
        ],
        603506144069156885: [// hydro
            'https://storage.googleapis.com/host-chan/hydro/papa1.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa10.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa2.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa3.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa4.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa5.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa6.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa7.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa8.mp3',
            'https://storage.googleapis.com/host-chan/hydro/papa9.mp3',
        ],
        605260827909554177: [// sieben
            'https://storage.googleapis.com/host-chan/sieben/mama1.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama10.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama2.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama3.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama4.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama5.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama6.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama7.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama8.mp3',
            'https://storage.googleapis.com/host-chan/sieben/mama9.mp3',
        ],
        875546521460957255: [// self
            'https://storage.googleapis.com/host-chan/self/selfinfo1.mp3',
            'https://storage.googleapis.com/host-chan/self/selfinfo2.mp3',
            'https://storage.googleapis.com/host-chan/self/selfinfo3.mp3',
            'https://storage.googleapis.com/host-chan/self/selfinfo4.mp3',
            'https://storage.googleapis.com/host-chan/self/selfinfo5.mp3',
            'https://storage.googleapis.com/host-chan/self/selfinfo6.mp3',
        ],
        846042793730375740: [// ivi assistant
            'https://storage.googleapis.com/host-chan/i_v_i/i_v_i1.mp3',
            'https://storage.googleapis.com/host-chan/i_v_i/i_v_i2.mp3',
        ],
    },
    async execute(interaction) {
        const iviAssistant = interaction.options.getString('assistant')

        const mention = interaction.options.getMentionable('who')

        if (iviAssistant == null && mention == null) {
            await interaction.reply('info help placeholder')
        }

        else if (iviAssistant != null) {
            await interaction.reply({ files: [choice(this.members[846042793730375700])] })
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