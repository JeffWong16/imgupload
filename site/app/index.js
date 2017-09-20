import React from 'react';

import PicturesWall from './image'
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;




class App extends React.Component {
  render() {
    return (
      <Layout>
      <Header style={{ position: 'fixed', width: '100%',zIndex:99 }}>
        <div style={{fontSize:'18px',color:'#fff'}}>工地帮图床</div>
      </Header>
      <Content style={{ padding: '0 20px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <PicturesWall/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
         ©2017 工地帮
      </Footer>
    </Layout>
    );
  }
}

export default App;