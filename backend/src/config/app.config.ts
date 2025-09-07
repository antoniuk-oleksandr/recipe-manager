type AppConfig = {
  port: number;
};

export default (): AppConfig => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
});
