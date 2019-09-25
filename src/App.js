import React from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { AuthRoute } from './pages/login';

export default function App() {
	return (
		<ConfigProvider {...{ locale: zh_CN }}>
			<AuthRoute />
		</ConfigProvider>
	);
}
