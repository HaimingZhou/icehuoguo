import { FloatingPanel, Image, List, NavBar, Skeleton } from 'antd-mobile'
import { AppOutline, CalculatorOutline, KeyOutline } from 'antd-mobile-icons'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { queryByCode } from '../../services/apis/container'

const anchors = [window.innerHeight * 0.4, window.innerHeight * 0.6, window.innerHeight * 0.8]

const ContainerDetail: React.FC = () => {
  const navigate = useNavigate()
  const { code } = useParams()

  const { data, isLoading } = useSWR(`query-container-detail-${code}`, () => queryByCode(code))

  return (
    <>
      <NavBar onBack={() => navigate('/container/list', { replace: true })}>容器详情</NavBar>
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
              {/*<List.Item prefix={<EnvironmentOutline />} key="container">*/}
              {/*  {data?.data?.relatedContainer?.name}*/}
              {/*</List.Item>*/}
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

export default ContainerDetail
