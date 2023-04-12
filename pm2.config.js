module.exports = {
    apps: [
        {
            name: 'shop-app',
            script: 'npm',
            args: 'run start',
            watch: true,
            env: {
                PORT: 3000,
            },
        },
    ],
};
