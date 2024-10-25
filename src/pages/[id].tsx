import { useRouter } from 'next/router';
import { useGetProduct } from '../../utilities/hook/categories.hook';
import { Menu, Minus, Plus, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import localFont from 'next/font/local';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useStore } from 'zustand';
import { cartStore } from '.';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

function Page() {
  const router = useRouter();

  const { data, isLoading } = useGetProduct(Number(router.query.id));

  const [noOfOrder, setNoOfOrder] = useState(1);

  const { items, addItem, updateItem } = useStore(cartStore, (state) => state);

  const [cartModal, setCartModal] = useState(false);

  return (
    <div
      className={`${geistSans.variable} #414042 ${geistMono.variable} min-h-screen p-8 gap-16  font-[family-name:var(--font-geist-sans)]`}>
      <div className='flex items-center justify-between'>
        <Menu />
        <Image src='/logo.png' alt='Logo' width={72} height={20} />
        <div className='flex gap-8 items-center'>
          <Search />
          <div className='relative'>
            <ShoppingCart onClick={() => setCartModal(true)} />
            <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5  flex items-center justify-center'>
              {items.length}
            </div>
          </div>
          <Avatar color='#346D4D'>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className='animate-pulse'>
            <div className='w-48 h-48 bg-gray-300 mx-auto mt-8'></div>
            <div className='h-6 bg-gray-300 mt-6 mx-auto w-3/4'></div>
            <div className='h-4 bg-gray-300 mt-2 mx-auto w-1/2'></div>
            <div className='h-4 bg-gray-300 mt-2 mx-auto w-1/3'></div>
          </div>
        ) : (
          <div>
            <Image
              src={data?.image}
              alt='Product'
              width={200}
              height={200}
              className='mx-auto mt-8'
            />
            <p className='md:text-2xl text-xl font-semibold mt-6 text-center'>
              {data?.title}
            </p>
            <p className='text-lg text-center mt-2 text-[#346D4D]'>
              {data?.description}
            </p>
            <p className='text-lg text-center mt-2 font-semibold'>
              Starting price at: {data?.price}$
            </p>
            <p className='text-lg mt-6 font-semibold'>Special Request</p>
            <textarea
              placeholder='Enter special request'
              title='Special Request'
              className='w-full h-20 mt-2 p-2 border rounded'
            />
            <div className='flex items-center gap-4 mt-4'>
              <div className='flex items-center bg-[#FFE7DE] py-3 px-3 gap-3 rounded-3xl'>
                <Plus
                  color={'#F54000'}
                  onClick={() => setNoOfOrder(noOfOrder + 1)}
                />
                <p>{noOfOrder}</p>
                <Minus
                  color={'#F54000'}
                  onClick={() => {
                    if (noOfOrder > 1) {
                      setNoOfOrder(noOfOrder - 1);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  if (
                    items.find(
                      (item) => String(item.id) === String(router.query.id)
                    )
                  ) {
                    updateItem(String(router.query.id), {
                      quantity: noOfOrder,
                    });
                  } else {
                    addItem({ ...data, quantity: 1 });
                  }
                }}
                disabled={noOfOrder === 0}
                className='bg-[#346D4D] rounded-3xl font-semibold text-white w-full p-2'>
                Add to cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
