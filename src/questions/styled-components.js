export default {
    type: 'confirm',
    name: 'styledComponents',
    message: 'Use styled-components? (http://styled-components.com)',
};

export const execute = async ({ answer, packages }) => {
    packages.push('styled-components');
};