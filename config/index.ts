const config = {
  default: {
    systemTitle: 'rspack',
    primaryColor: '#6a1014',
  },
  dev: {
    baseURL: 'https://test.xxx.cn',
  },
  prod: {
    baseURL: 'https://prod.xxx.cn',
  },
};

const exportedConfig = () => {
  if (process.env.BN_ENV === 'prod') {
    return Object.assign({}, config.default, config.prod);
  } else {
    return Object.assign({}, config.default, config.dev);
  }
};

export default exportedConfig();
