import { Button, CascadePicker, Form, Input, NavBar, Skeleton, TextArea, Toast } from 'antd-mobile'
import { omit } from 'lodash'
import React, { type RefObject, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'react-use'
import useSWR from 'swr'

import type { CascadePickerRef } from 'antd-mobile'

import {
  checkTypeMappingCode,
  createTypeMapping,
  queryTypeMapping,
  queryTypeMappingByCode,
  updateTypeMapping,
} from '../../services/apis/typeMapping'
import { getPath, parseTree } from '../../utils/utils.ts'

const ItemEdit: React.FC = () => {
  const [searchParams] = useSearchParams()
  const oriCode = searchParams.get('code')
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const { data } = useSWR('query-type-mapping', queryTypeMapping)

  const options = useMemo(() => {
    return parseTree(
      data?.data ?? [],
      (item) => item.code,
      (item) => item.parentCode,
      (item) => ({ label: item.name, value: item.code }),
    ) as unknown as { label: string; value: string }[]
  }, [data])

  const [submitLoading, setSubmitLoading] = useBoolean(false)

  useEffect(() => {
    if (oriCode) form.setFieldValue('code', oriCode)
    if (!oriCode) {
      form.resetFields()
    }
  }, [oriCode, form])

  const { data: detailData, isLoading: detailLoading } = useSWR(
    `query-type-mapping-by-code-${oriCode}`,
    () => {
      if (!oriCode) return
      return queryTypeMappingByCode(oriCode)
    },
    {
      onSuccess: (data) => {
        if (!data) return
        form.setFieldsValue({
          code: data.data.code,
          name: data.data.name,
          level: data.data.level,
          desc: data.data.desc,
        })
      },
    },
  )

  useEffect(() => {
    if (options?.length && detailData?.data?.parentCode) {
      const list = data?.data ?? []
      const path = getPath(
        list,
        (item) => item.code,
        (item) => item.parentCode,
        detailData.data.code,
      )
      form.setFieldValue('parentCode', path?.map((item) => item.code) ?? [])
    }
  }, [detailData?.data?.parentCode, options?.toString()])

  const onFinish = async (values: any) => {
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
    const parentCodeLength = values?.parentCode?.length
    const parentCode = values?.parentCode?.length
      ? values.parentCode[parentCodeLength - 2]
      : undefined
    if (oriCode) {
      await updateTypeMapping({
        ...omit(values, ['parentNames', 'parentCode']),
        parentCode,
        id: detailData?.data?._id as string,
      }).finally(() => {
        setSubmitLoading(false)
      })
    } else {
      await createTypeMapping({
        ...omit(values, ['parentNames', 'parentCode']),
        parentCode,
      }).finally(() => {
        setSubmitLoading(false)
      })
    }
    Toast.show({
      icon: 'success',
      content: '保存成功',
    })
    navigate('/type-mapping/list', { replace: true })
  }

  return (
    <>
      <NavBar onBack={() => navigate('/type-mapping/list', { replace: true })}>
        物品{!oriCode ? '新增' : '编辑'}
      </NavBar>
      {!!oriCode && detailLoading && <Skeleton.Paragraph lineCount={5} animated />}
      {(!oriCode || !detailLoading) && (
        <Form
          layout="horizontal"
          form={form}
          footer={
            <Button block type="submit" loading={submitLoading} color="primary">
              提交
            </Button>
          }
          onFinish={onFinish}
        >
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
          <Form.Item name="level" label="级别" initialValue={1} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="parentCode"
            label="父级"
            trigger="onConfirm"
            disabled={!!oriCode}
            onClick={(_, cascadePickerRef: RefObject<CascadePickerRef>) => {
              cascadePickerRef.current?.open()
            }}
          >
            <CascadePicker options={options}>
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
          <Form.Item name="desc" label="描述" rules={[{ required: true, message: '描述不能为空' }]}>
            <TextArea placeholder="请输入描述" maxLength={100} rows={2} showCount />
          </Form.Item>
        </Form>
      )}
    </>
  )
}

export default ItemEdit
