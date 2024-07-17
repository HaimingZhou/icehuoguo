import {
  Button,
  CascadePicker,
  CheckList,
  Form,
  Input,
  List,
  NavBar,
  Popup,
  SearchBar,
  Skeleton,
  Toast,
} from 'antd-mobile'
import { AddCircleOutline, MinusCircleOutline, SmileOutline } from 'antd-mobile-icons'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBoolean } from 'react-use'
import useSWR from 'swr'

import type { CascadePickerRef } from 'antd-mobile'
import type { RefObject } from 'react'

import { createContainer, queryByCode, updateContainer } from '../../services/apis/container'
import { checkTypeMappingCode, queryTypeMapping } from '../../services/apis/typeMapping'
import { getPath, parseTree } from '../../utils/utils.ts'

import { queryItems } from '../../services/apis/item.ts'
import type { ContainerParams } from '../../services/type'

const EditContainer: React.FC = () => {
  const { code: oriCode } = useParams()
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { data: itemDatas } = useSWR('query-items', () => queryItems())

  const [visible, setVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<string[]>()
  const [searchText, setSearchText] = useState<string>('')

  const itemList = useMemo(() => {
    return selected?.map((key) => itemDatas?.data?.find((item) => item._id === key)) ?? []
  }, [itemDatas, selected])
  const filteredItems = useMemo(() => {
    if (searchText) {
      return itemDatas?.data?.filter((item) => item.name.includes(searchText)) ?? []
    } else {
      return itemDatas?.data ?? []
    }
  }, [itemDatas, searchText])

  const { data: typeDatas } = useSWR('query-type-mapping', queryTypeMapping)

  const typeOpts = useMemo(() => {
    return parseTree(
      typeDatas?.data ?? [],
      (item) => item.code,
      (item) => item.parentCode,
      (item) => ({ label: item.name, value: item._id }),
    ) as unknown as { label: string; value: string }[]
  }, [typeDatas])

  const [submitLoading, setSubmitLoading] = useBoolean(false)

  useEffect(() => {
    if (oriCode) form.setFieldValue('code', oriCode)
    if (!oriCode) {
      form.resetFields()
    }
  }, [oriCode, form])

  const { data: detailData, isLoading: detailLoading } = useSWR(
    `query-container-by-code-${oriCode}`,
    () => {
      if (!oriCode) return
      return queryByCode(oriCode)
    },
    {
      onSuccess: (data) => {
        if (!data) return
        const associatedItems = data.data.associatedItems?.map((item) => item._id!) ?? []
        form.setFieldsValue({
          code: data.data.code,
          name: data.data.name,
          url: data.data.url,
          metaData: data.data.metaData,
          associatedItems,
        })
        setSelected(associatedItems)
      },
    },
  )

  useEffect(() => {
    if (typeOpts?.length && detailData?.data?.type?._id) {
      const list = typeDatas?.data ?? []
      const path = getPath(
        list,
        (item) => item._id ?? '',
        (item) => list.find((sub) => sub.code === item.parentCode)?._id ?? '',
        detailData.data.type?._id,
      )

      form.setFieldValue('type', path?.map((item) => item._id) ?? [])
    }
  }, [detailData?.data?.type?._id, typeOpts?.toString()])

  const onFinish = async (values: Omit<ContainerParams, 'type'> & { type: string[] }) => {
    setSubmitLoading(true)
    if (!oriCode) {
      const { data: isDuplicate } = await checkTypeMappingCode(values.code)
      if (isDuplicate) {
        form.setFields([
          {
            name: 'code',
            errors: ['编码重复'],
          },
        ])
        setSubmitLoading(false)
        return
      }
    }
    const types = values?.type?.filter((item) => !!item) ?? []
    const typeLength = types.length
    const type = typeLength ? types[typeLength - 1] : undefined
    if (oriCode) {
      await updateContainer({
        ...values,
        metaData: values.metaData?.filter((item) => Object.keys(item).length) ?? [],
        type,
      }).finally(() => {
        setSubmitLoading(false)
      })
    } else {
      await createContainer({
        ...values,
        metaData: values.metaData?.filter((item) => Object.keys(item).length) ?? [],
        type,
      }).finally(() => {
        setSubmitLoading(false)
      })
    }
    Toast.show({
      icon: 'success',
      content: '保存成功',
    })
    navigate('/container/list', { replace: true })
  }

  return (
    <>
      <NavBar
        style={{ backgroundColor: 'white' }}
        onBack={() => navigate('/container/list', { replace: true })}
      >
        容器{!oriCode ? '新增' : '编辑'}
      </NavBar>
      {!!oriCode && detailLoading && <Skeleton.Paragraph lineCount={5} animated />}
      {(!oriCode || !detailLoading) && (
        <Form
          layout="horizontal"
          form={form}
          mode="card"
          initialValues={{
            metaData: [{}],
          }}
          footer={
            <Button block type="submit" loading={submitLoading} color="primary">
              提交
            </Button>
          }
          onFinish={onFinish}
        >
          <Form.Header>基本信息</Form.Header>
          <Form.Item
            name="code"
            label="编码"
            rules={[{ required: true, message: '编码不能为空' }]}
            disabled={!!oriCode}
          >
            <Input placeholder="请输入编码" clearable />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input placeholder="请输入名称" clearable />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            trigger="onConfirm"
            onClick={(_, cascadePickerRef: RefObject<CascadePickerRef>) => {
              cascadePickerRef.current?.open()
            }}
          >
            <CascadePicker options={typeOpts}>
              {(value) => {
                return (
                  value
                    ?.map((v) => v?.label)
                    ?.filter((item) => !!item)
                    ?.join('/') || '请选择'
                )
              }}
            </CascadePicker>
          </Form.Item>
          <Form.Item name="url" label="URL">
            <Input />
          </Form.Item>
          <Form.Item name="associatedItems" label="物品" hidden>
            <Input />
          </Form.Item>
          <Form.Header>
            物品列表
            <AddCircleOutline onClick={() => setVisible(true)} style={{ float: 'right' }} />
          </Form.Header>
          {!!itemList.length && (
            <List header="">
              {itemList.map((item) => (
                <List.Item
                  prefix={<SmileOutline />}
                  extra={
                    <MinusCircleOutline
                      onClick={() => {
                        const surplus = selected?.filter((sub) => sub !== item?._id)
                        setSelected(surplus)
                        form.setFieldValue('associatedItems', surplus)
                      }}
                    />
                  }
                  key={item?.code}
                >
                  {`${item?.name} [${item?.code}]`}
                </List.Item>
              ))}
            </List>
          )}
          <Form.Array
            name="metaData"
            onAdd={(operation) => operation.add({})}
            renderAdd={() => (
              <span>
                <AddCircleOutline /> 添加
              </span>
            )}
            renderHeader={({ index }, { remove }) => (
              <>
                <span>扩展字段{index + 1}</span>
                <a onClick={() => remove(index)} style={{ float: 'right' }}>
                  删除
                </a>
              </>
            )}
          >
            {(fields) =>
              fields.map(({ index }) => (
                <>
                  <Form.Item name={[index, 'label']} label="label">
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item name={[index, 'value']} label="value">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </>
              ))
            }
          </Form.Array>
        </Form>
      )}
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        destroyOnClose
      >
        <div
          style={{
            padding: 12,
            borderBottom: 'solid 1px var(--adm-color-border)',
          }}
        >
          <SearchBar
            placeholder="输入文字过滤选项"
            value={searchText}
            onChange={(v) => {
              setSearchText(v)
            }}
          />
        </div>
        <div
          style={{
            height: 300,
            overflowY: 'scroll',
          }}
        >
          <CheckList
            defaultValue={selected}
            style={{ marginTop: -1 }}
            onChange={(val) => {
              setSelected(val as string[])
              setVisible(false)
              form.setFieldValue('associatedItems', val)
            }}
          >
            {filteredItems.map((item) => (
              <CheckList.Item key={item.code} value={item._id ?? ''}>
                {item.name}
              </CheckList.Item>
            ))}
          </CheckList>
        </div>
      </Popup>
    </>
  )
}

export default EditContainer
