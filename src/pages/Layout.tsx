import { Footer, TabBar } from 'antd-mobile'
import { AppOutline, HeartOutline, ShopbagOutline } from 'antd-mobile-icons'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const tabs = [
  {
    key: 'item',
    title: '物品',
    icon: <AppOutline />,
  },
  {
    key: 'container',
    title: '容器',
    icon: <ShopbagOutline />,
  },
]

const Layout: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Outlet />
      <Footer
        label={
          <div>
            <HeartOutline /> 离涅小窝
          </div>
        }
        style={{ marginBottom: 60, background: 'transparent' }}
      />
      <TabBar
        style={{
          backgroundColor: 'white',
          position: 'fixed',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #eee',
          zIndex: 999,
        }}
        activeKey={location.pathname.split('/')[1]}
        onChange={(key) => navigate(`/${key}/list`)}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} />
        ))}
      </TabBar>
    </>
  )
}

export default Layout
