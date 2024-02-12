import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

const App = () => {

  const fetchTodos = async ({ pageParam }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`
    );
    return res.json();
  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchTodos,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  })
  return status === 'pending' ? (
    <p className='text-center text-xl font-bold'>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.map((project) => (
            <p className='text-center text-2xl my-5 bg-purple-400 py-5 font-bold' key={project.id}>{project.title}</p>
          ))}
        </React.Fragment>
      ))}
      <div className='text-center'>
        <button
          className='px-8 py-3 bg-blue-500 rounded-md text-white mb-5'
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
}

export default App;