import { Image, List, NavBar, SearchBar, Skeleton } from 'antd-mobile'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { queryItems } from '../../services/apis/item'

const ItemList: React.FC = () => {
  const navigate = useNavigate()

  const [searchVal, setSearchVal] = useState<string>()

  const { data, isLoading } = useSWR(`query-items-${searchVal}`, () => queryItems(searchVal))

  return (
    <>
      <NavBar back={null}>物品列表</NavBar>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        <SearchBar
          placeholder="请输入内容"
          style={{ '--background': '#ffffff' }}
          onSearch={(val) => setSearchVal(val)}
          onClear={() => setSearchVal('')}
        />
      </div>
      <List>
        {isLoading && <Skeleton.Paragraph lineCount={5} animated />}
        {data?.data?.map((item) => (
          <List.Item
            key={item.code}
            prefix={
              <div style={{ padding: '4px 0 ' }}>
                <Image src={item.url} style={{ borderRadius: 4 }} fit="cover" height={80} />
              </div>
            }
            title={`No.${item?.code}`}
            extra={`x${1}`}
            onClick={() => navigate(`/item/detail/${item?.code}`)}
          >
            {item?.name}
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default ItemList
