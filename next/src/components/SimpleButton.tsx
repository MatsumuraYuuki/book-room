
type SimpleButtonProps = {
  text: string
  onClick: () => void;
}

export default function SimpleButton(props: SimpleButtonProps) {

  return (
    <button  onClick={props.onClick} className="border border-gray-300 bg-gray-500">
      {props.text}
    </button>
  )
}