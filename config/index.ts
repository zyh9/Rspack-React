const config = {
  default: {
    systemTitle: 'BANU',
    primaryColor: '#6a1014',
  },
  dev: {
    baseURL: 'https://dev.banu.cn',
  },
  prod: {
    baseURL: 'https://prod.banu.cn',
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
