import { useHanoi } from './hooks'

const Hanoi = () => {
  const ref = useHanoi<HTMLDivElement>()

  return <div className="h-screen" ref={ref} />
}

export default Hanoi
