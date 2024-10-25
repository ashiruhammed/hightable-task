import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useStore } from 'zustand';
import { cartStore } from '@/pages';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, addItem, updateItem, deleteItem, clearCart } = useStore(
    cartStore,
    (state) => state
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className='space-y-4'>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className='flex items-center space-x-4'>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={50}
                  height={50}
                />
                <div className='flex-1'>
                  <p>{item.title}</p>
                  <p>
                    {item.price}$ x {item.quantity}
                  </p>
                </div>
                <button
                  className='bg-red-500 text-white p-2 rounded'
                  onClick={() => deleteItem(item.id)}>
                  Remove
                </button>
              </div>
            ))
          )}
          {items.length > 0 && (
            <button
              className='bg-red-500 text-white p-2 rounded w-full'
              onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
