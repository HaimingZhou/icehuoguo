import { useEffect, useRef } from 'react'

import * as Three from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function useHanoi<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    // 创建Three.js场景
    const scene = new Three.Scene()

    // 定义汉诺塔台的尺寸
    const tableSize: Record<string, number> = { width: 30, height: 0.5, depth: 10 }
    // 根据tableSize创建立方体几何体
    const geometry = new Three.BoxGeometry(
      ...['width', 'height', 'depth'].map((name) => tableSize[name]),
    )
    // 创建材质
    const material = new Three.MeshLambertMaterial({ color: '#ccccc6' })
    // 创建汉诺塔台的网格模型并添加到场景中
    const table = new Three.Mesh(geometry, material)
    scene.add(table)

    // 获取ref当前元素的尺寸，用于设置相机的视野
    const { width = 0, height = 0 } = ref.current?.getBoundingClientRect?.() ?? {}
    const fov = 45 // 视野角度
    // 根据元素尺寸和视野角度创建相机
    const camera = new Three.PerspectiveCamera(fov, width / height, 1, 500)

    // 创建WebGL渲染器
    const renderer = new Three.WebGLRenderer({ alpha: true, antialias: true }) // antialias 开启抗锯齿
    // 设置渲染器尺寸
    renderer.setSize(width, height)
    // 设置渲染背景色
    renderer.setClearColor('#f8f8f6', 1)

    // 添加轨道控制，用于交互式旋转和缩放场景
    new OrbitControls(camera, renderer.domElement)

    // 添加辅助线和网格帮助物体到场景中，用于更好地可视化
    const axesHelper = new Three.AxesHelper(100)
    const gridHelper = new Three.GridHelper(50, 50)

    scene.add(axesHelper, gridHelper)

    // 设置相机初始位置
    const angle = fov / 2
    const rad = Three.MathUtils.degToRad(angle)
    const distanceZ = tableSize.width / 2 / Math.tan(rad)
    camera.position.set(0, 5, distanceZ)

    const ambientLight = new Three.AmbientLight('#fff', 1) // 环境光
    const directionalLight = new Three.DirectionalLight('#fff', 3) // 方向光
    scene.add(ambientLight, directionalLight)

    const pillarSize = {
      height: 5.4, // 高度
      radius: 0.2, // 半径
    }
    const pillarGeometry = new Three.CylinderGeometry(
      pillarSize.radius,
      pillarSize.radius,
      pillarSize.height,
    )
    const pillarMaterial = new Three.MeshPhongMaterial({ color: '#e6e6e9', emissive: '#889' })
    const pillarB = new Three.Mesh(pillarGeometry, pillarMaterial)

    const y = (pillarSize.height + tableSize.height) / 2
    const unitX = tableSize.width / 2 / 3 // x + 2x = tableSize.width / 2

    pillarB.position.y = y

    const pillarA = pillarB.clone()
    pillarA.position.x = -unitX * 2

    const pillarC = pillarA.clone()
    pillarC.position.x *= -1

    table.add(pillarA, pillarB, pillarC)

    // 清空ref当前元素的内容，准备添加渲染器的DOM元素 这里因为启用了React.StrictMode，所以开发环境需要保证仅插入一次
    if (ref.current) ref.current.innerHTML = ''
    // 将渲染器的DOM元素添加到ref当前元素中
    ref.current?.appendChild?.(renderer.domElement)

    // 动画函数，用于持续渲染场景
    const start = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(start)
    }
    start()
  }, [])

  return ref
}
