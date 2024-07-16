import { FloatingPanel, Image, List, NavBar, Skeleton } from 'antd-mobile'
import { AppOutline, CalculatorOutline, EnvironmentOutline, KeyOutline } from 'antd-mobile-icons'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { queryByCode } from '../../services/apis/item'

const anchors = [window.innerHeight * 0.4, window.innerHeight * 0.6, window.innerHeight * 0.8]

const ItemDetail: React.FC = () => {
  const navigate = useNavigate()
  const { code } = useParams()

  const { data, isLoading } = useSWR(`query-item-detail-${code}`, () => queryByCode(code))

  return (
    <>
      <NavBar onBack={() => navigate('/item/list', { replace: true })}>物品详情</NavBar>
      {isLoading && <Skeleton.Paragraph lineCount={5} animated />}
      {!isLoading && (
        <>
          <Image src={data?.data?.url} fit="cover" />
          <FloatingPanel anchors={anchors}>
            <List header="基本信息">
              <List.Item prefix={<KeyOutline />} key="code">
                {data?.data?.code}
              </List.Item>
              <List.Item prefix={<AppOutline />} key="name">
                {data?.data?.name}
              </List.Item>
              <List.Item prefix={<EnvironmentOutline />} key="container">
                {data?.data?.relatedContainer?.name}
              </List.Item>
              <List.Item prefix={<CalculatorOutline />} key="count">
                2
              </List.Item>
            </List>
            {/*<List header="扩展信息">*/}
            {/*  {[1, 2, 3].map((item) => (*/}
            {/*    <List.Item prefix={<SmileOutline />} key={item}>*/}
            {/*      {item}*/}
            {/*    </List.Item>*/}
            {/*  ))}*/}
            {/*</List>*/}
          </FloatingPanel>
        </>
      )}
    </>
  )
}

export default ItemDetail
