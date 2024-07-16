import { Button, InfiniteScroll, List, NavBar } from 'antd-mobile'
import { AddOutline, EditSOutline } from 'antd-mobile-icons'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized'

import type { CSSProperties } from 'react'

import { queryTypeMapping } from '../../../services/apis/typeMapping'

import type { TypeMapping } from '../../../services/type'

const TypeMappingList: React.FC = () => {
  const navigate = useNavigate()

  // const { data, isLoading } = useSWR('query-type-mapping', queryTypeMapping)
  const [data, setData] = useState<TypeMapping[]>([])

  const [hasMore, setHasMore] = useState(true)
  async function loadMore() {
    const res = await queryTypeMapping()
    setData((val) => [...val, ...(res?.data ?? [])])
    // setHasMore(res?.data?.length > 0)
    setHasMore(false)
  }

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number
    key: string
    style: CSSProperties
  }) => {
    const item = data[index]
    return (
      <List.Item
        key={key}
        style={style}
        // prefix={
        //   <Image
        //     src={item.avatar}
        //     style={{ borderRadius: 20 }}
        //     fit="cover"
        //     width={40}
        //     height={40}
        //   />
        // }
        extra={
          <Button
            color="primary"
            fill="none"
            onClick={() => {
              navigate(`/type-mapping/edit?code=${item?.code}`)
            }}
          >
            <EditSOutline />
          </Button>
        }
        description={item?.desc}
      >
        {item?.name} [{item?.code}]
      </List.Item>
    )
  }

  return (
    <>
      <NavBar
        right={
          <NavLink to="/type-mapping/create">
            <AddOutline style={{ fontSize: 20 }} />
          </NavLink>
        }
      >
        类型列表
      </NavBar>
      <WindowScroller
        onScroll={({ scrollTop }) => {
          console.log('scrollTop', scrollTop)
        }}
      >
        {({ height, scrollTop, isScrolling }) => (
          <List>
            {/*{isLoading && <Skeleton.Paragraph lineCount={5} animated />}*/}
            <AutoSizer disableHeight>
              {({ width }: { width: number }) => (
                <VirtualizedList
                  autoHeight
                  rowCount={data.length ?? 0}
                  rowRenderer={rowRenderer}
                  width={width}
                  height={height}
                  rowHeight={70}
                  overscanRowCount={10}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                />
              )}
            </AutoSizer>
          </List>
        )}
      </WindowScroller>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  )
}

export default TypeMappingList
