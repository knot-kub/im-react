/* eslint-disable @next/next/no-img-element */
"use client";

import { useTodo } from "@/hooks/useTodo";
import React, { useMemo, useState } from "react";
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";

export default function Home() {
  
  const { 
    currentStatus,
    groupTodo,
    onChangeStatus,
    setDeleteId,
    modalState: [showModal, setShowModal],
    onDelete,
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
    );
  };

  const TodoList = useMemo(() => {
    const list = Object.keys(groupTodo).map((key) => {
      return <div className="flex flex-col px-8 py-2" id="#todo" key={key}>
        <div className="flex text-gray-900 py-2 font-bold">{key}</div>
        {groupTodo[key].map((todo) => <div className="flex justify-between" key={todo.id}>
          <div className="flex">
            <img
              className="self-center h-10 w-10 rounded-lg"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="avatar"
            />
            <div className="flex-col self-center ps-2">
              <div className="text-gray-900 font-bold">{todo.title}</div>
              <div className="text-gray-500">{todo.description}</div>
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
    return list
  }, [groupTodo])

  

  return (
    <>
      <div className="bg-indigo-400 h-screen px-5 py-8">
        <div className="bg-white h-full rounded-lg overflow-hidden">
          <div className="bg-indigo-100 rounded-lg px-3 py-6 relative">
            <div className="flex justify-end">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="avartar"
              />
            </div>
            <div className="flex-col ps-5 text-gray-500 font-bold pb-10">
              <h1>Hi! User</h1>
              <h3>This is just a sample UI.</h3>
              <h3>Open to create your style :D</h3>
            </div>
            {StatusSelection}
          </div>
          <div className="mt-12" />
          <div className="overflow-y-scroll">
            {TodoList}
          </div>
        </div>
      </div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="sm" centered={true}>
          <TEModalContent>
            <TEModalHeader>
              {/* <!--Modal title--> */}
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                Delete
              </h5>
              {/* <!--Close button--> */}
              <button
                type="button"
                className="box-content text-gray-800 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                X
              </button>
            </TEModalHeader>
            {/* <!--Modal body--> */}
            <TEModalBody>
              <div className="text-gray-800">
                Are you sure you want to delete?
              </div>
            </TEModalBody>
            <TEModalFooter className="flex justify-between">
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  onClick={() => setShowModal(false)}
                >
                  CANCEL
                </button>
              </TERipple>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#fca5a5] transition duration-150 ease-in-out hover:bg-red-600 hover:shadow-[0_8px_9px_-4px_rgba(255, 99, 71, 0.5),0_4px_18px_0_rgba(255, 99, 71, 0.5)] focus:bg-red-600 focus:shadow-[0_8px_9px_-4px_rgba(255, 99, 71, 0.5),0_4px_18px_0_rgba(248 113 113,0.2)] focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-[0_8px_9px_-4px_rgba(255, 99, 71, 0.5),0_4px_18px_0_rgba(255, 99, 71, 0.5)]"
                  onClick={() => {
                    onDelete()
                    setShowModal(false)
                  }}
                >
                  DELETE
                </button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </>
  );
}
