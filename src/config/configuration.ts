export default () => ({
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    secret: process.env.SECRET,
})