'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import { Menu, Plus, Search, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import useCategoriesHook from '../../utilities/hook/categories.hook';
import { Card } from '@/components/ui/card';
import { createCartStore } from '../../store';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import CartModal from '@/components/cart';
import { useRouter } from 'next/router';

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

export const cartStore = createCartStore();

export default function Home() {
  const { data, isError, isLoading } = useCategoriesHook();
  const { items, addItem, updateItem } = useStore(cartStore, (state) => state);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data?.filter((category: any) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [cartModal, setCartModal] = useState(false);

  const router = useRouter();

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

          <CartModal isOpen={cartModal} onClose={() => setCartModal(false)} />
          <Avatar color='#346D4D'>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Image
        src='/market-image.png'
        alt='Logo'
        width={1420}
        height={1020}
        className='max-w-fit mx-auto px-8'
      />

      <div className='mt-5 px-2'>
        <Input
          placeholder='Search products in your family'
          className='bg-[#FFE7DE] max-w-[800px]'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <p className='text-2xl font-semibold mt-6'>Products</p>
        {isLoading ? (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 animate-pulse'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='p-4'>
                <div className='w-full h-32 bg-gray-300'></div>
                <div className='h-4 bg-gray-300 mt-4'></div>
                <div className='h-4 bg-gray-300 mt-2'></div>
                <div className='h-4 bg-gray-300 mt-2'></div>
                <div className='h-4 bg-gray-300 mt-2'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4'>
            {filteredData?.map((category: any) => {
              const isInCart = items.find((item) => item.id === category.id);

              console.log(isInCart, 'this is the cart', items, category);
              return (
                <Card
                  key={category.id}
                  className='p-4 hover:scale-110 transition-all duration-75'>
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={100}
                    className='min-w-[100px] max-w-[100px] h-[120px] mx-auto'
                    height={40}
                  />
                  <p className='font-bold mt-4 text-sm'>{category.title}</p>
                  <p className='text-ellipsis truncate mt-1 text-xs'>
                    {category.description}
                  </p>
                  <div className='flex mt-6 items-center justify-between'>
                    <p className='font-bold text-sm'>{category.price}$</p>
                    <button
                      className={`bg-[#346D4D] p-2 rounded-full ${
                        isInCart ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (!isInCart) {
                          addItem({ ...category, quantity: 1 });
                        }
                      }}>
                      <Plus size={16} color='#fff' />
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => router.push(`/${category.id}`)}
                      className='mt-4 bg-[#346D4D] p-2 rounded-full w-full text-white'>
                      View Product
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
