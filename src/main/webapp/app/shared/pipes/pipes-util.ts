export function mapLangToLocale(langKey: string): string {

    const DEFAULT_LOCALE = 'de-CH';

    const langToLocaleMap = {
        'de': 'de-CH',
        'fr': 'fr-CH',
        'it': 'it-CH',
        'en': 'en-GB'
    };

    return langToLocaleMap[langKey] ? langToLocaleMap[langKey] : DEFAULT_LOCALE
};
