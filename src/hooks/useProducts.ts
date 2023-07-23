import { shopApi } from '@/api';
import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { IProduct } from '../interfaces/products';

const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())
// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())


interface FetchProducts{
    // prevData  : IProduct[];
    allData   : IProduct[];
    error     : boolean;
    nextPage  : number;
}

export const useProducts = (url: string, config: SWRConfiguration = {}) => {

    const [data, setData] = useState<IProduct[]>([]);
    const [error, setError] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false)


    const fetchData = async () => {
        if(noMoreData) return;
        try {
            const { data } = await shopApi<IProduct[]>(`${url}${url.includes('?') ? '&' : '?'}page=${currentPage}&limit=12`);
            setData((prevData) => [...prevData, ...data]);
            if(data.length < 1) return setNoMoreData(true)
            setCurrentPage(currentPage + 1)
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    // const handleScroll = () => {
    //     const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    //     if (scrollHeight - (scrollTop + clientHeight) > 500 && scrollHeight - (scrollTop + clientHeight) < 700 &&!loading) {
    //         setCurrentPage((prevPage) => prevPage + 1); // Incrementar la página actual
    //     }
    // };

    useEffect(() => {
        fetchData();
    }, []);

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);





    return {
        products: data,
        isError: error,
        isLoading: !error && !data,
        noMoreData,
        fetchData
    }
}
