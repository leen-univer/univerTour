import { useIsMounted } from "hooks";
import moment from "moment";
import { useEffect, useState } from "react";
const useProducts = () => {
  const { isMounted } = useIsMounted();
  const [products, setProducts] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const BASE_URL = "https://fakestoreapi.com/products";
        const results = await (await fetch(BASE_URL)).json();
        if (isMounted.current)
          setProducts(
            results?.map((item, index) => ({
              ...item,
              id: `${index}`,
              index,
              created_at: moment().format("Do MMM YYYY hh:mm A"),
            }))
          );
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [isMounted]);

  return { products };
};

export default useProducts;
