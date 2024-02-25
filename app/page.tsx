/* eslint-disable @next/next/no-img-element */
"use client";

import { useTodo } from '@/hooks/useTodo'
import React, { useMemo } from 'react'

export default function Home() {
  
  const { 
    currentStatus,
    groupTodo,
    onChangeStatus,
    setDeleteId,
    modalState: [showModal, setShowModal],
    onDelete,
    observerTarget,
    connection,
  } = useTodo()

  const StatusSelection = useMemo(() => {
    const inactive = "cursor-pointer inline-block w-full my-3 p-2 text-gray-400 font-bold rounded-full"
    const active = "text-white bg-gradient-to-r from-blue-300 to-indigo-400 " + inactive
    return <>
    <div className="absolute bottom-(10) left-0 w-full px-8 ">
      <ul className="text-md leading-4 font-medium text-center flex justify-around rounded-full bg-gray-100 px-3">
        <li className="w-1/3">
          <div
            className={currentStatus === 'TODO' ? active : inactive} 
            aria-current="page"
            onClick={() => onChangeStatus('TODO')}
          >
            To-do
          </div>
        </li>
        <li className="w-1/3">
          <div
            className={currentStatus === 'DOING' ? active : inactive}
            aria-current="page"
            onClick={() => onChangeStatus('DOING')}
          >
            Doing
          </div>
        </li>
        <li className="w-1/3">
          <div
            className={currentStatus === 'DONE' ? active : inactive}
            aria-current="page"
            onClick={() => onChangeStatus('DONE')}
          >
            Done
          </div>
        </li>
      </ul>
    </div>
  </>
  }, [currentStatus])

  const Trash = () => {
    return (
      <svg
        className="h-6 w-6 text-gray-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />{" "}
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
        <line x1="10" y1="11" x2="10" y2="17" />{" "}
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    )
  }

  const Loading = useMemo(() => {
    return <div className="flex justify-center"><div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span>
    </div></div>
  }, [])

  const TodoList = useMemo(() => {
    const list = Object.keys(groupTodo).map((key) => {
      return <div className="flex flex-col px-8 pb-4" id="#todo" key={key}>
        <div className="flex text-gray-900 py-2 font-bold">{key}</div>
        {groupTodo[key].map((todo) => <div className="flex justify-between pb-2.5" key={todo.id}>
          <div className="flex">
            <img
              className="self-start h-10 w-10 rounded-lg mt-1 mr-2"
              src="https://w7.pngwing.com/pngs/670/265/png-transparent-checkmark-done-exam-list-pencil-todo-xomo-basics-icon-thumbnail.png"
              alt="avatar"
            />
            <div className="flex-col self-start ps-2 pr-3">
              <div className="text-gray-900 font-bold">{todo.title}</div>
              <div className="text-gray-500 text-sm">{todo.description}</div>
            </div>
          </div>
          <div className="self-center">
            <button
              className="border-none"
              data-modal-target="popup-modal"
              data-modal-toggle="popup-modal"
              type="button"
              onClick={() => {
                setDeleteId(todo.id)
                setShowModal(true)
              }}
            >
              <Trash/>
            </button>
          </div>
        </div>
        )}
      </div>
    })
    return <>
      {list}
      <div ref={observerTarget}></div>
      {connection.loading && Loading}
    </>
  }, [groupTodo, connection.loading])

  return (
    <>
      <div className="bg-indigo-400 h-screen px-5 py-8">
        <div className="bg-white h-full rounded-lg overflow-hidden flex flex-col">
          <div className="bg-indigo-100 rounded-lg px-3 py-6 mb-12">
            <div className="flex justify-end">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="avatar"
              />
            </div>
            <div className="flex-col ps-5 text-gray-500 font-bold pb-10">
              <h1>Hi! User</h1>
              <h3>This is just a sample UI.</h3>
              <h3>Open to create your style :D</h3>
            </div>
            {StatusSelection}
          </div>
          <div className="overflow-y-scroll h-full pb-6">
            {TodoList}
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h5 className="text-xl font-medium leading-normal text-black">
                    Delete
                  </h5>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-gray-800 text-lg">
                  Are you sure you want to delete?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="bg-gray-100 text-blue-400 active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    CANCEL
                  </button>
                  <button
                    className="bg-red-400 text-white active:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      onDelete();
                      setShowModal(false);
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
