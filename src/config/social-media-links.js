import { i18n } from '@/config/i18n.js';

export function SOCIAL_MEDIA_LINKS() {
    return [
        {
            url: 'https://twitter.com/FantomFDN',
            tooltip: i18n.t('app.socialMediaLinks.fantomOnTwitter'),
            label: i18n.t('app.socialMediaLinks.twitter'),
            icon: 'twitter',
            target: '_blank',
        },
        /*
        {
            url: 'http://chat.fantom.network/',
            tooltip: i18n.t('app.socialMediaLinks.fantomOnDiscord'),
            label: i18n.t('app.socialMediaLinks.discord'),
            icon: 'discord',
            target: '_blank',
        },
*/
        {
            url: 'https://t.me/Fantom_English',
            tooltip: i18n.t('app.socialMediaLinks.fantomOnTelegram'),
            label: i18n.t('app.socialMediaLinks.telegram'),
            icon: 'telegram',
            target: '_blank',
        },
        {
            url: 'https://www.reddit.com/r/FantomFoundation/',
            tooltip: i18n.t('app.socialMediaLinks.fantomOnReddit'),
            label: i18n.t('app.socialMediaLinks.reddit'),
            icon: 'reddit',
            target: '_blank',
        },
        {
            url: 'https://github.com/Fantom-Foundation',
            tooltip: i18n.t('app.socialMediaLinks.fantomOnGithub'),
            label: i18n.t('app.socialMediaLinks.github'),
            icon: 'github',
            target: '_blank',
        },
    ];
}
