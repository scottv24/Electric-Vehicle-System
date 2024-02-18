export default function Card({ children, ...props }) {
  console.log(children)
  return (
    <div className={props.className + ' bg-white shadow-lg '}>{children}</div>
  )
}
