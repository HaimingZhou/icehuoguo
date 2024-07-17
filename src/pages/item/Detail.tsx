import { FloatingPanel, Image, List, NavBar, Skeleton } from 'antd-mobile'
import {
  AppOutline,
  EnvironmentOutline,
  KeyOutline,
  LinkOutline,
  PictureOutline,
  SmileOutline,
} from 'antd-mobile-icons'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { queryByCode } from '../../services/apis/item'
import { queryTypeMapping } from '../../services/apis/typeMapping.ts'
import { getPath } from '../../utils/utils.ts'

const anchors = [window.innerHeight * 0.4, window.innerHeight * 0.6, window.innerHeight * 0.8]

const ItemDetail: React.FC = () => {
  const navigate = useNavigate()
  const { code } = useParams()

  const { data: typeDatas } = useSWR('query-type-mapping', queryTypeMapping)
  const { data, isLoading } = useSWR(`query-item-detail-${code}`, () => queryByCode(code))

  const typeName = useMemo(() => {
    const list = typeDatas?.data ?? []
    const path = getPath(
      list,
      (item) => item._id ?? '',
      (item) => list.find((sub) => sub.code === item.parentCode)?._id ?? '',
      data?.data?.type?._id,
    )
    return path.map((item) => item.name).join('/')
  }, [data, typeDatas])

  return (
    <>
      <NavBar style={{ backgroundColor: 'white' }} onBack={() => navigate(-1, { replace: true })}>
        物品详情
      </NavBar>
      {isLoading && <Skeleton.Paragraph lineCount={5} animated />}
      {!isLoading && (
        <>
          <Image src={data?.data?.previewUrl} fit="cover" />
          <FloatingPanel anchors={anchors}>
            <List header="基本信息">
              <List.Item prefix={<KeyOutline />} key="code">
                {data?.data?.code}
              </List.Item>
              <List.Item prefix={<AppOutline />} key="name">
                {data?.data?.name}
              </List.Item>
              <List.Item prefix={<LinkOutline />} key="type">
                {typeName}
              </List.Item>
              <List.Item prefix={<PictureOutline />} key="url">
                {data?.data?.url}
              </List.Item>
              <List.Item prefix={<EnvironmentOutline />} key="container">
                {data?.data?.relatedContainer?.name}
              </List.Item>
            </List>
            {!!data?.data?.metaData.length && (
              <List header="扩展信息">
                {data.data.metaData.map((item) => (
                  <List.Item prefix={<SmileOutline />} key={item.label}>
                    {`${item.label}: ${item.value}`}
                  </List.Item>
                ))}
              </List>
            )}
          </FloatingPanel>
        </>
      )}
    </>
  )
}

export default ItemDetail
