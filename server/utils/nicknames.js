import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export const generateNickname = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: '-',
        length: 2
    });
};
