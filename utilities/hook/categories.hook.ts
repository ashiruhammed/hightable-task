import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCategoriesHook = () => {
  const fetchCategory = axios.get('https://fakestoreapi.com/products');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategory,
  });

  console.log(data);

  return { data: data?.data, isLoading, isError };
};

export const useGetProduct = (id: number) => {
  const fetchProduct = axios.get(`https://fakestoreapi.com/products/${id}`);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct,
  });

  return { data: data?.data, isLoading, isError };
};

export default useCategoriesHook;
