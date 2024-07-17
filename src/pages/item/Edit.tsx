import { Button, CascadePicker, Form, Input, NavBar, Picker, Skeleton, Toast } from 'antd-mobile'
import { AddCircleOutline } from 'antd-mobile-icons'
import React, { type RefObject, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBoolean } from 'react-use'
import useSWR from 'swr'

import type { CascadePickerRef } from 'antd-mobile'

import { queryContainers } from '../../services/apis/container'
import { createItem, queryByCode, updateItem } from '../../services/apis/item'
import { checkTypeMappingCode, queryTypeMapping } from '../../services/apis/typeMapping'
import { getPath, parseTree } from '../../utils/utils.ts'

import type { ItemParams } from '../../services/type'

const EditItem: React.FC = () => {
  const { code: oriCode } = useParams()
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { data: typeDatas } = useSWR('query-type-mapping', queryTypeMapping)
  const { data: containerDatas } = useSWR('query-containers', () => queryContainers())

  const typeOpts = useMemo(() => {
    return parseTree(
      typeDatas?.data ?? [],
      (item) => item.code,
      (item) => item.parentCode,
      (item) => ({ label: item.name, value: item._id }),
    ) as unknown as { label: string; value: string }[]
  }, [typeDatas])

  const containerOpts = useMemo(() => {
    return (
      containerDatas?.data?.map((item) => ({
        key: item.code,
        label: item.name,
        value: item._id!,
      })) ?? []
    )
  }, [containerDatas])

  const [submitLoading, setSubmitLoading] = useBoolean(false)

  useEffect(() => {
    if (oriCode) form.setFieldValue('code', oriCode)
    if (!oriCode) {
      form.resetFields()
    }
  }, [oriCode, form])

  const { data: detailData, isLoading: detailLoading } = useSWR(
    `query-item-by-code-${oriCode}`,
    () => {
      if (!oriCode) return
      return queryByCode(oriCode)
    },
    {
      onSuccess: (data) => {
        if (!data) return
        form.setFieldsValue({
          code: data.data.code,
          name: data.data.name,
          url: data.data.url,
          metaData: data.data.metaData,
          relatedContainer: data.data?.relatedContainer?._id
            ? [data.data?.relatedContainer?._id]
            : [],
        })
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

  const onFinish = async (values: Omit<ItemParams, 'type'> & { type: string[] }) => {
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
      await updateItem({
        ...values,
        relatedContainer: values.relatedContainer?.[0],
        metaData: values.metaData?.filter((item) => Object.keys(item).length) ?? [],
        type,
      }).finally(() => {
        setSubmitLoading(false)
      })
    } else {
      await createItem({
        ...values,
        relatedContainer: values.relatedContainer?.[0],
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
    navigate('/item/list', { replace: true })
  }

  return (
    <>
      <NavBar
        style={{ backgroundColor: 'white' }}
        onBack={() => navigate('/item/list', { replace: true })}
      >
        物品{!oriCode ? '新增' : '编辑'}
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
          <Form.Item
            name="relatedContainer"
            label="容器"
            trigger="onConfirm"
            onClick={(_, pickerRef: RefObject<CascadePickerRef>) => {
              pickerRef.current?.open()
            }}
          >
            <Picker columns={[containerOpts]}>
              {(value) => {
                return (
                  value
                    ?.map((v) => v?.label)
                    ?.filter((item) => !!item)
                    ?.join(',') || '请选择'
                )
              }}
            </Picker>
          </Form.Item>
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
    </>
  )
}

export default EditItem
