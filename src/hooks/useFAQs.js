import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useFAQs = () => {
  const [faqs, setFaqs] = useState(null);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const BASE_URL = "https://opentdb.com/api.php?amount=10";
        const { results } = await (await fetch(BASE_URL)).json();
        isMounted.current &&
          setFaqs(results?.map((item, index) => ({ ...item, id: index })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchFaqs();
  }, [isMounted]);
  return { faqs };
};

export default useFAQs;
