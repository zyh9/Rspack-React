import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.less';
import { ConfigProvider, Button, Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import styles from './test.module.less';
// console.log(styles);

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <img src={reactLogo} className="logo react" alt="React logo" />
        <h3 className={styles.title}>Rspack + React + TypeScript</h3>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
        </div>
        <Calendar onPanelChange={onPanelChange} />
      </div>
    </ConfigProvider>
  );
};

export default App;
