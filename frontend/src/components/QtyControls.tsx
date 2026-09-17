type Props = {
    qty: number
    onAdd: () => void
    onDec: () => void
  }
  
  export default function QtyControls({ qty, onAdd, onDec }: Props) {
    if (qty === 0) {
      return (
        <button type="button" className="qty-add" onClick={onAdd}>
          +
        </button>
      )
    }
  
    return (
      <div className="qty-stepper">
        <button type="button" onClick={onDec}>−</button>
        <span>{qty}</span>
        <button type="button" onClick={onAdd}>+</button>
      </div>
    )
  }