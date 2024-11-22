import React, { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./index.css";

const ContentList = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [query, setQuery] = useState("");

  const toggleInputVisibility = () => {
    setIsInputVisible(prevState => !prevState);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const fetchPages = async ({ pageParam }) => {
    const res = await fetch(
      `https://test.create.diagnal.com/data/page${pageParam}.json`
    );
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["pages"],
      queryFn: fetchPages,
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
    });

  const title = useMemo(() => {
    return data?.pages?.[0]?.page?.title;
  }, [data?.pages]);

  const contentList = useMemo(() => {
    let content = [];
    for (let index = 0; index < data?.pages?.length; index++) {
      const page = data?.pages?.[index]?.page?.["content-items"]?.content;
      content = [...content, ...page];
    }
    return content;
  }, [data?.pages]);

  const filteredData = useMemo(() => {
    if(query?.length){
      return contentList.filter(f => (f.name.toLowerCase()).includes(query.toLowerCase()))
    }
    return contentList
  },[contentList, query])

  const handleImageLoadError = (e) => {
    e.target.src="https://i.pinimg.com/736x/cf/df/71/cfdf7123f69072b4986167c7133b814e.jpg"
  }
  const handleScroll = () => {
    if (
      document.body.scrollHeight - 500 <
      window.scrollY + window.innerHeight && hasNextPage
    ) {
      fetchNextPage()
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
return () =>{
  window.removeEventListener('scroll', handleScroll)
}
  })

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center fixed">
        <div className="flex gap-2 w-full items-center">
          <img
            width="20px"
            src="https://test.create.diagnal.com/images/Back.png"
            alt="back"
          />
          <div> {title}</div>
        </div>
        <div className={`${isInputVisible ? "hidden" : ""} search-icon`}>
          <img
            width="20px"
            src="https://test.create.diagnal.com/images/search.png"
            alt="search"
            onClick={toggleInputVisibility}
          />
        </div>
        <div>
        <input
        type="text"
        className={`search-input ${isInputVisible ? "show" : ""}`}
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        onBlur={() => setIsInputVisible(false)}
      />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-y-3-5 gap-x-10 overflow-x-hidden p-3 mt-10">
        {filteredData?.map((item) => {
          return (
            <div className="flex flex-col gap-2">
              <div>
                <img
                  width="140px"
                  height="205px"
                  alt={item?.name}
                  src={`https://test.create.diagnal.com/images/${item?.["poster-image"]}`}
                  onError={handleImageLoadError}
                />
              </div>
              <div>{item?.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentList;
