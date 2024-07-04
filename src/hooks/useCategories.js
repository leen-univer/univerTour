import moment from "moment";
import { useEffect, useState } from "react";
import { useIsMounted, useProducts } from "hooks";
const useCategories = () => {
  const { isMounted } = useIsMounted();
  const [categories, setCategories] = useState(null);
  const { products } = useProducts();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const BASE_URL = "https://fakestoreapi.com/products/categories";
        const results = await (await fetch(BASE_URL)).json();
        const categoriesData = results?.reduce((acc, name, index) => {
          const productsOfCategory = products
            ?.filter((item) => item?.category === name)
            ?.map((item, index) => ({ ...item, index }));
          acc[index] = {
            name,
            index,
            id: `${index}`,
            products: productsOfCategory,
            numberOfProducts: productsOfCategory?.length,
            created_at: moment().format("Do MMM YYYY hh:mm A"),
          };
          return acc;
        }, []);
        if (isMounted.current) setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [isMounted, products]);

  return { categories };
};

export default useCategories;
